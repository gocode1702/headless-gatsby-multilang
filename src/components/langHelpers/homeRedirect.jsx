import React, { useEffect } from "react";

import { graphql, useStaticQuery, navigate } from "gatsby";

import { useLocation } from "@reach/router";

import useLanguages from "../../hooks/useLanguages";

import useSiteUrl from "../../hooks/useSiteUrl";

import { saveLocale } from "./utils";

const HomeRedirect = ({ children }) => {
  const data = useStaticQuery(graphql`
    query {
      datoCmsSite {
        locales
      }
    }
  `);

  const { pathname } = useLocation();

  const { siteUrl } = useSiteUrl();

  const { defaultLanguage } = useLanguages();

  useEffect(() => {
    const websiteLangCodes = data.datoCmsSite.locales;
    const browserLangCodes = navigator.languages.map((language) =>
      language.slice(0, 2)
    );
    const preferredLanguages = browserLangCodes.filter((websiteLang) =>
      websiteLangCodes.includes(websiteLang)
    );

    const getSavedLocale = localStorage.getItem(
      `${siteUrl.slice(8)}_preferred_lang`
    );

    // If user accesses the homepage in default language ("/") for the first time ever via direct link and
    // no browser language matches any website language, do nothing
    if (!preferredLanguages) {
      saveLocale(siteUrl, defaultLanguage);
      return;
    }

    // Instead, redirect to the first preferred browser language
    // homepage that matches one of the available website languages

    const commonPattern =
      preferredLanguages.length > 0 && pathname.length === 1 && !getSavedLocale;

    if (commonPattern && preferredLanguages[0] === defaultLanguage) {
      saveLocale(siteUrl, preferredLanguages[0]);
    } else if (commonPattern && preferredLanguages[0] !== defaultLanguage) {
      navigate(`/${preferredLanguages[0]}`);
      saveLocale(siteUrl, preferredLanguages[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
};

export default HomeRedirect;
