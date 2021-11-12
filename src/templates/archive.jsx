import React from "react";
import { graphql } from "gatsby";
import PageWrapper from "../components/layout/pageWrapper";
import Hero from "../components/layout/hero";
import useLanguages from "../hooks/useLanguages";

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
  const { pagesNumber, archivePageNumber, locale } = pageContext;

  const {
    datoCmsArchivePage: { hero, seo },
  } = data;

  const { allDatoCmsBlogPost } = data;

  return (
    <PageWrapper
      pageData={pageContext}
      seoTitle={seo.title}
      seoDescription={seo.description}
    >
      <Hero title={hero[0].heroTitle} subtitle={hero[0].heroSubtitle} />
      <SectionWrapper isBlog>
        <SectionContainerGridThreeCols>
          {allDatoCmsBlogPost.nodes.map(
            ({
              id,
              meta,
              minutesOfReading,
              cardImage,
              title,
              subtitle,
              author,
              slug,
            }) => (
              <ArticleCard
                key={id}
                date={meta.publishedAt}
                time={`${minutesOfReading} ${data.datoCmsWebsiteSetting.minsReadSuffix}`}
                cardImg={
                  cardImage &&
                  CardImgArtDir(
                    cardImage.gatsbyImageData,
                    cardImage.squaredImage,
                    cardImage.alt
                  )
                }
                title={title}
                excerpt={subtitle}
                authorImg={author && author.picture.gatsbyImageData}
                authorAltImg={author && author.picture.alt}
                authorName={author && author.name}
                slug={slug}
              />
            )
          )}
        </SectionContainerGridThreeCols>
        <ArchiveNav>
          <ArchiveList>
            {Array.from({ length: pagesNumber }, (_, index) => (
              <li key={`page_number${index + 1}`}>
                <ArchiveListLink
                  as={index === archivePageNumber - 1 ? "span" : ""}
                  to={(() => {
                    if (
                      locale === defaultLanguage &&
                      index !== archivePageNumber - 1
                    )
                      return `/${defaultBlogPath}/${
                        index === 0 ? "" : index + 1
                      }`;
                    if (
                      locale !== defaultLanguage &&
                      index !== archivePageNumber - 1
                    )
                      return `/${locale}/${defaultBlogPath}/${
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
