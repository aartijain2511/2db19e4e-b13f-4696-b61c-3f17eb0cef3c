import { FC } from "react";
import styled from "styled-components";
import { theme } from "../styles/Theme";
import { SAVING_TYPE, STATUS } from "../constants";
import { useRecoilValue } from "recoil";
import savingsDataState from "../state/atoms/savingsDataState";
import calculateAvg from "../utils/calculateAvg";
import formatValue from "../utils/formatValue";
import apiFetchState from "../state/atoms/apiFetchState";
import Loader from "./Loader";

type ContainerStyleProps = {
  type: SAVING_TYPE;
};

const Savings: FC<{
  title?: string | null;
  subtitle: string;
  type: SAVING_TYPE;
}> = ({ title = null, subtitle, type }) => {
  const { data } = useRecoilValue(savingsDataState);
  const dataFetch = useRecoilValue(apiFetchState);
  const isDataEmpty = Object.keys(data)?.length === 0;
  const totalCarbonSavings = data?.totalCarbonSavings ?? "-";
  const totalDieselSavings = data?.totalDieselSavings ?? "-";
  let isCarbon = type === SAVING_TYPE.CARBON;
  let isMonthlyApprox = (data?.savingsPerDay?.length ?? 0) >= 60 ? true : false;
  let dividend = isMonthlyApprox
    ? data?.savingsPerMonth?.length ?? 0
    : data?.savingsPerDay?.length ?? 0;

  return (
    <StyledDiv>
      <Container type={type}>
        {title && <Title>{title}</Title>}
        <Subtitle>{subtitle}</Subtitle>
        <StyledValue>
          {dataFetch === null && totalCarbonSavings}
          {dataFetch === STATUS.PENDING && <Loader />}
          {dataFetch === STATUS.SUCCESS &&
            (isCarbon
              ? formatValue(totalCarbonSavings)
              : formatValue(totalDieselSavings))}
          {dataFetch === STATUS.FAILED && <>Error fetching data...</>}
        </StyledValue>
        {!isDataEmpty && (
          <StyledUnit>{isCarbon ? "Tonnes" : "Litres"}</StyledUnit>
        )}
      </Container>
      {subtitle === "Total" && (
        <Container type={type}>
          <Subtitle>{isMonthlyApprox ? "Monthly" : "Daily"}</Subtitle>
          <StyledValue>
            {dataFetch === null && totalCarbonSavings}
            {dataFetch === STATUS.PENDING && <Loader />}
            {dataFetch === STATUS.SUCCESS &&
              (isCarbon
                ? totalCarbonSavings !== "-" && dividend > 0
                  ? formatValue(calculateAvg(totalCarbonSavings, dividend))
                  : "-"
                : totalDieselSavings !== "-" && dividend > 0
                  ? formatValue(calculateAvg(totalDieselSavings, dividend))
                  : "-")}
          </StyledValue>
          {!isDataEmpty && (
            <StyledUnit>{isCarbon ? "Tonnes" : "Litres"}</StyledUnit>
          )}
        </Container>
      )}
    </StyledDiv>
  );
};

export default Savings;

const StyledDiv = styled.div`
  display: flex;
  justify-content: space-around;
  flex-direction: row;
`;

const Container = styled.div<ContainerStyleProps>`
  display: flex;
  justify-content: center;
  flex-direction: column;
  color: ${(props: { type: SAVING_TYPE }) =>
    props.type === SAVING_TYPE.CARBON ? theme.colors.green : theme.colors.blue};
`;

const Title = styled.p`
  color: black;
  margin-bottom: 0.2rem;
`;

const Subtitle = styled.p`
  font-size: small;
  color: gray;
  padding: 0;
  margin: 0;
`;

const StyledValue = styled.h3`
  margin: 0.5rem 0 0;
  padding: 0;
`;

const StyledUnit = styled.h4`
  padding: 0 0 1rem;
  margin: 0.3rem;
`;
