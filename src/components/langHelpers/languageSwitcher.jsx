import React, { useContext } from "react";

import { graphql, useStaticQuery, Link } from "gatsby";

import styled from "styled-components";

import { LangContext } from "../../context/langProvider";

import useLanguages from "../../hooks/useLanguages";

import useSiteUrl from "../../hooks/useSiteUrl";

// Scoped styles

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
    pageType,
    slug: pageSlug,
    archivePageNumber,
  } = useContext(LangContext);

  const isArchiveRoot = pageType === "isArchive" && archivePageNumber === 1;

  const isPaginatedArchive = pageType === "isArchive" && !isArchiveRoot;

  const { siteUrl } = useSiteUrl();

  const saveLocale = (locale) =>
    localStorage.setItem(`${siteUrl.slice(8)}_preferred_lang`, locale);

  return (
    <LangNav>
      {pageType === "isHomeDefaultLang" ? (
        <LangNavList>
          {data.allDatoCmsSite.nodes.map(({ locale }) => (
            <li key={locale}>
              <LanguageSwitcherLink
                className={locale === currentLanguage && "activeClassLangNav"}
                as={locale === currentLanguage && "span"}
                to={locale === defaultLanguage ? "/" : `/${locale}`}
                onClick={() => saveLocale(locale)}
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
                className={locale === currentLanguage && "activeClassLangNav"}
                as={locale === currentLanguage && "span"}
                to={locale === defaultLanguage ? "/" : `/${locale}`}
                onClick={() => saveLocale(locale)}
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
                className={locale === currentLanguage && "activeClassLangNav"}
                as={locale === currentLanguage && "span"}
                to={
                  locale === defaultLanguage
                    ? `/${defaultBlogPath}`
                    : `/${locale}/${defaultBlogPath}`
                }
                onClick={() => saveLocale(locale)}
              >
                {locale}
              </LanguageSwitcherLink>
            </li>
          ))}
        </LangNavList>
      ) : isPaginatedArchive ? (
        <LangNavList>
          {data.allDatoCmsSite.nodes.map(({ locale }) => (
            <li key={locale}>
              <LanguageSwitcherLink
                className={locale === currentLanguage && "activeClassLangNav"}
                as={locale === currentLanguage && "span"}
                to={
                  locale === defaultLanguage
                    ? `/${defaultBlogPath}/${archivePageNumber}`
                    : `/${locale}/${defaultBlogPath}/${archivePageNumber}`
                }
                onClick={() => saveLocale(locale)}
              >
                {locale}
              </LanguageSwitcherLink>
            </li>
          ))}
        </LangNavList>
      ) : pageType === "isPost" ? (
        <LangNavList>
          {data.allDatoCmsSite.nodes.map(({ locale }) =>
            locale === currentLanguage ? (
              <li key={locale}>
                <LanguageSwitcherLink as="span" className="activeClassLangNav">
                  {locale}
                </LanguageSwitcherLink>
              </li>
            ) : (
              // Iterate through all the pages generated by gatsby-node.js and check...
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
                  contextLocale === currentLanguage &&
                  // Which has the same locale of the page that I'm rendering the link into?
                  //
                  // The above condition will occur only once avoiding duplicated languages links
                  // inside the switcher when an article has the same slug for different languages
                  //
                  // Then, iterate again through all the pages...
                  data.allSitePage.nodes.map(
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
                        // which has the same reference of the page found before?
                        <li key={locale}>
                          <LanguageSwitcherLink
                            to={
                              locale === defaultLanguage
                                ? `/${defaultBlogPath}/${matchSlug}`
                                : `/${locale}/${defaultBlogPath}/${matchSlug}` // Render the correspondent slug
                            }
                            onClick={() => saveLocale(locale)}
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
                  ({
                    context: {
                      locale: contextLocale,
                      slug: contextSlug,
                      reference: contextReference,
                    },
                  }) =>
                    contextSlug === pageSlug &&
                    contextLocale === currentLanguage &&
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
                              onClick={() => saveLocale(locale)}
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
