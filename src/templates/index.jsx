import React from "react";
import { graphql } from "gatsby";
import PageWrapper from "../components/layout/PageWrapper";
import Navigator from "../components/langHelpers/Navigator";
import HomeRedirect from "../components/langHelpers/HomeRedirect";
import Hero from "../components/layout/Hero";
import {
  SectionContainerGridThreeCols,
  SectionWrapper,
  SectionTitleContainer,
  TextBox,
} from "../components/layout/sectionStyles";
import { HeadingSmall, SectionTitle } from "../components/layout/headingStyles";
import { Paragraph } from "../components/layout/paragraphStyles";
import ArticleCard, { CardImgArtDir } from "../components/ui/ArticleCard";

const HomePageTemplate = ({ data, pageContext }) => {
  const { seo, hero, features, featuredPostsTitle } = data.datoCmsHomepage;

  return (
    <HomeRedirect>
      <PageWrapper
        pageData={pageContext}
        seoTitle={seo.title}
        seoDescription={seo.description}
      >
        <Hero
          hasDivider
          alt={hero[0].heroAlt}
          title={hero[0].heroTitle}
          subtitle={hero[0].heroSubtitle}
          button={
            <Navigator
              className="classicButton classicButtonOutline"
              page
              to={data.guidePageLink.slug}
            >
              {data.datoCmsWebsiteSetting.seeTheGuideButton}
            </Navigator>
          }
          sectionChildren={
            <SectionContainerGridThreeCols>
              {features.map(({ id, title, description }) => (
                <TextBox small key={id}>
                  <HeadingSmall hasTip>{title}</HeadingSmall>
                  <Paragraph>{description}</Paragraph>
                </TextBox>
              ))}
            </SectionContainerGridThreeCols>
          }
        />
        <SectionWrapper>
          <SectionTitleContainer hasButton>
            <SectionTitle>{featuredPostsTitle}</SectionTitle>
            <Navigator className="classicButton classicButtonOutline" archive>
              {data.datoCmsWebsiteSetting.seeAllButton}
            </Navigator>
          </SectionTitleContainer>
          <SectionContainerGridThreeCols>
            {data.allDatoCmsBlogPost.nodes.map(
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
                  authorImg={author.picture.gatsbyImageData}
                  authorAltImg={author.picture.alt}
                  authorName={author.name}
                  slug={slug}
                />
              )
            )}
          </SectionContainerGridThreeCols>
        </SectionWrapper>
      </PageWrapper>
    </HomeRedirect>
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
        id: originalId
        title
        description
      }
      featuredPostsTitle
    }
    guidePageLink: datoCmsOtherPage(
      locale: { eq: $locale }
      reference: { eq: "guide" }
    ) {
      slug
    }
    allDatoCmsBlogPost(
      sort: { order: ASC, fields: meta___firstPublishedAt }
      filter: { locale: { eq: $locale }, featuredInHomepage: { eq: true } }
      limit: 6
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
      seeTheGuideButton
      seeAllButton
    }
  }
`;
