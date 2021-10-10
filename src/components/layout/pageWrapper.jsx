import React from "react";

import Seo from "../langHelpers/seo";

import GlobalStyles from "./globalStyles";

import Header from "../ui/header";

import Footer from "../ui/footer";

const PageWrapper = ({
  seoTitle,
  seoDescription,
  seoImage,
  noHeader,
  noFooter,
  children,
}) => (
  <>
    <GlobalStyles />

    <Seo
      seoTitle={seoTitle}
      seoDescription={seoDescription}
      seoImage={seoImage}
    />

    {noHeader || <Header />}

    <main>{children}</main>

    {noFooter || <Footer />}
  </>
);

export default PageWrapper;
