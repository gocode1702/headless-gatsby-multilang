import { useContext } from "react";

import { Helmet } from "react-helmet";

import { graphql, useStaticQuery } from "gatsby";

import { Main } from "./sectionStyles";

import { LangContext } from "../../context/languageProvider";

import useLanguages from "../../hooks/useLanguages";

import useSiteUrl from "../../hooks/useSiteUrl";

import GlobalStyles from "./globalStyles";

import Header from "../ui/header";

import Footer from "../ui/footer";

const PageWrapper = (props) => {
  const data = useStaticQuery(graphql`
    query SeoQuery {
      allDatoCmsWebsiteSetting {
        edges {
          node {
            locale
            siteUrl
            title
            separator
            pageName
            archiveName
            fallbackDescription
            defaultOgImage {
              url
            }
            primaryColor {
              hex
            }
          }
        }
      }
    }
  `);

  const {
    pathname,
    currentLanguage,
    homeDef,
    homeSec,
    isPost,
    isPage,
    isArchiveRoot,
    isPaginatedArchive,
    pageNumber,
  } = useContext(LangContext);

  const defaultLanguage = useLanguages();

  const { siteUrl } = useSiteUrl();

  return (
    <>
      <GlobalStyles />

      <Helmet>
        {/* PWA Tags */}

        <link
          rel="manifest"
          href={
            currentLanguage === defaultLanguage
              ? "/manifest.webmanifest"
              : `/manifest_${currentLanguage}.webmanifest`
          }
          crossOrigin="anonymous"
        />

        <meta
          name="theme-color"
          content={data.allDatoCmsWebsiteSetting.edges[0].node.primaryColor.hex}
        />
        <link rel="icon" href="/favicon-32.png" type="image/png" />
        <link
          rel="apple-touch-icon"
          sizes="192x192"
          href="/images/icon-192.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="512x512"
          href="/images/icon-512.png"
        />

        {/* SEO */}
        <html lang={currentLanguage} />
        <meta property="og:url" content={`${siteUrl}${pathname}`} />
        <meta property="og:type" content="blog" />
        <meta property="twitter:url" content={`${siteUrl}${pathname}`} />

        {data.allDatoCmsWebsiteSetting.edges
          .filter((edge) => edge.node.locale === currentLanguage)
          .map((edge) => [
            <title>
              {(props.seoTitle && homeDef) ||
              (props.seoTitle && homeSec) ||
              (props.seoTitle && isPage) ||
              (props.seoTitle && isArchiveRoot)
                ? `${props.seoTitle} ${edge.node.separator} ${edge.node.title}`
                : props.seoTitle && isPost
                ? `${props.seoTitle} ${edge.node.separator} ${edge.node.archiveName} ${edge.node.separator} ${edge.node.title}`
                : props.seoTitle && isPaginatedArchive
                ? `${edge.node.pageName} ${pageNumber} ${edge.node.separator} ${props.seoTitle} ${edge.node.separator} ${edge.node.title}`
                : edge.node.title}
            </title>,
            <meta
              name="description"
              content={props.seoDescription || edge.node.fallbackDescription}
            />,
            <meta
              property="og:title"
              content={
                (props.seoTitle && homeDef) ||
                (props.seoTitle && homeSec) ||
                (props.seoTitle && isPage) ||
                (props.seoTitle && isArchiveRoot)
                  ? `${props.seoTitle} ${edge.node.separator} ${edge.node.title}`
                  : props.seoTitle && isPost
                  ? `${props.seoTitle} ${edge.node.separator} ${edge.node.archiveName} ${edge.node.separator} ${edge.node.title}`
                  : props.seoTitle && isPaginatedArchive
                  ? `${edge.node.pageName} ${pageNumber} ${edge.node.separator} ${props.seoTitle} ${edge.node.separator} ${edge.node.title}`
                  : edge.node.title
              }
            />,
            <meta
              property="og:description"
              content={props.seoDescription || edge.node.fallbackDescription}
            />,
            <meta
              property="og:image"
              content={props.seoImage || edge.node.defaultOgImage.url}
            />,
            <meta
              property="twitter:title"
              content={
                (props.seoTitle && homeDef) ||
                (props.seoTitle && homeSec) ||
                (props.seoTitle && isPage) ||
                (props.seoTitle && isArchiveRoot)
                  ? `${props.seoTitle} ${edge.node.separator} ${edge.node.title}`
                  : props.seoTitle && isPost
                  ? `${props.seoTitle} ${edge.node.separator} ${edge.node.archiveName} ${edge.node.separator} ${edge.node.title}`
                  : props.seoTitle && isPaginatedArchive
                  ? `${edge.node.pageName} ${pageNumber} ${edge.node.separator} ${props.seoTitle} ${edge.node.separator} ${edge.node.title}`
                  : edge.node.title
              }
            />,
            <meta
              property="twitter:description"
              content={props.seoDescription || edge.node.fallbackDescription}
            />,
            <meta
              property="twitter:image"
              content={props.seoImage || edge.node.defaultOgImage.url}
            />,
          ])}
      </Helmet>

      {props.noHeader || <Header />}
      <Main hasSubsequent={props.hasSubsequent}>{props.children}</Main>
      {props.noFooter || <Footer />}
    </>
  );
};

export default PageWrapper;
