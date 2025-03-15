import React from "react";
import { SvgXml } from "react-native-svg";

export default function GiftIcon() {
  const gift = `
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" stroke-width="3" stroke="#ffffff" fill="none"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><rect x="13.19" y="31.01" width="37.65" height="25.15" stroke-linecap="round"></rect><rect x="9.56" y="23.76" width="44.87" height="7.24" rx="1.02" stroke-linecap="round"></rect><path d="M45.73,9.86a6.5,6.5,0,0,0-3.51-1.6c-5.29-.57-7.08,8.12-9.7,14.33a.5.5,0,0,0,.65.65c6.17-2.62,14.46-4.47,14.33-9.69A5.3,5.3,0,0,0,45.73,9.86Z" stroke-linecap="round"></path><path d="M21.79,7.86a6.44,6.44,0,0,0-3.5,1.6,5.32,5.32,0,0,0-1.78,3.69c-.13,5.22,8.16,7.07,14.33,9.69a.5.5,0,0,0,.65-.65C28.87,16,27.08,7.29,21.79,7.86Z" stroke-linecap="round"></path><line x1="32.01" y1="23.36" x2="32.01" y2="56.16" stroke-linecap="round"></line></g></svg>
  `;
  const GiftSvg = () => <SvgXml xml={gift} width="50%" height="50%" />;
  return <GiftSvg />;
} 
