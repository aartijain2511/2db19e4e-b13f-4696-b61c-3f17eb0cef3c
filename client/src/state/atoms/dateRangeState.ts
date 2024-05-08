import { atom } from "recoil";
import { Value } from "../../types";

const dateRangeState = atom({
  key: "dateRangeState",
  default: null as Value
});

export default dateRangeState;
