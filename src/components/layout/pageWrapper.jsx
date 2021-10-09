import React, { useContext } from "react";

import { graphql, useStaticQuery } from "gatsby";

import { Helmet } from "react-helmet";

import { LangContext } from "../../context/langProvider";

import { useLocation } from "@reach/router";

import useLanguages from "../../hooks/useLanguages";

import useSiteUrl from "../../hooks/useSiteUrl";

import GlobalStyles from "./globalStyles";

import Header from "../ui/header";

import Footer from "../ui/footer";

const PageWrapper = ({
  noHeader,
  noFooter,
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

  const { currentLanguage, pageType, archivePageNumber } =
    useContext(LangContext);

  const { pathname } = useLocation();

  const { defaultLanguage } = useLanguages();

  const { siteUrl } = useSiteUrl();

  const isHome =
    pageType === "isHomeDefaultLang" || pageType === "isHomeSecondaryLang";

  const isArchiveRoot = pageType === "isArchive" && archivePageNumber === 1;

  const isPaginatedArchive = pageType === "isArchive" && !isArchiveRoot;

  const isPost = pageType === "isPost";

  const hasDefaultSchema =
    (seoTitle && isHome) ||
    (seoTitle && pageType === "isPage") ||
    (seoTitle && isArchiveRoot);

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
          .filter(({ locale }) => locale === currentLanguage)
          .map(
            ({
              title,
              separator,
              pageName,
              archiveName,
              fallbackDescription,
              defaultOgImage: { url: defaultImgUrl },
            }) => [
              <title>
                {hasDefaultSchema
                  ? `${seoTitle} ${separator} ${title}`
                  : seoTitle && isPost
                  ? `${seoTitle} ${separator} ${archiveName} ${separator} ${title}`
                  : seoTitle && isPaginatedArchive
                  ? `${pageName} ${archivePageNumber} ${separator} ${seoTitle} ${separator} ${title}`
                  : title}
              </title>,
              <meta
                name="description"
                content={seoDescription || fallbackDescription}
              />,
              <meta
                property="og:title"
                content={
                  hasDefaultSchema
                    ? `${seoTitle} ${separator} ${title}`
                    : seoTitle && isPost
                    ? `${seoTitle} ${separator} ${archiveName} ${separator} ${title}`
                    : seoTitle && isPaginatedArchive
                    ? `${pageName} ${archivePageNumber} ${separator} ${seoTitle} ${separator} ${title}`
                    : title
                }
              />,
              <meta
                property="og:description"
                content={seoDescription || fallbackDescription}
              />,
              <meta property="og:image" content={seoImage || defaultImgUrl} />,
              <meta
                property="twitter:title"
                content={
                  hasDefaultSchema
                    ? `${seoTitle} ${separator} ${title}`
                    : seoTitle && isPost
                    ? `${seoTitle} ${separator} ${archiveName} ${separator} ${title}`
                    : seoTitle && isPaginatedArchive
                    ? `${pageName} ${archivePageNumber} ${separator} ${seoTitle} ${separator} ${title}`
                    : title
                }
              />,
              <meta
                property="twitter:description"
                content={seoDescription || fallbackDescription}
              />,
              <meta
                property="twitter:image"
                content={seoImage || defaultImgUrl}
              />,
            ]
          )}
      </Helmet>

      {noHeader || <Header />}
      <main>{children}</main>
      {noFooter || <Footer />}
    </>
  );
};

export default PageWrapper;
