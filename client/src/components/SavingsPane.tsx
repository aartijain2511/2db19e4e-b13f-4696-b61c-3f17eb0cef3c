import { FC } from "react";
import styled from "styled-components";
import { theme } from "../styles/Theme";
import { SAVING_TYPE } from "../constants";
import Savings from "./Savings";

const SavingsPane: FC = () => {
  return (
    <Container>
      <Title>Estimated carbon savings</Title>
      <Info>1 Tonne = 1,000 kg</Info>
      <Savings subtitle={"Total"} type={SAVING_TYPE.CARBON} />
      <Title>Estimated diesel savings</Title>
      <Savings subtitle={"Total"} type={SAVING_TYPE.DIESEL} />
    </Container>
  );
};

export default SavingsPane;

const Container = styled.div`
  margin: 1rem 1rem;
  border-bottom: 1px ${theme.colors.lightGray} solid;
`;

const Title = styled.h3`
  display: flex;
  text-align: left;
  margin: 0.5rem 0;
  padding-top: 0.5rem;
  border-top: 1px ${theme.colors.lightGray} solid;
`;

const Info = styled.p`
  font-size: small;
  text-align: left;
  color: gray;
  margin: 0;
  padding: 0;
`;
