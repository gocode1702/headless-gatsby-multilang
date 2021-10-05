import React, { useContext } from "react";

import { graphql, useStaticQuery, Link } from "gatsby";

import styled from "styled-components";

import { LangContext } from "../../context/languageProvider";

import useLanguages from "../../hooks/useLanguages";

// Styles

const LangNavList = styled.ul`
  display: grid;
  align-items: center;
  grid-auto-flow: column;
  column-gap: var(--gapRegular);
  & li span {
    cursor: not-allowed;
    &:hover {
      color: var(--disabledColor);
    }
  }

  .activeClassLangNav {
    color: var(--primaryColor);
    &:hover {
      color: var(--primaryColor);
    }
  }
  @media screen and (max-width: 767px) {
    column-gap: 0;
  }
`;

const LangNav = styled.nav`
  text-transform: uppercase;
  &&& {
    display: grid;
    grid-template-columns: 1fr;
  }
`;

const LanguageSwitcherLink = styled(Link)`
  font-weight: 600;
  color: var(--disabledColor);
  transition: color 0.2s linear;
  &:hover {
    color: var(--primaryColor);
  }
  @media screen and (max-width: 767px) {
    padding: var(--gapSmall);
  }
`;

// Main Component

const LanguageSwitcher = () => {
  const data = useStaticQuery(graphql`
    query {
      allDatoCmsSite {
        nodes {
          locale
        }
      }
      allSitePage(
        filter: { context: { slug: { ne: null }, reference: { ne: null } } }
        sort: { fields: context___locale }
      ) {
        nodes {
          context {
            locale
            slug
            reference
          }
        }
      }
    }
  `);

  const { defaultLanguage, defaultBlogPath } = useLanguages();

  const {
    currentLanguage,
    homeDef,
    homeSec,
    isArchiveRoot,
    isPaginatedArchive,
    pageNumber,
    isPage,
    pageName,
    isPost,
    postName,
  } = useContext(LangContext);

  return (
    <LangNav>
      {!isPost && !isPage ? (
        <LangNavList>
          {data.allDatoCmsSite.nodes.map(({ locale }) => (
            <li key={locale}>
              <LanguageSwitcherLink
                className={locale === currentLanguage && "activeClassLangNav"}
                as={locale === currentLanguage && "span"}
                to={
                  locale === currentLanguage // Remove attribute if rendering the switcher for the current language
                    ? "/"
                    : // Am I rendering the switcher for the default language in a non-default language homepage?
                    locale === defaultLanguage && homeSec
                    ? "/"
                    : // Am I rendering the switcher for a non-default language in a default language homepage?
                    locale !== defaultLanguage &&
                      homeDef &&
                      currentLanguage === defaultLanguage
                    ? `/${locale}`
                    : // Am I rendering the switcher for a non-default language in a non-default language homepage?
                    locale !== defaultLanguage && homeSec
                    ? `/${locale}`
                    : // Am I rendering a paginated archive page in default language?
                    locale === defaultLanguage && isPaginatedArchive
                    ? `/${defaultBlogPath}/${pageNumber}`
                    : // Am I rendering a paginated archive page in a non-default language?
                    locale !== defaultLanguage && isPaginatedArchive
                    ? `/${locale}/${defaultBlogPath}/${pageNumber}`
                    : // Am I rendering the root archive page in default language?
                    locale === defaultLanguage && isArchiveRoot
                    ? `/${defaultBlogPath}`
                    : // Am I rendering the root archive page in non-default language?
                    locale !== defaultLanguage && isArchiveRoot
                    ? `/${locale}/${defaultBlogPath}`
                    : "/"
                }
              >
                {locale} {/* => Render the language */}
              </LanguageSwitcherLink>
            </li>
          ))}
        </LangNavList>
      ) : !isPage && isPost ? (
        <LangNavList>
          {data.allDatoCmsSite.nodes.map(({ locale }) =>
            locale === currentLanguage ? (
              <li key={locale}>
                <LanguageSwitcherLink as="span" className="activeClassLangNav">
                  {locale}
                </LanguageSwitcherLink>
              </li>
            ) : (
              data.allSitePage.nodes.map(
                ({ context }) =>
                  context.slug === postName && // Is there a page with the same slug as the page I'm rendering
                  context.locale === currentLanguage && // which has the same locale of the page I'm rendering? // The above condition will occur only once avoiding duplicated languages rendered inside the switcher when an article has the same slug for different languages
                  data.allSitePage.nodes.map(
                    // Ok, iterate again through all the pages...
                    (matchNode) =>
                      matchNode.context.locale === locale && // Is there a page of the same locale switcher I am rendering
                      matchNode.context.reference === context.reference && ( // which has the same reference of the page I found before?
                        <li key={locale}>
                          <LanguageSwitcherLink
                            to={
                              locale === defaultLanguage
                                ? `/${defaultBlogPath}/${matchNode.context.slug}`
                                : `/${locale}/${defaultBlogPath}/${matchNode.context.slug}` // => Render the correspondent slug
                            }
                          >
                            {locale} {/* => Render the locale */}
                          </LanguageSwitcherLink>
                        </li>
                      )
                  )
              )
            )
          )}
        </LangNavList>
      ) : (
        isPage &&
        !isPost && (
          <LangNavList>
            {data.allDatoCmsSite.nodes.map(({ locale }) =>
              locale === currentLanguage ? (
                <li key={locale}>
                  <LanguageSwitcherLink
                    as="span"
                    className="activeClassLangNav"
                  >
                    {locale}
                  </LanguageSwitcherLink>
                </li>
              ) : (
                // Follows the same logic adopted above
                data.allSitePage.nodes.map(
                  ({ context }) =>
                    context.slug === pageName &&
                    context.locale === currentLanguage &&
                    data.allSitePage.nodes.map(
                      (matchNode) =>
                        matchNode.context.locale === locale &&
                        context.reference === matchNode.context.reference && (
                          <li key={locale}>
                            <LanguageSwitcherLink
                              to={
                                locale === defaultLanguage
                                  ? `/${matchNode.context.slug}`
                                  : `/${locale}/${matchNode.context.slug}`
                              }
                            >
                              {locale}
                            </LanguageSwitcherLink>
                          </li>
                        )
                    )
                )
              )
            )}
          </LangNavList>
        )
      )}
    </LangNav>
  );
};

export default LanguageSwitcher;
