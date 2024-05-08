import { FC } from "react";
import DateTimeRangePicker from "@wojtekmaj/react-datetimerange-picker";
import "@wojtekmaj/react-datetimerange-picker/dist/DateTimeRangePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import "../style.css";
import dateRangeState from "../state/atoms/dateRangeState";
import { useRecoilState } from "recoil";
import { Value } from "../types";

const DateTimePicker: FC = () => {
  const [value, onChange] = useRecoilState<Value>(dateRangeState);

  const handleDateChange = (newValue: Value) => {
    onChange(newValue);
  };

  return (
    <div>
      <DateTimeRangePicker
        className="react-datetime-picker--disabled"
        onChange={handleDateChange}
        value={value}
        format="y-MM-dd HH:mm:ss"
        yearPlaceholder="yyyy"
        monthPlaceholder="mm"
        dayPlaceholder="dd"
        hourPlaceholder="hh"
        minutePlaceholder="mm"
        secondPlaceholder="ss"
        maxDate={new Date()}
        minDate={new Date("2023-01-01T00:00:00")}
        calendarIcon={null}
        disableClock={true}
      />
    </div>
  );
};

export default DateTimePicker;
