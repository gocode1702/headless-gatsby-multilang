import React from "react";
import { graphql, useStaticQuery } from "gatsby";
import useSiteUrl from "../hooks/useSiteUrl";
import useLanguages from "../hooks/useLanguages";
import PageWrapper from "../components/layout/PageWrapper";
import Hero from "../components/layout/Hero";
import Navigator from "../components/langHelpers/Navigator";
import { saveLocale } from "../components/langHelpers/utils";

const NotFoundPage = () => {
  const data = useStaticQuery(graphql`
    query {
      datoCmsSite {
        locales
      }
      allDatoCmsNotFoundPage {
        nodes {
          seo {
            title
            description
          }
          title
          subtitle
          backToHomeText
          locale
        }
      }
    }
  `);

  const { seo, title, subtitle, backToHomeText } =
    data.allDatoCmsNotFoundPage.nodes[0];

  const isSSR = typeof window === "undefined";

  const { defaultLanguage } = useLanguages();

  const { siteUrl } = useSiteUrl();

  if (!isSSR) {
    const websiteLangCodes = data.datoCmsSite.locales;
    const browserLangCodes = navigator.languages.map((language) =>
      language.slice(0, 2)
    );
    const preferredLanguages = browserLangCodes.filter((websiteLang) =>
      websiteLangCodes.includes(websiteLang)
    );

    const getSavedLocale = localStorage.getItem(
      `${siteUrl.slice(8)}_preferred_lang`
    );

    const currentLanguageData = data.allDatoCmsNotFoundPage.nodes.filter(
      ({ locale }) => locale === getSavedLocale
    )[0];

    const availableLanguageData = data.allDatoCmsNotFoundPage.nodes.filter(
      ({ locale }) => locale === preferredLanguages[0]
    )[0];

    const defaultLangProps = {
      pageWrapper: {
        seoTitle: seo.title,
        seoDescription: seo.description,
        notFoundPageLocale: defaultLanguage,
        notFoundPageManifest: "/manifest.webmanifest",
      },
      hero: {
        title,
        subtitle,
      },
      navigator: {
        children: backToHomeText,
        to: "/",
      },
    };

    const getProps = () => {
      // If user never visited the website and no browser languages match any website language
      if (!getSavedLocale && !preferredLanguages)
        return { ...defaultLangProps };

      // If user never visited the website and its preferred language is equal to defaultLanguage
      if (
        !getSavedLocale &&
        preferredLanguages.length > 0 &&
        preferredLanguages[0] === defaultLanguage
      ) {
        saveLocale(siteUrl, defaultLanguage);
        return { ...defaultLangProps };
      }

      // If user never visited the website and its preferred language is not equal to defaultLanguage
      if (
        !getSavedLocale &&
        preferredLanguages.length > 0 &&
        preferredLanguages[0] !== defaultLanguage
      ) {
        saveLocale(siteUrl, preferredLanguages[0]);
        return {
          pageWrapper: {
            seoTitle: availableLanguageData.seo.title,
            seoDescription: availableLanguageData.seo.description,
            notFoundPageLocale: preferredLanguages[0],
            notFoundPageManifest: `/manifest_${preferredLanguages[0]}.webmanifest`,
          },
          hero: {
            title: availableLanguageData.title,
            subtitle: availableLanguageData.subtitle,
          },
          navigator: {
            children: availableLanguageData.backToHomeText,
            notFoundPage: `/${preferredLanguages[0]}`,
          },
        };
      }

      // If user already visited the website and its preferred language is equal to defaultLanguage
      if (getSavedLocale === defaultLanguage) return { ...defaultLangProps };

      // Else display corresponding data for saved language
      return {
        pageWrapper: {
          seoTitle: currentLanguageData.seo.title,
          seoDescription: currentLanguageData.seo.description,
          notFoundPageLocale: getSavedLocale,
          notFoundPageManifest: `/manifest_${getSavedLocale}.webmanifest`,
        },
        hero: {
          title: currentLanguageData.title,
          subtitle: currentLanguageData.subtitle,
        },
        navigator: {
          children: currentLanguageData.backToHomeText,
          notFoundPage: `/${getSavedLocale}`,
        },
      };
    };

    return (
      <PageWrapper {...getProps().pageWrapper} notFoundPage noHeader noFooter>
        <Hero
          {...getProps().hero}
          fullView
          centered
          button={
            <Navigator
              {...getProps().navigator}
              className="classicButton classicButtonOutline"
            />
          }
        />
      </PageWrapper>
    );
  } else return null;
};

export default NotFoundPage;
