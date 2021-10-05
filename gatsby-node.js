const path = require("path");
const fs = require("fs");
const https = require("https");

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  // Since graphql won't work in any other API except createPages,
  // website settings must be fetched and exported now inside this extension.
  // Although it is possible to run a single query to use for any createPage call,
  // I decided to split them for each step in order to show the process in a cleaner way
  // and simplify the customization.

  // Colors - Begin

  const settingsQuery = await graphql(`
    query {
      datoCmsWebsiteSetting {
        primaryColor {
          hex
        }
        primaryDark {
          hex
        }
        primaryLight {
          hex
        }
        headingsColor {
          hex
        }
        baseTextColor {
          hex
        }
        baseTextColorDark {
          hex
        }
        disabledColor {
          hex
        }
        dividerColor {
          hex
        }
        markColor {
          hex
        }
      }
    }
  `);

  // Query the settings model on DatoCMS and define a path to export the queried settings
  const settings = settingsQuery.data.datoCmsWebsiteSetting;
  const settingsPath = "src/static";

  // Create the path if it doesn't exist
  if (!fs.existsSync(settingsPath)) fs.mkdirSync(settingsPath);

  // Save the JSON file with css color variables
  fs.writeFileSync(
    `${settingsPath}/settings.json`,
    JSON.stringify(settings, undefined, 2)
  );

  // Colors - End

  // Blog and pages generation

  // Blog and locales settings query, the first block is used to retrieve blog settings and
  // the second one to retrieve a list of all languages available

  const globalSettingsQuery = await graphql(`
    query {
      datoCmsWebsiteSetting {
        blogPath
        postsPerPage
      }
      allDatoCmsSite {
        edges {
          node {
            locale
          }
        }
      }
    }
  `);

  // Archive pages generation based on locale with pagination
  // Blog posts should be sorted using the same fields as in any other template
  // in order to have a coherent prev/next navigation.

  const blogQuery = await graphql(`
    query {
      allDatoCmsBlogPost(sort: { fields: [locale, meta___firstPublishedAt] }) {
        edges {
          node {
            originalId
            locale
            slug
            reference
          }
        }
      }
    }
  `);

  const defaultLanguage =
    globalSettingsQuery.data.allDatoCmsSite.edges[0].node.locale;
  const blogPathName = globalSettingsQuery.data.datoCmsWebsiteSetting.blogPath;
  const allLanguages = globalSettingsQuery.data.allDatoCmsSite.edges;
  const allBlogPosts = blogQuery.data.allDatoCmsBlogPost.edges;
  const allBlogPostsPerLocale = allBlogPosts.length / allLanguages.length;
  const postsPerPage = // eslint-disable-line prefer-destructuring
    globalSettingsQuery.data.datoCmsWebsiteSetting.postsPerPage; // eslint-disable-line prefer-destructuring
  const pagesNumber = Math.ceil(allBlogPostsPerLocale / postsPerPage);

  const ArchiveTemplate = path.resolve("src/templates/archive.jsx");

  allLanguages.forEach((edge) => {
    Array.from({ length: pagesNumber }).forEach((_, index) => {
      createPage({
        path:
          // If generating the first default language archive page
          edge.node.locale === defaultLanguage && index === 0
            ? `/${blogPathName}` // => /blog
            : // If not generating the first default language archive page
            edge.node.locale === defaultLanguage && index > 0
            ? `/${blogPathName}/${index + 1}` // => /blog/num
            : // If generating the first non-default language archive page
            edge.node.locale !== defaultLanguage && index === 0
            ? `/${edge.node.locale}/${blogPathName}` // => /lang/blog
            : // If not generation the first non-default language archive page
            edge.node.locale !== defaultLanguage && index > 0
            ? `/${edge.node.locale}/${blogPathName}/${index + 1}` // => /lang/blog/num
            : "/",
        component: ArchiveTemplate,
        context: {
          locale: edge.node.locale,
          limit: postsPerPage,
          skip: index * postsPerPage,
          pagesNumber,
          currentPage: index + 1,
        },
      });
    });
  });

  // Articles Generation

  const ArticleTemplate = path.resolve("src/templates/article.jsx");

  allLanguages.forEach((language) => {
    let pageCounter = 0;

    // Iterate trought all available locales, and increase
    // the counter when an article is generated,
    // since the query results are sorted with the same field for each locale
    // we can export a skipNext variable which we will use to skip all the previous posts.

    blogQuery.data.allDatoCmsBlogPost.edges
      .filter((edge) => edge.node.locale === language.node.locale)
      .forEach((edge) => {
        pageCounter += 1;
        createPage({
          path: `${
            edge.node.locale === defaultLanguage
              ? `${blogPathName}/${edge.node.slug}`
              : edge.node.locale !== defaultLanguage
              ? `${edge.node.locale}/${blogPathName}/${edge.node.slug}`
              : "/"
          }`,
          component: ArticleTemplate,
          context: {
            id: edge.node.originalId,
            locale: edge.node.locale,
            slug: edge.node.slug,
            reference: edge.node.reference,
            articlesPerLocale: allBlogPostsPerLocale,

            // If generating the last article, assign the value "0" since
            // there won't be next posts to display

            skipNext: pageCounter === allBlogPostsPerLocale ? 0 : pageCounter,

            // If generating the first article, assign the value 1 or the GraphQL
            // query will fail having a skip variable < 0 and a limit variable > 0.

            skipPrevious: pageCounter === 1 ? 1 : pageCounter - 2,
          },
        });
      });
  });

  // Pages generation

  // Homepage Generation - Based on a specific template

  const homePageGeneration = await graphql(`
    query {
      allDatoCmsHomepage {
        nodes {
          locale
        }
      }
    }
  `);

  const HomePageTemplate = path.resolve("src/templates/home.jsx");

  homePageGeneration.data.allDatoCmsHomepage.nodes.forEach(({ locale }) => {
    createPage({
      path: `${locale === defaultLanguage ? "/" : locale}`,
      component: HomePageTemplate,
      context: {
        locale,
      },
    });
  });

  // Other pages generation - Sharing the same template

  const otherPagesGeneration = await graphql(`
    query {
      allDatoCmsOtherPage {
        nodes {
          id: originalId
          locale
          slug
          reference
        }
      }
    }
  `);

  const OtherPageTemplate = path.resolve("src/templates/otherPage.jsx");

  otherPagesGeneration.data.allDatoCmsOtherPage.nodes.forEach(
    ({ locale, slug, id, reference }) => {
      createPage({
        path: `${
          locale === defaultLanguage ? `/${slug}` : `${locale}/${slug}`
        }`,
        component: OtherPageTemplate,
        context: {
          id,
          locale,
          slug,
          reference,
        },
      });
    }
  );

  // Webmanifest generation

  const webManifestGeneration = await graphql(`
    query {
      allDatoCmsWebsiteSetting {
        nodes {
          name
          shortName
          locale
          pwaIcon {
            icon: url(imgixParams: { w: "32", h: "32" })
            normalSize: url(imgixParams: { w: "192", h: "192" })
            bigSize: url(imgixParams: { w: "512", h: "512" })
          }
          backgroundColor {
            hex
          }
          primaryColor {
            hex
          }
        }
      }
    }
  `);

  const {
    pwaIcon,
    name,
    shortName,
    description,
    locale,
    backgroundColor,
    primaryColor,
  } = webManifestGeneration.data.allDatoCmsWebsiteSetting.nodes[0];

  const publicPath = "public";
  const imagesPath = "public/images";

  // Create full path
  if (!fs.existsSync(imagesPath)) fs.mkdirSync(imagesPath);

  // Download resized icons

  const iconNormal = fs.createWriteStream(`${imagesPath}/icon-192.png`);
  const iconBig = fs.createWriteStream(`${imagesPath}/icon-512.png`);
  const icon = fs.createWriteStream(`${publicPath}/favicon-32.png`);

  try {
    https.get(`${pwaIcon.normalSize}`, (response) => {
      response.pipe(iconNormal);
    });
    https.get(`${pwaIcon.bigSize}`, (response) => {
      response.pipe(iconBig);
    });
    https.get(`${pwaIcon.icon}`, (response) => {
      response.pipe(icon);
    });
  } catch (err) {
    console.log(err);
  }

  const manifest = {
    name,
    short_name: shortName,
    description,
    lang: locale,
    display: "standalone",
    start_url: "/",
    background_color: backgroundColor.hex,
    theme_color: primaryColor.hex,
    icons: [
      {
        src: "images/icon-192.png",
        type: "image/png",
        sizes: "192x192",
        purpose: "any maskable",
      },
      {
        src: "images/icon-512.png",
        type: "image/png",
        sizes: "512x512",
        purpose: "any maskable",
      },
    ],
    cacheDigest: null,
  };

  // Generate and save manifest to public folder

  fs.writeFileSync(
    `${publicPath}/manifest.webmanifest`,
    JSON.stringify(manifest, undefined, 2)
  );

  // Additional language webmanifest files generation

  const additionalLanguages =
    webManifestGeneration.data.allDatoCmsWebsiteSetting.nodes.length;

  if (additionalLanguages > 1) {
    webManifestGeneration.data.allDatoCmsWebsiteSetting.nodes
      .filter(({ locale }) => locale !== defaultLanguage) // Exclude default language already generated
      .forEach((node) => {
        const manifest = {
          name: node.name,
          short_name: node.shortName,
          description: node.description,
          lang: node.locale,
          display: "standalone",
          start_url: `/${node.locale}/`,
          background_color: backgroundColor.hex,
          theme_color: primaryColor.hex,
          icons: [
            {
              src: "images/icon-192.png",
              type: "image/png",
              sizes: "192x192",
              purpose: "any maskable",
            },
            {
              src: "images/icon-512.png",
              type: "image/png",
              sizes: "512x512",
              purpose: "any maskable",
            },
          ],
          cacheDigest: null,
        };
        fs.writeFileSync(
          `${publicPath}/manifest_${node.locale}.webmanifest`,
          JSON.stringify(manifest, undefined, 2)
        );
      });
  }
};
