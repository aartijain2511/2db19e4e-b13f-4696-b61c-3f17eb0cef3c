import { atom } from "recoil";

const selectedDeviceIdState = atom({
  key: "selectedDeviceIdState",
  default: 0
});

export default selectedDeviceIdState;
