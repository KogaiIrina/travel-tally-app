import React from "react";
import { SvgXml } from "react-native-svg";

export default function DownArrowIcon() {
  const arrow = `
  <svg width="18" height="11" viewBox="0 0 70 11" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M17.6705 0.347571C17.2312 -0.0917693 16.5188 -0.0917693 16.0795 0.347571L9 7.42708L1.92049 0.347571C1.48116 -0.0917697 0.768845 -0.0917698 0.329505 0.347571C-0.109836 0.786909 -0.109836 1.49922 0.329505 1.93856L8.2045 9.81356C8.64384 10.2529 9.35616 10.2529 9.7955 9.81356L17.6705 1.93856C18.1098 1.49922 18.1098 0.786911 17.6705 0.347571Z" fill="#2C65E1"/>
  </svg>
  `;
  const DownArrowIcon = () => <SvgXml xml={arrow} width="50%" height="50%" />;
  return <DownArrowIcon />;
}
