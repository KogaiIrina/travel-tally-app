import React from "react";
import { SvgXml } from "react-native-svg";

export default function DisplayIcon() {
  const display = `
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M0.600006 22.8H14.4V24.6H7.20001V25.8H22.8V24.6H15.6V22.8H29.4V4.79999H0.600006V22.8ZM1.80001 5.99999H28.2V21.6H1.80001V5.99999Z" fill="white"/>
  </svg>  
  `;
  const DisplaySvg = () => <SvgXml xml={display} width="50%" height="50%" />;
  return <DisplaySvg />;
}
