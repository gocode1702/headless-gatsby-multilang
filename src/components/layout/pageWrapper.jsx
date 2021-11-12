import React from "react";
import Seo from "../langHelpers/Seo";
import GlobalStyles from "./globalStyles";
import Header from "./Header";
import Footer from "./Footer";
import LangProvider from "../../context/LangProvider";

const PageWrapper = ({
  pageData,
  seoTitle,
  seoDescription,
  seoImage,
  notFoundPage,
  notFoundPageLocale,
  notFoundPageManifest,
  noHeader,
  noFooter,
  children,
}) => (
  <>
    <GlobalStyles />

    <LangProvider pageData={pageData || notFoundPage}>
      <Seo
        seoTitle={seoTitle}
        seoDescription={seoDescription}
        seoImage={seoImage}
        notFoundPage={notFoundPage}
        notFoundPageLocale={notFoundPageLocale}
        notFoundPageManifest={notFoundPageManifest}
      />

      {noHeader || <Header />}

      <main>{children}</main>

      {noFooter || <Footer />}
    </LangProvider>
  </>
);

export default PageWrapper;
