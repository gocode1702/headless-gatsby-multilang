import React, { useContext } from "react";

import { Link } from "gatsby";

import { LangContext } from "../../context/languageProvider";

import useLanguages from "../../hooks/useLanguages";

const Navigator = (props) => {
  const { currentLanguage } = useContext(LangContext);

  const { defaultLanguage, defaultBlogPath } = useLanguages();
  return (
    <Link
      aria-label={props.ariaLabel}
      className={props.className}
      to={
        props.article
          ? currentLanguage === defaultLanguage
            ? `/${defaultBlogPath}/${props.to}` // If navigating from a default language page, keep link as it is
            : `/${currentLanguage}/${defaultBlogPath}/${props.to}` // If navigating from a secondary language page, add current language slug
          : props.page
          ? currentLanguage === defaultLanguage
            ? `/${props.to}` // If navigating from a default language page, keep link as it is
            : `/${currentLanguage}/${props.to}` // If navigating from a secondary language page, add current language slug
          : props.archive
          ? currentLanguage === defaultLanguage
            ? `/${defaultBlogPath}` // If navigating from a default language page, keep link as it is
            : `/${currentLanguage}/${defaultBlogPath}` // If navigating from a secondary language page, add current language slug
          : props.home
          ? currentLanguage === defaultLanguage
            ? "/" // If navigating from a default language page, keep link as it is
            : `/${currentLanguage}` // If navigating from a secondary language page, add current language slug
          : "/"
      }
    >
      {props.text}
      {props.children}
    </Link>
  );
};

export default Navigator;
