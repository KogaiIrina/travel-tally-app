import React from "react";
import { SvgXml } from "react-native-svg";

export default function UtilityIcon() {
  const utility = `
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" >
    <svg viewBox="-1.5 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#ffffff"  stroke-width="0.48"> <g id="icomoon-ignore">  <path d="M16.784 10.755c-1.737 0-3.147 1.409-3.147 3.147s1.41 3.148 3.147 3.148c1.739 0 3.147-1.409 3.147-3.148s-1.409-3.147-3.147-3.147zM16.784 16c-1.156 0-2.098-0.941-2.098-2.099s0.941-2.098 2.098-2.098c1.158 0 2.098 0.941 2.098 2.098s-0.941 2.099-2.098 2.099z" fill="#ffffff"> </path> <path d="M4.196 6.034v15.735h25.176v-15.735h-25.176zM28.324 9.583v11.137h-23.078v-13.637h23.078v2.5z" fill="#ffffff"> </path> <path d="M23.746 22.819h-20.599v-14.686h-1.049v15.735h25.177v-1.049h-1.049z" fill="#ffffff"> </path> <path d="M21.648 24.917h-20.599v-14.686h-1.049v15.735h25.177v-1.049h-1.049z" fill="#ffffff"> </path> <path d="M6.819 8.165h3.147v1.049h-3.147v-1.049z" fill="#ffffff"> </path> <path d="M6.819 18.623h3.147v1.049h-3.147v-1.049z" fill="#ffffff"> </path> <path d="M23.603 8.165h3.147v1.049h-3.147v-1.049z" fill="#ffffff"> </path> <path d="M23.603 18.623h3.147v1.049h-3.147v-1.049z" fill="#ffffff"> </path> </g></svg>
  </svg>
  `;
  const UtilitySvg = () => <SvgXml xml={utility} width="50%" height="50%" />;
  return <UtilitySvg />;
} 
