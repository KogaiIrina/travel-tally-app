import React from "react";
import { SvgXml } from "react-native-svg";

export default function SofaIcon() {
  const sofa = `
  <svg fill="#ffffff" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 60 60" xml:space="preserve" > <path d="M60,21h-2V10H31h-2H2v11H0v23h2v3h2v1c-0.552,0-1,0.448-1,1s0.448,1,1,1h2c0.552,0,1-0.448,1-1s-0.448-1-1-1v-1h2v-3h44v3h2 v1c-0.552,0-1,0.448-1,1s0.448,1,1,1h2c0.552,0,1-0.448,1-1s-0.448-1-1-1v-1h2v-3h2V21z M31,12h25v9h-4v7H31V12z M8,30h21h2h21v6H8 V30z M4,12h25v16H8v-7H4V12z M6,45H4v-1h2V45z M56,45h-2v-1h2V45z M58,42h-6H8H2V23h4v5v2v8h48v-8v-2v-5h4V42z"></path> </svg>
  `;
  const SofaSvg = () => <SvgXml xml={sofa} width="50%" height="50%" />;
  return <SofaSvg />;
}
