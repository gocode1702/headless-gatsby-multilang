import React from "react";

import { graphql, useStaticQuery } from "gatsby";

import useSiteUrl from "../hooks/useSiteUrl";

import useLanguages from "../hooks/useLanguages";

import PageWrapper from "../components/layout/pageWrapper";

import Hero from "../components/ui/hero";

import Navigator from "../components/langHelpers/navigator";

const NotFoundPage = () => {
  const data = useStaticQuery(graphql`
    query {
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
    const getSavedLocale = localStorage.getItem(
      `${siteUrl.slice(8)}_preferred_lang`
    );

    const currentLanguageData = data.allDatoCmsNotFoundPage.nodes.filter(
      ({ locale }) => locale === getSavedLocale
    )[0];

    const getProps = () => {
      // If user never visited the website and never set the language preference,
      // Or he set the preference for the default language, display data in default language
      if (!getSavedLocale || getSavedLocale === defaultLanguage)
        return {
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
