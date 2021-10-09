import React, { useContext } from "react";

import { Helmet } from "react-helmet";

import { graphql, useStaticQuery } from "gatsby";

import { LocaleContext } from "../../context/langProviderV2";

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

  const { currentLocale, pageType, archivePageNumber } =
    useContext(LocaleContext);

  const { pathname } = useLocation();

  const { defaultLanguage } = useLanguages();

  const { siteUrl } = useSiteUrl();

  const isHome =
    pageType === "isHomeDefaultLang" || pageType === "isHomeSecondaryLang";

  const isArchiveRoot = pageType === "isArchive" && archivePageNumber === 1;

  return (
    <>
      <GlobalStyles />

      <Helmet>
        {/* PWA Tags */}

        <link
          rel="manifest"
          href={
            currentLocale === defaultLanguage
              ? `/manifest.webmanifest`
              : `/manifest_${currentLocale}.webmanifest`
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
        <html lang={currentLocale} />
        <meta property="og:url" content={`${siteUrl}${pathname}`} />
        <meta property="og:type" content="blog" />
        <meta property="twitter:url" content={`${siteUrl}${pathname}`} />

        {data.allDatoCmsWebsiteSetting.nodes
          .filter(({ locale }) => locale === currentLocale)
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
                {(seoTitle && isHome) ||
                (seoTitle && pageType === "isPage") ||
                (seoTitle && isArchiveRoot)
                  ? `${seoTitle} ${separator} ${title}`
                  : seoTitle && pageType === "isPost"
                  ? `${seoTitle} ${separator} ${archiveName} ${separator} ${title}`
                  : seoTitle && pageType === "isArchive" && !isArchiveRoot
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
                  (seoTitle && isHome) ||
                  (seoTitle && pageType === "isPage") ||
                  (seoTitle && isArchiveRoot)
                    ? `${seoTitle} ${separator} ${title}`
                    : seoTitle && pageType === "isPost"
                    ? `${seoTitle} ${separator} ${archiveName} ${separator} ${title}`
                    : seoTitle && pageType === "isArchive" && !isArchiveRoot
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
                  (seoTitle && isHome) ||
                  (seoTitle && pageType === "isPage") ||
                  (seoTitle && isArchiveRoot)
                    ? `${seoTitle} ${separator} ${title}`
                    : seoTitle && pageType === "isPost"
                    ? `${seoTitle} ${separator} ${archiveName} ${separator} ${title}`
                    : seoTitle && pageType === "isArchive" && !isArchiveRoot
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
