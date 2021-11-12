import React from "react";
import { graphql } from "gatsby";
import { StructuredText } from "react-datocms";
import { isCode } from "datocms-structured-text-utils";
import { renderRule } from "datocms-structured-text-to-plain-text";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import PageWrapper from "../components/layout/PageWrapper";
import ArticleHeader, { BodyImg } from "../components/ui/ArticleHeader";
import {
  ArticleBody,
  LanguageContainer,
} from "../components/layout/paragraphStyles";
import PrevNextNav from "../components/ui/ArticlePrevNext";
import { SectionWrapper } from "../components/layout/sectionStyles";
import Navigator from "../components/langHelpers/Navigator";

const BlogPostTemplate = ({ data, pageContext }) => {
  const { id, structuredBody, seo, title, subtitle, author, coverImage, meta } =
    data.datoCmsBlogPost;

  return (
    <PageWrapper
      pageData={pageContext}
      seoTitle={seo.title}
      seoDescription={seo.description}
      seoImage={seo.image.url}
    >
      <SectionWrapper as="article" isBlog article>
        <ArticleHeader
          title={title}
          subtitle={subtitle}
          authorName={author.name}
          coverImg={coverImage.gatsbyImageData}
          coverImgAlt={coverImage.alt}
          authorImg={author.picture.gatsbyImageData}
          authorImgAlt={author.picture.alt}
          date={meta.firstPublishedAt}
        />
        <ArticleBody>
          {!structuredBody.value || (
            <StructuredText
              key={id}
              data={structuredBody}
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
                      <Navigator article to={data.previous.nodes[0].slug}>
                        {data.previous.nodes[0].title}
                      </Navigator>
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
                      <Navigator article to={data.next.nodes[0].slug}>
                        {data.next.nodes[0].title}
                      </Navigator>
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
      nodes {
        slug
        title
      }
    }
    previous: allDatoCmsBlogPost(
      filter: { locale: { eq: $locale } }
      sort: { fields: meta___firstPublishedAt }
      skip: $skipPrevious
      limit: 1
    ) {
      nodes {
        slug
        title
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
