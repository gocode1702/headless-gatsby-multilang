import { graphql } from 'gatsby';
import React from 'react';
import { Hero } from '../components/Layout/Hero';
import { PageWrapper } from '../components/Layout/PageWrapper';
import { CategoriesMenu } from '../components/Layout/Blog/CategoriesMenu';
import {
  SectionContainerGridThreeCols,
  SectionWrapper,
} from '../components/Layout/SharedStyles/Sections';
import { ArticleCard, CardImgArtDir } from '../components/Layout/Blog/Cards';

const CategoryTemplate = ({
  data: {
    datoCmsCategory: {
      hero: [{ heroTitle, heroSubtitle, heroAlt }],
      seo,
    },
    allDatoCmsBlogPost: { postNodes },
  },
  pageContext,
}) => (
  <PageWrapper
    pageData={pageContext}
    seoTitle={seo?.seoTitle}
    seoDescription={seo?.seoDescription}
    seoImage={seo?.seoImage?.seoImageUrl}
  >
    <Hero alt={heroAlt} title={heroTitle} subtitle={heroSubtitle} />
    <CategoriesMenu />
    {postNodes.length > 0 && (
      <SectionWrapper>
        <SectionContainerGridThreeCols>
          {postNodes.map(
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
        </SectionContainerGridThreeCols>
      </SectionWrapper>
    )}
  </PageWrapper>
);

export default CategoryTemplate;

export const query = graphql`
  query CategoryQuery($id: String!, $locale: String!) {
    datoCmsCategory(originalId: { eq: $id }, locale: { eq: $locale }) {
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
        heroAlt
      }
    }
    allDatoCmsBlogPost(
      filter: {
        locale: { eq: $locale }
        noTranslate: { ne: true }
        categoryLink: { originalId: { eq: $id } }
      }
    ) {
      postNodes: nodes {
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
            authorImageData: gatsbyImageData(height: 30, width: 30)
          }
        }
        subtitle
        title
      }
    }
  }
`;
