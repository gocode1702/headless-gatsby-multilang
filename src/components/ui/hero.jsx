import React from "react";

import styled from "styled-components";

import { HeroSubtitle, HeroTitle, HeroAlt } from "../layout/headingStyles";

import { Divider } from "../layout/sectionStyles";

const HeroWrapper = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: ${(props) => props.fullView && "100vh"};
  padding: var(--globalPaddingTb) var(--globalPaddingLr);
  flex-direction: column;
  position: relative;
`;

const HeroContainer = styled.div`
  width: var(--globalContainer);
  display: grid;
  row-gap: var(--gapXL);
  justify-content: ${(props) => props.centered && "center"};

  @media screen and (max-width: 1170px) {
    width: 100%;
  }
`;

const HeroTextBox = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  row-gap: var(--gapRegular);
  width: 600px;
  justify-items: ${(props) => props.centered && "center"};

  @media screen and (max-width: 767px) {
    width: 100%;
  }
`;

const Hero = (props) => (
  <HeroWrapper fullView={props.fullView}>
    <HeroContainer centered={props.centered}>
      <HeroTextBox centered={props.centered}>
        {props.alt && <HeroAlt>{props.alt}</HeroAlt>}
        <HeroTitle centered={props.centered}>{props.title}</HeroTitle>
        <HeroSubtitle centered={props.centered}>{props.subtitle}</HeroSubtitle>
        {props.button}
      </HeroTextBox>
      {props.sectionChildren}
    </HeroContainer>
    {props.hasDivider && <Divider bottom />}
  </HeroWrapper>
);

export default Hero;
