import React, { useContext } from "react";

import { graphql } from "gatsby";

import PageWrapper from "../components/layout/pageWrapper";

import Hero from "../components/ui/hero";

import useLanguages from "../hooks/useLanguages";

import { LangContext } from "../context/languageProvider";

import {
  SectionContainerGridThreeCols,
  SectionWrapper,
} from "../components/layout/sectionStyles";

import ArticleCard, { CardImgArtDir } from "../components/ui/articleCard";

import {
  ArchiveNav,
  ArchiveList,
  ArchiveListLink,
} from "../components/ui/archivePagination";

const BlogArchiveTemplate = ({ data, pageContext }) => {
  const { defaultLanguage, defaultBlogPath } = useLanguages();
  const { currentLanguage } = useContext(LangContext);
  const { currentPage, pagesNumber, locale } = pageContext;

  const archiveData = data.datoCmsArchivePage;

  return (
    <PageWrapper
      seoTitle={archiveData.seo.title}
      seoDescription={archiveData.seo.description}
    >
      <Hero
        title={archiveData.hero[0].heroTitle}
        subtitle={archiveData.hero[0].heroSubtitle}
      />
      <SectionWrapper isBlog>
        <SectionContainerGridThreeCols>
          {data.allDatoCmsBlogPost.edges.map((edge) => (
            <ArticleCard
              key={edge.node.originalId}
              date={edge.node.meta.publishedAt}
              time={`${edge.node.minutesOfReading} ${data.datoCmsWebsiteSetting.minsReadSuffix}`}
              cardImg={
                edge.node.cardImage &&
                CardImgArtDir(
                  edge.node.cardImage.gatsbyImageData,
                  edge.node.cardImage.squaredImage,
                  edge.node.cardImage.alt
                )
              }
              title={edge.node.title}
              excerpt={edge.node.subtitle}
              authorImg={
                edge.node.author && edge.node.author.picture.gatsbyImageData
              }
              authorAltImg={edge.node.author && edge.node.author.picture.alt}
              authorName={edge.node.author && edge.node.author.name}
              slug={edge.node.slug}
            />
          ))}
        </SectionContainerGridThreeCols>
        <ArchiveNav>
          <ArchiveList>
            {Array.from({ length: pagesNumber }, (_, index) => (
              <li key={`page_number${index + 1}`}>
                <ArchiveListLink
                  as={index === currentPage - 1 ? "span" : ""}
                  to={(() => {
                    if (locale === defaultLanguage && index !== currentPage - 1)
                      return `/${defaultBlogPath}/${
                        index === 0 ? "" : index + 1
                      }`;
                    if (locale !== defaultLanguage && index !== currentPage - 1)
                      return `/${currentLanguage}/${defaultBlogPath}/${
                        index === 0 ? "" : index + 1
                      }`;
                  })()}
                >
                  {index + 1}
                </ArchiveListLink>
              </li>
            ))}
          </ArchiveList>
        </ArchiveNav>
      </SectionWrapper>
    </PageWrapper>
  );
};

export default BlogArchiveTemplate;

// Main query

export const query = graphql`
  query BlogArchiveQuery($locale: String!, $skip: Int!, $limit: Int!) {
    datoCmsArchivePage(locale: { eq: $locale }) {
      locale
      seo {
        title
        description
        image {
          url
        }
      }
      hero {
        heroTitle
        heroSubtitle
      }
    }
    allDatoCmsBlogPost(
      sort: { order: ASC, fields: meta___firstPublishedAt }
      filter: { locale: { eq: $locale } }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          originalId
          meta {
            publishedAt(locale: $locale, formatString: "DD MMM YYYY")
          }
          minutesOfReading
          cardImage {
            gatsbyImageData(
              width: 280
              height: 100
              placeholder: NONE
              forceBlurhash: false
            )
            squaredImage: gatsbyImageData(
              width: 100
              height: 100
              imgixParams: { ar: "1", fit: "crop" }
            )
            alt
          }
          author {
            name
            picture {
              gatsbyImageData(height: 30, width: 30)
              alt
            }
          }
          subtitle
          title
          slug
          reference
        }
      }
    }
    datoCmsWebsiteSetting(locale: { eq: $locale }) {
      minsReadSuffix
    }
  }
`;
