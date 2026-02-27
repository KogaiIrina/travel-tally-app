import React from "react";
import { SvgXml } from "react-native-svg";

export default function CloseIcon() {
  const close = `
    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="96" height="96" fill="none" viewBox="0 0 24 24" >
      <path stroke="#494EBF" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18 17.94 6M18 18 6.06 6"/>
    </svg>
  `;
  const CloseSvg = () => <SvgXml xml={close} width="50%" height="50%" />;
  return <CloseSvg />;
}
