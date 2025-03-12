import React from "react";
import { SvgXml } from "react-native-svg";

export default function ArrowIcon() {
  const arrow = `
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M6 12L7.06125 10.9387L2.8725 6.75L12 6.75L12 5.25L2.8725 5.25L7.06125 1.06125L6 -1.47821e-06L-4.29138e-07 6L6 12Z" fill="white"/>
  </svg>
  `;
  const ArrowSvg = () => <SvgXml xml={arrow} width="50%" height="50%" />;
  return <ArrowSvg />;
}
