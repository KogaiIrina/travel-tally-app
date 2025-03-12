import React from "react";
import { SvgXml } from "react-native-svg";

export default function PlusIcon() {
  const plus = `
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M4 12L20 12" stroke="white" stroke-width="4" stroke-linecap="round"/>
  <path d="M12 20L12 4" stroke="white" stroke-width="4" stroke-linecap="round"/>
  </svg>
  `;
  const PlusSvg = () => <SvgXml xml={plus} width="50%" height="50%" />;
  return <PlusSvg />;
}
