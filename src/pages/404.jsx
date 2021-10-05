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

  const { currentLanguage } = useContext(LangContext);

  const currentLanguageData = data.allDatoCmsNotFoundPage.nodes.filter(
    (node) => node.locale === currentLanguage
  );

  const { seo, title, subtitle, backToHomeText } =
    data.allDatoCmsNotFoundPage.nodes[0];

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
          seoTitle: seo.title,
          seoDescription: seo.description,
        },
        hero: {
          title: title,
          subtitle: subtitle,
        },
        navigator: {
          text: backToHomeText,
          to: "/",
        },
      };

    // Else display corresponding filtered data
    return {
      pageWrapper: {
        seoTitle: currentLanguageData[0].seo.title,
        seoDescription: currentLanguageData[0].seo.description,
      },
      hero: {
        title: currentLanguageData[0].title,
        subtitle: currentLanguageData[0].subtitle,
      },
      navigator: {
        text: currentLanguageData[0].backToHomeText,
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
