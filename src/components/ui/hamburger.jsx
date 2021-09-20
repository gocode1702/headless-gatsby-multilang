import React, { useContext } from "react";

import styled, { css } from "styled-components";

import { graphql, useStaticQuery } from "gatsby";

import { LangContext } from "../../context/languageProvider";

// Styles

const HamburgerButton = styled.button`
  padding: 0.33em;
  display: grid;
  align-content: center;
  width: 40px;
  height: 40px;
  --rowHeight: 4px;
  grid-template-rows: repeat(3, var(--rowHeight));
  row-gap: var(--rowHeight);

  & span {
    border-radius: var(--rowHeight);
    transition: all 0.2s ease-in-out;
    height: var(--rowHeight);
    width: 100%;

    &:first-child,
    &:nth-child(2),
    &:last-child {
      background: var(--baseTextColor);
    }
  }

  ${({ isOpen }) =>
    isOpen &&
    css`
      & span {
        &:first-child {
          transform: translateY(calc(var(--rowHeight) * 2)) rotateZ(45deg);
          opacity: 1;
        }
        &:nth-child(2) {
          opacity: 0;
        }
        &:last-child {
          transform: translateY(calc(var(--rowHeight) * -2)) rotateZ(-45deg);
          opacity: 1;
        }
      }
    `}
`;

// Main Component

const Hamburger = (props) => {
  const data = useStaticQuery(graphql`
    query AriaLabelQuery {
      allDatoCmsMenu {
        edges {
          node {
            ariaLabelHamburger
            locale
          }
        }
      }
    }
  `);

  const { currentLanguage } = useContext(LangContext);

  return (
    <>
      {data.allDatoCmsMenu.edges
        .filter((edge) => edge.node.locale === currentLanguage)
        .map((edge) => (
          <HamburgerButton
            key={`hamb_${edge.node.locale}`}
            aria-label={edge.node.ariaLabelHamburger}
            isOpen={props.isOpen}
            onClick={props.onClick}
          >
            <span> </span>
            <span> </span>
            <span> </span>
          </HamburgerButton>
        ))}
    </>
  );
};

export default Hamburger;
