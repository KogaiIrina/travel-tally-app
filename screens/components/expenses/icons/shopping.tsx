import React from "react";
import { SvgXml } from "react-native-svg";

export default function ShoppingIcon() {
  const shopping = `
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" enable-background="new 0 0 32 32" xml:space="preserve" fill="#ffffff" > <g> <path fill="#ffffff" d="M1.683,32h28.635c0.442,0,0.86-0.194,1.146-0.531c0.286-0.338,0.407-0.782,0.334-1.218l-3.538-21 C28.137,8.526,27.515,8,26.779,8H22V6c0-3.309-2.691-6-6-6s-6,2.691-6,6v2H5.221C4.485,8,3.863,8.526,3.741,9.251l-3.538,21 c-0.073,0.436,0.048,0.88,0.334,1.218C0.823,31.806,1.24,32,1.683,32z M11,6c0-2.757,2.243-5,5-5s5,2.243,5,5v2H11V6z M4.728,9.417 C4.768,9.175,4.976,9,5.221,9H10v4c0,0.276,0.224,0.5,0.5,0.5S11,13.276,11,13V9h10v4c0,0.276,0.224,0.5,0.5,0.5S22,13.276,22,13V9 h4.779c0.245,0,0.453,0.175,0.493,0.417l3.538,21c0.025,0.147-0.015,0.292-0.111,0.406S30.467,31,30.317,31H1.683 c-0.149,0-0.285-0.063-0.382-0.177s-0.136-0.258-0.111-0.406L4.728,9.417z"></path>  </g></svg>
  `;
  const ShoppingSvg = () => (
    <SvgXml xml={shopping} width="50%" height="50%" />
  );
  return <ShoppingSvg />;
}
