import React from 'react';
import { graphql } from 'gatsby';
import { PageWrapper } from '../components/Layout/PageWrapper';
import { Hero } from '../components/Layout/Hero';
import {
  SectionContainerGridThreeCols,
  SectionWrapper,
} from '../components/Layout/SharedStyles/Sections';
import { ArticleCard, CardImgArtDir } from '../components/Layout/Blog/Cards';
import { CategoriesMenu } from '../components/Layout/Blog/CategoriesMenu';

const BlogRootTemplate = ({
  data: {
    datoCmsBlogRoot: {
      hero: [{ heroTitle, heroSubtitle }],
      seo,
    },
    allDatoCmsBlogPost: { blogPostNodes },
  },
  pageContext,
}) => (
  <PageWrapper
    pageData={pageContext}
    seoTitle={seo?.seoTitle}
    seoDescription={seo?.seoDescription}
    seoImage={seo?.seoImage?.seoImageUrl}
    seo
  >
    <Hero title={heroTitle} subtitle={heroSubtitle} />
    <CategoriesMenu />
    <SectionWrapper>
      <SectionContainerGridThreeCols>
        {blogPostNodes.map(
          ({
            id,
            meta: { updatedAt },
            coverImage,
            title,
            subtitle,
            author,
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
              authorImg={author?.picture.gatsbyImageData}
              authorAltImg={author?.authorName}
              authorName={author?.authorName}
            />
          )
        )}
      </SectionContainerGridThreeCols>
    </SectionWrapper>
  </PageWrapper>
);

export default BlogRootTemplate;

// Main query

export const query = graphql`
  query BlogRootQuery($locale: String!) {
    allDatoCmsBlogPost(
      filter: {
        locale: { eq: $locale }
        noTranslate: { ne: true }
        categoryLink: { noTranslate: { ne: true } }
      }
      sort: { order: ASC, fields: meta___updatedAt }
    ) {
      blogPostNodes: nodes {
        locale
        id: originalId
        title
        subtitle
        noTranslate
        meta {
          updatedAt
        }
        categoryLink {
          noTranslate
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
            gatsbyImageData(height: 30, width: 30, placeholder: NONE)
          }
        }
      }
    }
    datoCmsBlogRoot(locale: { eq: $locale }) {
      locale
      seo {
        seoTitle: title
        seoDescription: description
        seoImage: image {
          seoImageUrl: url
        }
      }
      hero {
        heroTitle
        heroSubtitle
      }
    }
  }
`;
