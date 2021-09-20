import { useContext } from "react";

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
        edges {
          node {
            locale
          }
        }
      }
      allSitePage(
        filter: { context: { slug: { ne: null }, reference: { ne: null } } }
        sort: { fields: context___locale }
      ) {
        edges {
          node {
            context {
              locale
              slug
              reference
            }
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
          {data.allDatoCmsSite.edges.map((edge) => (
            <li key={edge.node.locale}>
              <LanguageSwitcherLink
                className={
                  edge.node.locale === currentLanguage && "activeClassLangNav"
                }
                as={edge.node.locale === currentLanguage && "span"}
                to={
                  edge.node.locale === currentLanguage // Remove attribute if rendering the switcher for the current language
                    ? "/"
                    : // Am I rendering the switcher for the default language in a non-default language homepage?
                    edge.node.locale === defaultLanguage && homeSec
                    ? "/"
                    : // Am I rendering the switcher for a non-default language in a default language homepage?
                    edge.node.locale !== defaultLanguage &&
                      homeDef &&
                      currentLanguage === defaultLanguage
                    ? `/${edge.node.locale}`
                    : // Am I rendering the switcher for a non-default language in a non-default language homepage?
                    edge.node.locale !== defaultLanguage && homeSec
                    ? `/${edge.node.locale}`
                    : // Am I rendering a paginated archive page in default language?
                    edge.node.locale === defaultLanguage && isPaginatedArchive
                    ? `/${defaultBlogPath}/${pageNumber}`
                    : // Am I rendering a paginated archive page in a non-default language?
                    edge.node.locale !== defaultLanguage && isPaginatedArchive
                    ? `/${edge.node.locale}/${defaultBlogPath}/${pageNumber}`
                    : // Am I rendering the root archive page in default language?
                    edge.node.locale === defaultLanguage && isArchiveRoot
                    ? `/${defaultBlogPath}`
                    : // Am I rendering the root archive page in non-default language?
                    edge.node.locale !== defaultLanguage && isArchiveRoot
                    ? `/${edge.node.locale}/${defaultBlogPath}`
                    : "/"
                }
              >
                {edge.node.locale} {/* => Render the language */}
              </LanguageSwitcherLink>
            </li>
          ))}
        </LangNavList>
      ) : !isPage && isPost ? (
        <LangNavList>
          {data.allDatoCmsSite.edges.map((edge) =>
            edge.node.locale === currentLanguage ? (
              <li key={edge.node.locale}>
                <LanguageSwitcherLink as="span" className="activeClassLangNav">
                  {edge.node.locale}
                </LanguageSwitcherLink>
              </li>
            ) : (
              data.allSitePage.edges.map(
                (page) =>
                  page.node.context.slug === postName && // Is there a page with the same slug as the page I'm rendering
                  page.node.context.locale === currentLanguage && // which has the same locale of the page I'm rendering? // The above condition will occur only once avoiding duplicated languages rendered inside the switcher when an article has the same slug for different languages
                  data.allSitePage.edges.map(
                    // Ok, iterate again through all the pages...
                    (locPage) =>
                      locPage.node.context.locale === edge.node.locale && // Is there a page of the same locale switcher I am rendering
                      locPage.node.context.reference ===
                        page.node.context.reference && ( // which has the same reference of the page I found before?
                        <li key={edge.node.locale}>
                          <LanguageSwitcherLink
                            to={
                              edge.node.locale === defaultLanguage
                                ? `/${defaultBlogPath}/${locPage.node.context.slug}`
                                : `/${edge.node.locale}/${defaultBlogPath}/${locPage.node.context.slug}` // => Render the correspondent slug
                            }
                          >
                            {edge.node.locale} {/* => Render the locale */}
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
            {data.allDatoCmsSite.edges.map((edge) =>
              edge.node.locale === currentLanguage ? (
                <li key={edge.node.locale}>
                  <LanguageSwitcherLink
                    as="span"
                    className="activeClassLangNav"
                  >
                    {edge.node.locale}
                  </LanguageSwitcherLink>
                </li>
              ) : (
                // Follows the same logic adopted above
                data.allSitePage.edges.map(
                  (page) =>
                    page.node.context.slug === pageName &&
                    page.node.context.locale === currentLanguage &&
                    data.allSitePage.edges.map(
                      (locPage) =>
                        locPage.node.context.locale === edge.node.locale &&
                        page.node.context.reference ===
                          locPage.node.context.reference && (
                          <li key={edge.node.locale}>
                            <LanguageSwitcherLink
                              to={
                                edge.node.locale === defaultLanguage
                                  ? `/${locPage.node.context.slug}`
                                  : `/${edge.node.locale}/${locPage.node.context.slug}`
                              }
                            >
                              {edge.node.locale}
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
