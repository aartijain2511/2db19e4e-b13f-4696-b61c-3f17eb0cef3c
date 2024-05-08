import { FC, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { theme } from "../styles/Theme";
import { useRecoilState, useRecoilValue } from "recoil";
import selectedDeviceIdState from "../state/atoms/selectedDeviceIdState";
import dateRangeState from "../state/atoms/dateRangeState";
import getDates from "../utils/getDates";
import useFetch from "../hooks/useFetch";
import { Value } from "../types";

type ButtonProps = {
  selected: boolean;
  disabled?: boolean;
};

const getSavingsBtn = { id: 1, title: "Get Savings", duration: "custom" };
const tabs = [
  { id: 2, title: "Last 30 days", duration: "30" },
  {
    id: 3,
    title: "Last 60 days",
    duration: "60",
  },
  {
    id: 4,
    title: "Last year",
    duration: "year",
  },
];

const ButtonsPane: FC = () => {
  const [selectedBtnId, setSelectedBtnId] = useState<number | null>(null);
  const [dateRange, setDateRangeState] = useRecoilState(dateRangeState);
  const deviceId = useRecoilValue<number>(selectedDeviceIdState);
  const fetchSavingsData = useFetch();
  const prevDateRangeRef = useRef<Value>(null);

  useEffect(() => {
    setSelectedBtnId(null);
    setDateRangeState(null);
  }, [deviceId, setDateRangeState]);

  useEffect(() => {
    if (dateRange !== prevDateRangeRef.current) {
      setSelectedBtnId(0);
      prevDateRangeRef.current = dateRange;
    }
  }, [dateRange, prevDateRangeRef]);

  function handleClick(buttonId: number, duration: string) {
    setSelectedBtnId(buttonId);
    let dates = dateRange;
    if (duration !== "custom") {
      const newDateRange = getDates(duration);
      setDateRangeState(newDateRange);
      prevDateRangeRef.current = newDateRange;
      dates = newDateRange;
    }
    fetchSavingsData(deviceId, dates);
  }

  function isButtonDisabled(buttonId: number): boolean {
    if (buttonId !== 1) {
      return deviceId === 0;
    } else {
      return dateRange !== null ? deviceId === 0 : true;
    }
  }

  return (
    <Container>
      <GetSavingsStyledButton
        key={getSavingsBtn.id}
        selected={selectedBtnId === getSavingsBtn.id && dateRange !== null}
        disabled={isButtonDisabled(getSavingsBtn.id)}
        onClick={() => handleClick(getSavingsBtn.id, getSavingsBtn.duration)}
      >
        {getSavingsBtn.title}
      </GetSavingsStyledButton>
      {tabs.map(({ id: buttonId, title, duration }) => {
        return (
          <StyledButton
            key={buttonId}
            selected={selectedBtnId === buttonId && dateRange !== null}
            disabled={isButtonDisabled(buttonId)}
            onClick={() => handleClick(buttonId, duration)}
          >
            {title}
          </StyledButton>
        );
      })}
    </Container>
  );
};

export default ButtonsPane;

const Container = styled.div`
  display: flex;
  justify-content: left;
  flex-direction: row;
  gap: 10px;
  margin: 0 1rem;

  @media (max-width: 860px) {
    margin: 0 1rem;
  }
`;

const StyledButton = styled.button<ButtonProps>`
  background-color: ${(props) =>
    props.selected ? theme.colors.veryPaleGreen : "white"};
  border-radius: 5px;
  padding: 0.3rem;
  border: 1px solid ${theme.colors.lightGray};

  &:hover {
    background-color: ${(props) =>
      props.disabled ? "white" : theme.colors.veryPaleGreen};
  }
`;

const GetSavingsStyledButton = styled.button<ButtonProps>`
  background-color: ${(props) =>
    props.selected ? theme.colors.veryPaleGreen : "white"};
  border-radius: 5px;
  padding: 0.3rem;
  margin-right: 5rem;
  border: 1px solid ${theme.colors.lightGray};

  &:hover {
    background-color: ${(props) =>
      props.disabled ? "white" : theme.colors.veryPaleGreen};
  }

  @media (max-width: 860px) {
    display: flex;
    flex-direction: row;
  }
`;
