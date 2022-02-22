import React from 'react';
import { graphql } from 'gatsby';
import { StructuredText, renderNodeRule } from 'react-datocms';
import { isCode } from 'datocms-structured-text-utils';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { PageWrapper } from '../components/Layout/PageWrapper';
import { ArticleHeader } from '../components/Layout/Blog/ArticleHeader';
import {
  ArticleBody,
  CodeContainer,
} from '../components/Layout/SharedStyles/TextContainers';
import {
  SectionContainerGridTwoCols,
  SectionTitleContainer,
  SectionWrapper,
} from '../components/Layout/SharedStyles/Sections';
import { Navigator } from '../components/LanguageHelpers/Navigator';
import { BackToBlog } from '../components/Layout/Blog/BackToBlog';
import { ArticleCard, CardImgArtDir } from '../components/Layout/Blog/Cards';
import { SectionTitle } from '../components/Layout/SharedStyles/Headings';
import { ArticleImage } from '../components/Layout/Blog/ArticleImage';

const ArticleTemplate = ({
  data: {
    datoCmsBlogPost: {
      id,
      structuredBody,
      title,
      subtitle,
      author,
      seo,
      coverImage: { coverImageData },
      meta: { updatedAt, firstPublishedAt },
      categoryLink,
      relatedPosts,
    },
    datoCmsMiscTextString: { updatedAtText, nextReadText },
  },
  pageContext,
}) => (
  <PageWrapper
    pageData={pageContext}
    seoTitle={seo?.seoTitle}
    seoDescription={seo?.seoDescription}
    seoImage={seo?.image?.seoImageUrl}
  >
    <SectionWrapper as="article" isBlog isArticle>
      <BackToBlog />
      <ArticleHeader
        title={title}
        subtitle={subtitle}
        authorName={author?.authorName}
        coverImg={coverImageData}
        coverImgAlt={title}
        authorImg={author?.picture?.authorPictureData}
        authorImgAlt={author?.authorName}
        firstPublish={firstPublishedAt}
        lastModified={updatedAt}
        lastModifiedText={updatedAtText}
        category={categoryLink}
      />
      <ArticleBody>
        {structuredBody?.value && (
          <StructuredText
            key={id}
            data={structuredBody}
            customRules={[
              renderNodeRule(isCode, ({ node: { language, code }, key }) => (
                <div style={{ position: 'relative' }} key={key}>
                  <CodeContainer>{language}</CodeContainer>
                  <SyntaxHighlighter language={language} style={atomDark}>
                    {code}
                  </SyntaxHighlighter>
                </div>
              )),
            ]}
            renderLinkToRecord={({
              record: { id },
              children,
              transformedMeta,
            }) => (
              <Navigator {...transformedMeta} recordId={id}>
                {children}
              </Navigator>
            )}
            renderBlock={({
              record: {
                __typename,
                image: {
                  gatsbyImageData: recordImageData,
                  alt: recordImageAlt,
                },
              },
            }) => {
              switch (__typename) {
                case 'DatoCmsArticleBodyImage':
                  return (
                    <ArticleImage
                      image={recordImageData}
                      alt={recordImageAlt}
                    />
                  );
                default:
                  return null;
              }
            }}
          />
        )}
      </ArticleBody>
    </SectionWrapper>
    {relatedPosts.length > 0 && (
      <SectionWrapper>
        <SectionTitleContainer isArticleSectionHeading>
          <SectionTitle>{nextReadText}</SectionTitle>
        </SectionTitleContainer>
        <SectionContainerGridTwoCols>
          {relatedPosts.map(
            ({
              id,
              meta: { updatedAt },
              title,
              coverImage,
              subtitle,
              author: {
                authorName,
                picture: { authorImageData },
              },
              categoryLink,
            }) => (
              <ArticleCard
                key={id}
                recordId={id}
                date={updatedAt}
                category={categoryLink}
                cardImg={
                  coverImage &&
                  CardImgArtDir(
                    coverImage.gatsbyImageData,
                    coverImage.squaredImage,
                    title
                  )
                }
                title={title}
                excerpt={subtitle}
                authorImg={authorImageData}
                authorAltImg={authorName}
                authorName={authorName}
              />
            )
          )}
        </SectionContainerGridTwoCols>
      </SectionWrapper>
    )}
  </PageWrapper>
);

export default ArticleTemplate;

// Main query

export const query = graphql`
  query ArticleQuery($id: String!, $locale: String!) {
    datoCmsMiscTextString(locale: { eq: $locale }) {
      locale
      updatedAtText
      nextReadText
    }
    datoCmsBlogPost(originalId: { eq: $id }, locale: { eq: $locale }) {
      locale
      originalId
      locale
      title
      seo {
        seoTitle: title
        seoDescription: description
        seoImage: image {
          seoImageUrl: url
        }
      }
      subtitle
      coverImage {
        coverImageData: gatsbyImageData
      }
      meta {
        updatedAt
        firstPublishedAt
      }
      categoryLink {
        title
        id: originalId
      }
      author {
        authorName: name
        picture {
          authorPictureData: gatsbyImageData(height: 60, width: 60)
        }
      }
      relatedPosts {
        id: originalId
        meta {
          updatedAt
        }
        categoryLink {
          title
        }
        coverImage {
          gatsbyImageData(
            width: 300
            height: 120
            placeholder: NONE
            forceBlurhash: false
          )
          squaredImage: gatsbyImageData(
            width: 100
            height: 100
            imgixParams: { ar: "1", fit: "crop" }
          )
        }
        author {
          authorName: name
          picture {
            authorImageData: gatsbyImageData(
              height: 30
              width: 30
              placeholder: NONE
            )
          }
        }
        subtitle
        title
      }
      structuredBody {
        blocks {
          __typename
          id: originalId
          image {
            gatsbyImageData
            alt
          }
        }
        links {
          ... on DatoCmsBlogPost {
            id: originalId
          }
          ... on DatoCmsOtherPage {
            id: originalId
          }
          ... on DatoCmsHomepage {
            id: originalId
          }
          ... on DatoCmsBlogRoot {
            id: originalId
          }
        }
        value
      }
    }
  }
`;
