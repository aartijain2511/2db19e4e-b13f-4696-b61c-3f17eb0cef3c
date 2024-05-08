import { atom } from "recoil";
import { STATUS } from "../../constants";

type FetchState = null | STATUS;

const apiFetchState = atom<FetchState>({
  key: "apiFetchState",
  default: null
});

export default apiFetchState;

