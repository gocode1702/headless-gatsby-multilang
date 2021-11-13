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

    // If user accesses the homepage in default language ("/") for the first time ever and
    // no browser language matches any website language, save the website default language as preferred locale
    if (!preferredLanguages && pathname.length === 1) {
      saveLocale(siteUrl, defaultLanguage);
      return;
    }

    // If user accesses the homepage in secondary language ("/it", "/es") for the first time ever and
    // no browser language matches any website language, save the language path as preferred locale
    if (!preferredLanguages && pathname.length === 3) {
      saveLocale(siteUrl, pathname.slice(1, 3));
      return;
    }

    const noPreferredLang_visitsRoot =
      preferredLanguages.length > 0 && pathname.length === 1 && !getSavedLocale;

    const noPreferredLang_visitsSecondary =
      pathname.length === 3 && !getSavedLocale;

    if (
      // If it is the very first time that the user visits the website root ("/")
      // and a browser language matches the default website language
      noPreferredLang_visitsRoot &&
      preferredLanguages[0] === defaultLanguage
    ) {
      // Save the preferred locale
      saveLocale(siteUrl, preferredLanguages[0]);
    } else if (
      // If it is the very first time that the user visits the website root ("/")
      // and a browser language matches a secondary website language
      noPreferredLang_visitsRoot &&
      preferredLanguages[0] !== defaultLanguage
    ) {
      // Save the locale and redirect to the its specific homepage
      navigate(`/${preferredLanguages[0]}`);
      saveLocale(siteUrl, preferredLanguages[0]);
    } else if (
      // If it is the very first time that the user visits the website home in a secondary language ("/it", "/es")
      // and a browser language matches a secondary website language
      noPreferredLang_visitsSecondary &&
      preferredLanguages[0] !== defaultLanguage
    ) {
      // Save the locale and perform no redirect
      saveLocale(siteUrl, pathname.slice(1, 3));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
};

export default HomeRedirect;
