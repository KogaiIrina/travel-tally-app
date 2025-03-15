import React from "react";
import { SvgXml } from "react-native-svg";

export default function StatisticIcon() {
  const statistic = `
    <svg fill="#2C65E1" height="93px" width="93px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 280 280" xml:space="preserve" > <g> <path d="M271,262h-49.238V158.694c0-4.971-4.029-9-9-9h-30.664c-4.971,0-9,4.029-9,9V262h-17.901V115.338c0-4.971-4.029-9-9-9 h-30.664c-4.971,0-9,4.029-9,9V262H88.633V71.553c0-4.971-4.029-9-9-9H48.969c-4.971,0-9,4.029-9,9V262H18V9c0-4.971-4.029-9-9-9 S0,4.029,0,9v262c0,4.971,4.029,9,9,9h262c4.971,0,9-4.029,9-9S275.971,262,271,262z M191.098,167.694h12.664V262h-12.664V167.694z M124.534,124.338h12.664V262h-12.664V124.338z M57.969,80.553h12.664V262H57.969V80.553z"></path>  </g></svg>
  `;
  const StatisticSvg = () => (
    <SvgXml xml={statistic} width="50%" height="50%" />
  );
  return <StatisticSvg />;
}
