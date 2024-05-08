import { FC } from "react";
import styled from "styled-components";
import GlobalStyles from "./styles/GlobalStyle";
import Theme from "./styles/Theme";
import { theme } from "./styles/Theme";
import SavingsPane from "./components/SavingsPane";
import { RecoilRoot } from "recoil";
import AnalyticsPane from "./components/AnalyticsPane";

const App: FC = () => {
  return (
    <Theme>
      <GlobalStyles />
      <StyledContainer>
        <Title>Estimated carbon savings and diesel savings</Title>
        <Information>
          Download general guidelines on the estimated carbon and diesel savings
          calculations.
        </Information>
      </StyledContainer>
      <RecoilRoot>
        <SavingsPane />
        <AnalyticsPane />
      </RecoilRoot>
    </Theme>
  );
};

export default App;

const StyledContainer = styled.div`
  background-color: white;
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const Title = styled.h2`
  background-color: ${theme.colors.veryPaleGreen};
  color: ${theme.colors.green};
  padding: 1rem;
  margin-top: 0;
  text-align: left;
`;

const Information = styled.p`
  color: ${theme.colors.green};
  text-align: left;
  padding: 0 1rem;
  margin: 0;
  font-size: small;
`;
