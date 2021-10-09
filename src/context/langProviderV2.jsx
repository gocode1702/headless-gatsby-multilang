import React, { createContext, useState } from "react";

export const LocaleContext = createContext({});

const LocaleProvider = ({ children, pageData }) => {
  //
  const { pageType, locale, slug, archivePageNumber } = pageData;

  const [currentLocale] = useState(locale);

  const store = {
    currentLocale,
    pageType,
    slug,
    archivePageNumber,
  };

  console.log(store);

  return (
    <LocaleContext.Provider value={store}>{children}</LocaleContext.Provider>
  );
};

export default LocaleProvider;
