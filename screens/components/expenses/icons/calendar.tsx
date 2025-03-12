import React from "react";
import { SvgXml } from "react-native-svg";

export default function CalendarIcon() {
  const calendar = `
  <svg width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M1.06976 6.55301H14.4378" stroke="#494EBF" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M11.0815 9.48251H11.0905" stroke="#494EBF" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M7.75372 9.48251H7.76272" stroke="#494EBF" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M4.41852 9.48251H4.42752" stroke="#494EBF" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M11.0815 12.397H11.0905" stroke="#494EBF" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M7.75372 12.397H7.76272" stroke="#494EBF" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M4.41852 12.397H4.42752" stroke="#494EBF" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M10.783 1V3.46825" stroke="#494EBF" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M4.72449 1V3.46825" stroke="#494EBF" stroke-linecap="round" stroke-linejoin="round"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M10.9287 2.18439H4.57822C2.3757 2.18439 1 3.41134 1 5.66666V12.4539C1 14.7447 2.3757 16 4.57822 16H10.9218C13.1312 16 14.5 14.7659 14.5 12.5106V5.66666C14.5069 3.41134 13.1382 2.18439 10.9287 2.18439Z" stroke="#494EBF" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  `;
  const CalendarSvg = () => <SvgXml xml={calendar} width="95%" height="95%" />;
  return <CalendarSvg />;
}
