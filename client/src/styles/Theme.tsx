import { ThemeProvider } from "styled-components";
import { ReactNode } from "react";

export const theme = {
  colors: {
    green: "#0DCFA7",
    blue: "#4A46FF",
    veryPaleGreen: "#E9FBF7",
    lightGray: "#cdd7ee"
  }
};

const Theme = ({ children }: { children: ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

export default Theme;
