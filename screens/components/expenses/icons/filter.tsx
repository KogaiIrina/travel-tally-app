import React from "react";
import { SvgXml } from "react-native-svg";

export default function FilterIcon() {
  const filter = `
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" >
  <path d="M17 1H3C1.89543 1 1 1.89543 1 3V4.17157C1 4.70201 1.21071 5.21071 1.58579 5.58579L7.41421 11.4142C7.78929 11.7893 8 12.298 8 12.8284V18V18.2857C8 18.9183 8.76488 19.2351 9.21221 18.7878L10 18L11.4142 16.5858C11.7893 16.2107 12 15.702 12 15.1716V12.8284C12 12.298 12.2107 11.7893 12.5858 11.4142L18.4142 5.58579C18.7893 5.21071 19 4.70201 19 4.17157V3C19 1.89543 18.1046 1 17 1Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>  
  `;
  const FilterSvg = () => <SvgXml xml={filter} width="50%" height="50%" />;
  return <FilterSvg />;
}
