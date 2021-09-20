import { graphql } from "gatsby";

import { StructuredText } from "react-datocms";

import Navigator from "../components/langHelpers/navigator";

import PageWrapper from "../components/layout/pageWrapper";

import Hero from "../components/ui/hero";

import {
  SectionContainerGridThreeCols,
  SectionContainerFlexTwoCols,
  SectionWrapper,
  SectionContainerFlexTwoColsReverse,
  ColumnFlexTwoCols,
  TextBox,
} from "../components/layout/sectionStyles";

import {
  HeadingMedium,
  HeadingSmall,
} from "../components/layout/headingStyles";

import { Paragraph } from "../components/layout/paragraphStyles";

const OtherPageTemplate = ({ data }) => {
  const otherPage = data.datoCmsOtherPage;

  return (
    <PageWrapper
      seoTitle={otherPage.seo.title}
      seoDescription={otherPage.seo.description}
      seoImage={otherPage.seo.image.url}
      hasSubsequent
    >
      {otherPage.structuredBody.value && (
        <StructuredText
          data={otherPage.structuredBody}
          renderBlock={({ record }) => {
            switch (record.typeName) {
              case "hero":
                return (
                  <Hero
                    alt={record.heroAlt}
                    title={record.heroTitle}
                    subtitle={record.heroSubtitle}
                  />
                );
              case "section image left":
                return (
                  <SectionWrapper hasSubsequent>
                    <SectionContainerFlexTwoCols>
                      <ColumnFlexTwoCols hasImg>
                        <img src={record.image.url} alt={record.image.alt} />
                      </ColumnFlexTwoCols>
                      <ColumnFlexTwoCols>
                        <TextBox as="div">
                          <HeadingMedium>{record.title}</HeadingMedium>
                          <Paragraph as="div">
                            <StructuredText
                              data={record.text}
                              renderLinkToRecord={({
                                record,
                                children,
                                transformedMeta,
                              }) => {
                                switch (record.typeName) {
                                  case "page":
                                    return (
                                      <Navigator
                                        {...transformedMeta}
                                        page
                                        to={record.slug}
                                      >
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
                            />
                          </Paragraph>
                        </TextBox>
                      </ColumnFlexTwoCols>
                    </SectionContainerFlexTwoCols>
                  </SectionWrapper>
                );
              case "section image right":
                return (
                  <SectionWrapper hasSubsequent>
                    <SectionContainerFlexTwoColsReverse>
                      <ColumnFlexTwoCols>
                        <TextBox as="div">
                          <HeadingMedium>{record.title}</HeadingMedium>
                          <Paragraph as="div">
                            <StructuredText
                              data={record.text}
                              renderLinkToRecord={({
                                record,
                                children,
                                transformedMeta,
                              }) => {
                                switch (record.typeName) {
                                  case "page":
                                    return (
                                      <Navigator
                                        {...transformedMeta}
                                        page
                                        to={record.slug}
                                      >
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
                            />
                          </Paragraph>
                        </TextBox>
                      </ColumnFlexTwoCols>
                      <ColumnFlexTwoCols hasImg>
                        <img src={record.image.url} alt={record.image.alt} />
                      </ColumnFlexTwoCols>
                    </SectionContainerFlexTwoColsReverse>
                  </SectionWrapper>
                );
              case "three features set":
                return (
                  <SectionWrapper hasSubsequent>
                    <SectionContainerGridThreeCols>
                      <TextBox small>
                        <HeadingSmall hasTip>
                          {record.firstFeatureTitle}
                        </HeadingSmall>
                        <Paragraph>{record.firstFeatureDescription}</Paragraph>
                      </TextBox>
                      <TextBox small>
                        <HeadingSmall hasTip>
                          {record.secondFeatureTitle}
                        </HeadingSmall>
                        <Paragraph>{record.secondFeatureDescription}</Paragraph>
                      </TextBox>
                      <TextBox small>
                        <HeadingSmall hasTip>
                          {record.thirdFeatureTitle}
                        </HeadingSmall>
                        <Paragraph>{record.thirdFeatureDescription}</Paragraph>
                      </TextBox>
                    </SectionContainerGridThreeCols>
                  </SectionWrapper>
                );
              default:
                return null;
            }
          }}
        />
      )}
    </PageWrapper>
  );
};
export default OtherPageTemplate;

export const query = graphql`
  query OtherPageQuery($locale: String!, $id: String!) {
    datoCmsOtherPage(locale: { eq: $locale }, originalId: { eq: $id }) {
      seo {
        title
        description
        image {
          url
        }
      }
      structuredBody {
        value
        blocks {
          ... on DatoCmsHero {
            id: originalId
            typeName
            heroTitle
            heroSubtitle
            heroAlt
          }
          ... on DatoCmsSectionImageLeft {
            id: originalId
            title
            typeName
            image {
              url
              gatsbyImageData
              alt
            }
            text {
              value
              links {
                ... on DatoCmsOtherPage {
                  id: originalId
                  typeName
                  slug
                }
                ... on DatoCmsHomepage {
                  id: originalId
                  typeName
                }
              }
            }
          }
          ... on DatoCmsSectionImageRight {
            id: originalId
            title
            typeName
            image {
              url
              gatsbyImageData
              alt
            }
            text {
              value
              links {
                ... on DatoCmsOtherPage {
                  id: originalId
                  typeName
                  slug
                }
                ... on DatoCmsHomepage {
                  id: originalId
                  typeName
                }
              }
            }
          }
          ... on DatoCmsThreeFeaturesSet {
            id: originalId
            typeName
            firstFeatureTitle
            firstFeatureDescription
            secondFeatureTitle
            secondFeatureDescription
            thirdFeatureTitle
            thirdFeatureDescription
          }
        }
      }
    }
  }
`;
