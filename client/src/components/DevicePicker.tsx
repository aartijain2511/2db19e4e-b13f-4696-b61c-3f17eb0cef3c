import { FC } from "react";
import { DEVICES } from "../constants";
import styled from "styled-components";
import { theme } from "../styles/Theme";
import { useRecoilState, useSetRecoilState } from "recoil";
import selectedDeviceIdState from "../state/atoms/selectedDeviceIdState";
  import savingsDataState from "../state/atoms/savingsDataState";

const DevicePicker: FC = () => {
  const [selectedDeviceId, setSelectedDeviceId] = useRecoilState<number>(
    selectedDeviceIdState,
  );
  const setSavingsData = useSetRecoilState(savingsDataState)

  const handleDeviceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(event.target.value);
    if (selectedId) {
      setSelectedDeviceId(selectedId);
    }
    setSavingsData({data: {}, error: ""})
  };

  return (
    <Container>
      <StyledSelect
        value={selectedDeviceId ?? ""}
        onChange={handleDeviceChange}
      >
        <option value="">Select Device</option>
        {Object.values(DEVICES)
          .filter((val) => !isNaN(Number(val)))
          .map((value) => {
            const key: keyof typeof DEVICES = value as keyof typeof DEVICES;
            return (
              <option key={value} value={value}>
                {DEVICES[key]}
              </option>
            );
          })}
      </StyledSelect>
    </Container>
  );
};

export default DevicePicker;

const Container = styled.div`
  display: flex;
  justify-content: center;
`;
const StyledSelect = styled.select`
  border: 1px solid ${theme.colors.lightGray};
  padding: 0.3rem;
  width: 8rem;
  margin: 0 2rem;
  border-radius: 5px;
  outline: none;
`;
