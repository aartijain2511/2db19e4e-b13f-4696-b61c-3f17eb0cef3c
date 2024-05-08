import styled, { keyframes } from "styled-components";
import { theme } from "../styles/Theme";

const Loader = () => {
  return <LoaderDiv data-testid="loader" />;
};

export default Loader;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;
const LoaderDiv = styled.div`
  display: flex;
  width: 168px;
  height: 16px;
  flex-direction: row-reverse;
  flex-wrap: wrap;
  align-content: center;
  justify-content: space-evenly;
  align-items: center;

  &::after {
    border: 2px solid red;
    content: "";
    display: block;
    width: 4px;
    height: 4px;
    margin: 4px;
    border-radius: 50%;
    border: 6px solid black;
    border-color: ${theme.colors.blue} transparent ${theme.colors.blue}
      transparent;
    animation: ${spin} 1.2s linear infinite;
  }
`;
