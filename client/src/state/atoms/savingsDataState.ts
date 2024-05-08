import { atom } from "recoil";
import { ApiData } from "../../types";


const savingsDataState = atom<ApiData>({
  key: "savingsDataState",
  default: {
    data: {},
    error: "",
  },
});

export default savingsDataState;
