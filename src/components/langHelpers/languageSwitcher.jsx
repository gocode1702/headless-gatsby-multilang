import React, { useContext } from "react";

import { graphql, useStaticQuery, Link } from "gatsby";

import styled from "styled-components";

import { LocaleContext } from "../../context/langProviderV2";

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
    currentLocale,
    pageType,
    slug: pageSlug,
    archivePageNumber,
  } = useContext(LocaleContext);

  const isArchiveRoot = pageType === "isArchive" && archivePageNumber === 1;

  return (
    <LangNav>
      {pageType === "isHomeDefaultLang" ? (
        <LangNavList>
          {data.allDatoCmsSite.nodes.map(({ locale }) => (
            <li key={locale}>
              <LanguageSwitcherLink
                className={locale === currentLocale && "activeClassLangNav"}
                as={locale === currentLocale && "span"}
                to={locale === defaultLanguage ? "/" : `/${locale}`}
              >
                {locale}
              </LanguageSwitcherLink>
            </li>
          ))}
        </LangNavList>
      ) : pageType === "IsHomeSecondaryLang" ? (
        <LangNavList>
          {data.allDatoCmsSite.nodes.map(({ locale }) => (
            <li key={locale}>
              <LanguageSwitcherLink
                className={locale === currentLocale && "activeClassLangNav"}
                as={locale === currentLocale && "span"}
                to={locale === defaultLanguage ? "/" : `/${locale}`}
              >
                {locale}
              </LanguageSwitcherLink>
            </li>
          ))}
        </LangNavList>
      ) : isArchiveRoot ? (
        <LangNavList>
          {data.allDatoCmsSite.nodes.map(({ locale }) => (
            <li key={locale}>
              <LanguageSwitcherLink
                className={locale === currentLocale && "activeClassLangNav"}
                as={locale === currentLocale && "span"}
                to={
                  locale === defaultLanguage
                    ? `/${defaultBlogPath}`
                    : `/${locale}/${defaultBlogPath}`
                }
              >
                {locale}
              </LanguageSwitcherLink>
            </li>
          ))}
        </LangNavList>
      ) : pageType === "isArchive" && !isArchiveRoot ? (
        <LangNavList>
          {data.allDatoCmsSite.nodes.map(({ locale }) => (
            <li key={locale}>
              <LanguageSwitcherLink
                className={locale === currentLocale && "activeClassLangNav"}
                as={locale === currentLocale && "span"}
                to={
                  locale === defaultLanguage
                    ? `/${defaultBlogPath}/${archivePageNumber}`
                    : `/${locale}/${defaultBlogPath}/${archivePageNumber}`
                }
              >
                {locale}
              </LanguageSwitcherLink>
            </li>
          ))}
        </LangNavList>
      ) : pageType === "isPost" ? (
        <LangNavList>
          {data.allDatoCmsSite.nodes.map(({ locale }) =>
            locale === currentLocale ? (
              <li key={locale}>
                <LanguageSwitcherLink as="span" className="activeClassLangNav">
                  {locale}
                </LanguageSwitcherLink>
              </li>
            ) : (
              data.allSitePage.nodes.map(
                ({
                  context: {
                    locale: contextLocale,
                    slug: contextSlug,
                    reference: contextReference,
                  },
                }) =>
                  contextSlug === pageSlug &&
                  // Is there a page with the same slug as the page I'm rendering
                  contextLocale === currentLocale &&
                  // which has the same reference of the page I found before?// which has the same locale of the page I'm rendering? // The above condition will occur only once avoiding duplicated languages rendered inside the switcher when an article has the same slug for different languages
                  data.allSitePage.nodes.map(
                    // Ok, iterate again through all the pages...
                    ({
                      context: {
                        locale: matchLocale,
                        slug: matchSlug,
                        reference: matchReference,
                      },
                    }) =>
                      matchLocale === locale &&
                      // Is there a page of the same locale switcher I am rendering
                      matchReference === contextReference && (
                        // which has the same reference of the page I found before?
                        <li key={locale}>
                          <LanguageSwitcherLink
                            to={
                              locale === defaultLanguage
                                ? `/${defaultBlogPath}/${matchSlug}`
                                : `/${locale}/${defaultBlogPath}/${matchSlug}` // => Render the correspondent slug
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
      ) : (
        pageType === "isPage" && (
          <LangNavList>
            {data.allDatoCmsSite.nodes.map(({ locale }) =>
              locale === currentLocale ? (
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
                  ({
                    context: {
                      locale: contextLocale,
                      slug: contextSlug,
                      reference: contextReference,
                    },
                  }) =>
                    contextSlug === pageSlug &&
                    contextLocale === currentLocale &&
                    data.allSitePage.nodes.map(
                      ({
                        context: {
                          locale: matchLocale,
                          slug: matchSlug,
                          reference: matchReference,
                        },
                      }) =>
                        matchLocale === locale &&
                        contextReference === matchReference && (
                          <li key={locale}>
                            <LanguageSwitcherLink
                              to={
                                locale === defaultLanguage
                                  ? `/${matchSlug}`
                                  : `/${locale}/${matchSlug}`
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
