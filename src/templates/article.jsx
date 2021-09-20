import React from "react";

import { graphql } from "gatsby";

import { StructuredText } from "react-datocms";

import { isCode } from "datocms-structured-text-utils";

import { renderRule } from "datocms-structured-text-to-plain-text";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import PageWrapper from "../components/layout/pageWrapper";

import ArticleHeader, { BodyImg } from "../components/ui/articleHeader";

import {
  ArticleBody,
  LanguageContainer,
} from "../components/layout/paragraphStyles";

import PrevNextNav from "../components/ui/articlePrevNext";

import { SectionWrapper } from "../components/layout/sectionStyles";

import Navigator from "../components/langHelpers/navigator";

const BlogPostTemplate = ({ data, pageContext }) => {
  const blogPost = data.datoCmsBlogPost;

  return (
    <PageWrapper
      seoTitle={blogPost.seo.title}
      seoDescription={blogPost.seo.description}
      seoImage={blogPost.seo.image.url}
    >
      <SectionWrapper as="article" isBlog article>
        <ArticleHeader
          title={blogPost.title}
          subtitle={blogPost.subtitle}
          authorName={blogPost.author.name}
          coverImg={blogPost.coverImage.gatsbyImageData}
          coverImgAlt={blogPost.coverImage.alt}
          authorImg={blogPost.author.picture.gatsbyImageData}
          authorImgAlt={blogPost.author.picture.alt}
          date={blogPost.meta.firstPublishedAt}
        />
        <ArticleBody>
          {!blogPost.structuredBody.value || (
            <StructuredText
              key={blogPost.id}
              data={blogPost.structuredBody}
              customRules={[
                renderRule(isCode, ({ node, key }) => (
                  <div style={{ position: "relative" }} key={key}>
                    <LanguageContainer>{node.language}</LanguageContainer>
                    <SyntaxHighlighter
                      language={node.language}
                      style={atomDark}
                    >
                      {node.code}
                    </SyntaxHighlighter>
                  </div>
                )),
              ]}
              renderLinkToRecord={({ record, children, transformedMeta }) => {
                switch (record.typeName) {
                  case "page":
                    return (
                      <Navigator {...transformedMeta} page to={record.slug}>
                        {children}
                      </Navigator>
                    );
                  case "article":
                    return (
                      <Navigator {...transformedMeta} article to={record.slug}>
                        {children}
                      </Navigator>
                    );
                  case "archive":
                    return (
                      <Navigator {...transformedMeta} archive>
                        {children}
                      </Navigator>
                    );
                  case "home":
                    return (
                      <Navigator {...transformedMeta} home>
                        {children}
                      </Navigator>
                    );

                  default:
                    return null;
                }
              }}
              renderBlock={({ record }) => {
                switch (record.typeName) {
                  case "image":
                    return (
                      <BodyImg
                        image={record.image.gatsbyImageData}
                        alt={record.image.alt}
                      />
                    );
                  default:
                    return null;
                }
              }}
            />
          )}
        </ArticleBody>
        <PrevNextNav
          previousNavRender={
            <>
              <div>
                {pageContext.skipNext >= 0 && pageContext.skipNext !== 1 && (
                  <>
                    <span>{data.datoCmsWebsiteSetting.previous}</span>
                    <h2>
                      <Navigator
                        article
                        text={data.previous.edges[0].node.title}
                        to={data.previous.edges[0].node.slug}
                      />
                    </h2>
                  </>
                )}
              </div>
            </>
          }
          nextNavRender={
            <>
              <div>
                {pageContext.skipNext > 0 && (
                  <>
                    <span>{data.datoCmsWebsiteSetting.next}</span>
                    <h2>
                      <Navigator
                        article
                        text={data.next.edges[0].node.title}
                        to={data.next.edges[0].node.slug}
                      />
                    </h2>
                  </>
                )}
              </div>
            </>
          }
        />
      </SectionWrapper>
    </PageWrapper>
  );
};

export default BlogPostTemplate;

// Main query

export const query = graphql`
  query BlogPostTemplateQuery(
    $id: String!
    $locale: String!
    $skipNext: Int!
    $skipPrevious: Int!
  ) {
    next: allDatoCmsBlogPost(
      filter: { locale: { eq: $locale } }
      sort: { fields: meta___firstPublishedAt }
      limit: 1
      skip: $skipNext
    ) {
      edges {
        node {
          slug
          title
        }
      }
    }
    previous: allDatoCmsBlogPost(
      filter: { locale: { eq: $locale } }
      sort: { fields: meta___firstPublishedAt }
      skip: $skipPrevious
      limit: 1
    ) {
      edges {
        node {
          slug
          title
        }
      }
    }
    datoCmsWebsiteSetting(locale: { eq: $locale }) {
      previous
      next
    }
    datoCmsBlogPost(originalId: { eq: $id }, locale: { eq: $locale }) {
      originalId
      locale
      title
      seo {
        title
        description
        image {
          url
        }
      }
      subtitle
      coverImage {
        gatsbyImageData
        alt
      }
      meta {
        firstPublishedAt(locale: $locale, formatString: "DD MMM YYYY")
      }
      author {
        name
        picture {
          gatsbyImageData(height: 60, width: 60)
          alt
        }
      }
      structuredBody {
        blocks {
          typeName
          id: originalId
          image {
            gatsbyImageData
            alt
          }
        }
        links {
          ... on DatoCmsBlogPost {
            typeName
            slug
            id: originalId
          }
          ... on DatoCmsOtherPage {
            typeName
            slug
            id: originalId
          }
          ... on DatoCmsHomepage {
            typeName
            id: originalId
          }
          ... on DatoCmsArchivePage {
            typeName
            id: originalId
          }
        }
        value
      }
    }
  }
`;
