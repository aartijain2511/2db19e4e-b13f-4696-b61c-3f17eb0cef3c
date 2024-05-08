import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  body {
    font-family: 'Roboto', sans-serif;
    font-size: 14px;
    text-align: center;
    color: black;
    display: flex;
    flex-flow: column;
    margin: 0;
  }
`;

export default GlobalStyles;
