import React, { useContext, useState, useEffect } from "react";

import { graphql, useStaticQuery } from "gatsby";

import { LangContext } from "../context/languageProvider";

import PageWrapper from "../components/layout/pageWrapper";

import Hero from "../components/ui/hero";

import Navigator from "../components/langHelpers/navigator";

const NotFoundPage = () => {
  const data = useStaticQuery(graphql`
    query NotFoundPageQuery {
      allDatoCmsNotFoundPage {
        edges {
          node {
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
    }
  `);

  const { currentLanguage } = useContext(LangContext);

  const currentLanguageData = data.allDatoCmsNotFoundPage.edges.filter(
    (edge) => edge.node.locale === currentLanguage
  );

  const defaultLanguageData = data.allDatoCmsNotFoundPage.edges[0].node;

  // In order to avoid localized content update flickerings when 404 GET errors occur, let's delay the rendering of the page by 200ms until URL evaluation is completed

  const [isReachReady, setIsReachReady] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsReachReady(true);
    }, 200);
  }, []);

  const getProps = () => {
    // If user tries to access a non-existent language path e.g. /kx/blog, display data in default language
    if (currentLanguageData[0] === undefined)
      return {
        pageWrapper: {
          seoTitle: defaultLanguageData.seo.title,
          seoDescription: defaultLanguageData.seo.description,
        },
        hero: {
          title: defaultLanguageData.title,
          subtitle: defaultLanguageData.subtitle,
        },
        navigator: {
          text: defaultLanguageData.backToHomeText,
          to: "/",
        },
      };

    // Else display corresponding filtered data
    return {
      pageWrapper: {
        seoTitle: currentLanguageData[0].node.seo.title,
        seoDescription: currentLanguageData[0].node.seo.description,
      },
      hero: {
        title: currentLanguageData[0].node.title,
        subtitle: currentLanguageData[0].node.subtitle,
      },
      navigator: {
        text: currentLanguageData[0].node.backToHomeText,
        home: true,
      },
    };
  };

  return (
    <>
      {isReachReady && (
        <PageWrapper {...getProps().pageWrapper} noHeader noFooter>
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
      )}
    </>
  );
};

export default NotFoundPage;
