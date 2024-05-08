import styled from "styled-components";
import DevicePicker from "./DevicePicker";
import DateTimePicker from "./DateTimePicker";
import ButtonsPane from "./ButtonsPane";
import Savings from "./Savings";
import { SAVING_TYPE } from "../constants";
import DeviceSavingsChart from "./DeviceSavingsChart";
import { FC } from "react";

const AnalyticsPane: FC = () => {
  return (
    <>
      <Container>
        <DevicePicker />
        <DateTimePicker />
        <ButtonsPane />
      </Container>
      <SavingsContainer>
        <Savings
          title="Estimated carbon savings"
          subtitle="Sum of selected date range"
          type={SAVING_TYPE.CARBON}
        />
        <Savings
          title="Estimated diesel savings"
          subtitle="Sum of selected date range"
          type={SAVING_TYPE.DIESEL}
        />
      </SavingsContainer>
      <DeviceSavingsChart />
    </>
  );
};

export default AnalyticsPane;

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
  gap: 10px;
  align-items: center;

  @media (max-width: 860px) {
    flex-direction: column;
  }
`;

const SavingsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 10rem;
  margin: 1rem;
`;
