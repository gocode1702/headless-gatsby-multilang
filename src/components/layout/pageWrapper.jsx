import React, { useContext } from "react";

import { Helmet } from "react-helmet";

import { graphql, useStaticQuery } from "gatsby";

import { Main } from "./sectionStyles";

import { LangContext } from "../../context/languageProvider";

import useLanguages from "../../hooks/useLanguages";

import useSiteUrl from "../../hooks/useSiteUrl";

import GlobalStyles from "./globalStyles";

import Header from "../ui/header";

import Footer from "../ui/footer";

const PageWrapper = ({
  noHeader,
  noFooter,
  hasSubsequent,
  children,
  seoTitle,
  seoDescription,
  seoImage,
}) => {
  const data = useStaticQuery(graphql`
    query SeoQuery {
      allDatoCmsWebsiteSetting {
        nodes {
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

  const { defaultLanguage } = useLanguages();

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
              ? `/manifest.webmanifest`
              : `/manifest_${currentLanguage}.webmanifest`
          }
          crossOrigin="anonymous"
        />

        <meta
          name="theme-color"
          content={data.allDatoCmsWebsiteSetting.nodes[0].primaryColor.hex}
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

        {data.allDatoCmsWebsiteSetting.nodes
          .filter((node) => node.locale === currentLanguage)
          .map((node) => [
            <title>
              {(seoTitle && homeDef) ||
              (seoTitle && homeSec) ||
              (seoTitle && isPage) ||
              (seoTitle && isArchiveRoot)
                ? `${seoTitle} ${node.separator} ${node.title}`
                : seoTitle && isPost
                ? `${seoTitle} ${node.separator} ${node.archiveName} ${node.separator} ${node.title}`
                : seoTitle && isPaginatedArchive
                ? `${node.pageName} ${pageNumber} ${node.separator} ${seoTitle} ${node.separator} ${node.title}`
                : node.title}
            </title>,
            <meta
              name="description"
              content={seoDescription || node.fallbackDescription}
            />,
            <meta
              property="og:title"
              content={
                (seoTitle && homeDef) ||
                (seoTitle && homeSec) ||
                (seoTitle && isPage) ||
                (seoTitle && isArchiveRoot)
                  ? `${seoTitle} ${node.separator} ${node.title}`
                  : seoTitle && isPost
                  ? `${seoTitle} ${node.separator} ${node.archiveName} ${node.separator} ${node.title}`
                  : seoTitle && isPaginatedArchive
                  ? `${node.pageName} ${pageNumber} ${node.separator} ${seoTitle} ${node.separator} ${node.title}`
                  : node.title
              }
            />,
            <meta
              property="og:description"
              content={seoDescription || node.fallbackDescription}
            />,
            <meta
              property="og:image"
              content={seoImage || node.defaultOgImage.url}
            />,
            <meta
              property="twitter:title"
              content={
                (seoTitle && homeDef) ||
                (seoTitle && homeSec) ||
                (seoTitle && isPage) ||
                (seoTitle && isArchiveRoot)
                  ? `${seoTitle} ${node.separator} ${node.title}`
                  : seoTitle && isPost
                  ? `${seoTitle} ${node.separator} ${node.archiveName} ${node.separator} ${node.title}`
                  : seoTitle && isPaginatedArchive
                  ? `${node.pageName} ${pageNumber} ${node.separator} ${seoTitle} ${node.separator} ${node.title}`
                  : node.title
              }
            />,
            <meta
              property="twitter:description"
              content={seoDescription || node.fallbackDescription}
            />,
            <meta
              property="twitter:image"
              content={seoImage || node.defaultOgImage.url}
            />,
          ])}
      </Helmet>

      {noHeader || <Header />}
      <Main hasSubsequent={hasSubsequent}>{children}</Main>
      {noFooter || <Footer />}
    </>
  );
};

export default PageWrapper;
