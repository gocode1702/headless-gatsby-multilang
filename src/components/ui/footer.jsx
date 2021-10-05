import React, { Fragment, useContext } from "react";

import { graphql, useStaticQuery } from "gatsby";

import styled from "styled-components";

import { StructuredText } from "react-datocms";

import { LangContext } from "../../context/languageProvider";

import { Paragraph } from "../layout/paragraphStyles";

import { SectionWrapper, Divider } from "../layout/sectionStyles";

const FooterContainer = styled.div`
  display: flex;
  width: var(--globalContainer);
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  @media screen and (max-width: 1170px) {
    width: 100%;
  }

  @media screen and (max-width: 950px) {
    flex-direction: column;
    & p {
      font-size: var(--baseM);
      &:first-child {
        margin-bottom: var(--gapRegular);
      }
    }
  }
`;

const Footer = () => {
  const data = useStaticQuery(graphql`
    query FooterQuery {
      allDatoCmsFooter {
        nodes {
          id: originalId
          textLeft {
            value
          }
          textRight {
            value
          }
          locale
        }
      }
    }
  `);

  const { currentLanguage } = useContext(LangContext);

  return (
    <SectionWrapper as="footer">
      <Divider top />
      <FooterContainer>
        {data.allDatoCmsFooter.nodes
          .filter((node) => node.locale === currentLanguage)
          .map((node) => (
            <Fragment key={node.id}>
              <Paragraph small centered as="div">
                <StructuredText data={node.textLeft.value} />
              </Paragraph>
              <Paragraph small centered as="div">
                <StructuredText data={node.textRight.value} />
              </Paragraph>
            </Fragment>
          ))}
      </FooterContainer>
    </SectionWrapper>
  );
};

export default Footer;
