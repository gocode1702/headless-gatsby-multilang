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
          {data.allDatoCmsBlogPost.nodes.map((node) => (
            <ArticleCard
              key={node.id}
              date={node.meta.publishedAt}
              time={`${node.minutesOfReading} ${data.datoCmsWebsiteSetting.minsReadSuffix}`}
              cardImg={
                node.cardImage &&
                CardImgArtDir(
                  node.cardImage.gatsbyImageData,
                  node.cardImage.squaredImage,
                  node.cardImage.alt
                )
              }
              title={node.title}
              excerpt={node.subtitle}
              authorImg={node.author && node.author.picture.gatsbyImageData}
              authorAltImg={node.author && node.author.picture.alt}
              authorName={node.author && node.author.name}
              slug={node.slug}
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
      nodes {
        id: originalId
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

    datoCmsWebsiteSetting(locale: { eq: $locale }) {
      minsReadSuffix
    }
  }
`;
