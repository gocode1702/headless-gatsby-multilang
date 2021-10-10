import React, { useContext } from "react";

import { graphql, useStaticQuery } from "gatsby";

import { Helmet } from "react-helmet";

import { LangContext } from "../../context/langProvider";

import { useLocation } from "@reach/router";

import useLanguages from "../../hooks/useLanguages";

import useSiteUrl from "../../hooks/useSiteUrl";

const Seo = ({
  seoTitle,
  seoDescription,
  seoImage,
  notFoundPage,
  notFoundPageLocale,
  notFoundPageManifest,
}) => {
  const data = useStaticQuery(graphql`
    query {
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

  // Helpers

  const isHome = pageType === "isHome";

  const isPage = pageType === "isPage";

  const isArchiveRoot = pageType === "isArchiveRoot";

  const isPaginatedArchive = pageType === "isPaginatedArchive";

  const isPost = pageType === "isPost";

  const hasDefaultSchema =
    (seoTitle && isHome) || (seoTitle && isPage) || (seoTitle && isArchiveRoot);

  console.log(notFoundPage);

  return (
    <Helmet>
      {/* PWA */}
      <link
        rel="manifest"
        href={
          currentLanguage === defaultLanguage
            ? "/manifest.webmanifest"
            : !notFoundPage && currentLanguage !== defaultLanguage
            ? `/manifest_${currentLanguage}.webmanifest`
            : notFoundPage
            ? notFoundPageManifest
            : "/"
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

      <html lang={currentLanguage || notFoundPageLocale} />
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
                : notFoundPage
                ? `${seoTitle}`
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
                  : notFoundPage
                  ? seoTitle
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
                  : notFoundPage
                  ? seoTitle
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
  );
};

export default Seo;
