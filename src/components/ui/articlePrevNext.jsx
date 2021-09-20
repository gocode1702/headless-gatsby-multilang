import styled from "styled-components";

const Nav = styled.nav`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 700px;
  margin: var(--gapXL) 0 0 0;

  @media screen and (max-width: 860px) {
    width: 100%;
  }

  & div {
    display: grid;
    grid-template-rows: auto auto;
    align-content: baseline;
    row-gap: var(--gapSmall);

    & h2 {
      line-height: 1;
    }

    &:first-of-type {
      justify-items: left;
      & h2 {
        text-align: left;
      }
    }

    &:last-of-type {
      justify-items: right;

      & h2 {
        text-align: right;
      }
    }

    & span {
      font-size: var(--baseM);
      line-height: 1;
    }

    & a {
      color: var(--primaryColor);
      font-size: var(--baseL);
      font-weight: 600;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

const PrevNextNav = (props) => (
  <Nav>
    {props.previousNavRender}
    {props.nextNavRender}
  </Nav>
);

export default PrevNextNav;
