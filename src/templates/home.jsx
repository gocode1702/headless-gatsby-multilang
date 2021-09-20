import React from "react";

import { graphql } from "gatsby";

import PageWrapper from "../components/layout/pageWrapper";

import Navigator from "../components/langHelpers/navigator";

import Hero from "../components/ui/hero";

import {
  SectionContainerGridThreeCols,
  SectionWrapper,
  SectionTitleContainer,
  TextBox,
} from "../components/layout/sectionStyles";

import { HeadingSmall, SectionTitle } from "../components/layout/headingStyles";

import { Paragraph } from "../components/layout/paragraphStyles";

import ArticleCard, { CardImgArtDir } from "../components/ui/articleCard";

const HomePageTemplate = ({ data }) => {
  const homeData = data.datoCmsHomepage;

  return (
    <PageWrapper
      seoTitle={homeData.seo.title}
      seoDescription={homeData.seo.description}
    >
      <Hero
        hasDivider
        alt={homeData.hero[0].heroAlt}
        title={homeData.hero[0].heroTitle}
        subtitle={homeData.hero[0].heroSubtitle}
        button={
          <Navigator
            className="classicButton classicButtonOutline"
            page
            to={data.guidePageLink.slug}
            text={data.datoCmsWebsiteSetting.seeTheGuideButton}
          />
        }
        sectionChildren={
          <SectionContainerGridThreeCols>
            {homeData.features.map((feature) => (
              <TextBox small key={feature.originalId}>
                <HeadingSmall hasTip>{feature.title}</HeadingSmall>
                <Paragraph>{feature.description}</Paragraph>
              </TextBox>
            ))}
          </SectionContainerGridThreeCols>
        }
      />
      <SectionWrapper>
        <SectionTitleContainer hasButton>
          <SectionTitle>Featured posts</SectionTitle>
          <Navigator
            archive
            className="classicButton classicButtonOutline"
            text={data.datoCmsWebsiteSetting.seeAllButton}
          />
        </SectionTitleContainer>
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
              authorImg={edge.node.author.picture.gatsbyImageData}
              authorAltImg={edge.node.author.picture.alt}
              authorName={edge.node.author.name}
              slug={edge.node.slug}
            />
          ))}
        </SectionContainerGridThreeCols>
      </SectionWrapper>
    </PageWrapper>
  );
};

export default HomePageTemplate;

// Main query

export const query = graphql`
  query HomePageTemplate($locale: String!) {
    datoCmsHomepage(locale: { eq: $locale }) {
      locale
      seo {
        title
        description
        image {
          url
        }
      }
      hero {
        heroAlt
        heroTitle
        heroSubtitle
      }
      features {
        originalId
        title
        description
      }
    }
    guidePageLink: datoCmsOtherPage(
      locale: { eq: $locale }
      originalId: { eq: "51376108" }
    ) {
      slug
    }
    allDatoCmsBlogPost(
      sort: { order: ASC, fields: meta___firstPublishedAt }
      filter: { locale: { eq: $locale }, featuredInHomepage: { eq: true } }
      limit: 6
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
      seeTheGuideButton
      seeAllButton
    }
  }
`;
