import React, { useContext } from "react";

import { Link } from "gatsby";

import { LocaleContext } from "../../context/langProviderV2";

import useLanguages from "../../hooks/useLanguages";

const Navigator = ({
  article,
  page,
  archive,
  home,
  ariaLabel,
  className,
  text,
  children,
  to,
}) => {
  const { currentLocale } = useContext(LocaleContext);

  const { defaultLanguage, defaultBlogPath } = useLanguages();
  return (
    <Link
      aria-label={ariaLabel}
      className={className}
      to={
        article
          ? currentLocale === defaultLanguage
            ? `/${defaultBlogPath}/${to}` // If navigating from a default language page, keep link as it is
            : `/${currentLocale}/${defaultBlogPath}/${to}` // If navigating from a secondary language page, add current language slug
          : page
          ? currentLocale === defaultLanguage
            ? `/${to}` // If navigating from a default language page, keep link as it is
            : `/${currentLocale}/${to}` // If navigating from a secondary language page, add current language slug
          : archive
          ? currentLocale === defaultLanguage
            ? `/${defaultBlogPath}` // If navigating from a default language page, keep link as it is
            : `/${currentLocale}/${defaultBlogPath}` // If navigating from a secondary language page, add current language slug
          : home
          ? currentLocale === defaultLanguage
            ? "/" // If navigating from a default language page, keep link as it is
            : `/${currentLocale}` // If navigating from a secondary language page, add current language slug
          : "/"
      }
    >
      {text}
      {children}
    </Link>
  );
};

export default Navigator;
