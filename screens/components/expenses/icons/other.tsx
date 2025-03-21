import React from "react";
import { SvgXml } from "react-native-svg";

export default function OtherIcon() {
  const other = `
  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#ffffff" version="1.1" id="Capa_1" width="1000px" height="1000px" viewBox="0 0 49.141 49.141" xml:space="preserve" >
        <path d="M40.082,45.237c-0.289,0-0.57-0.125-0.764-0.354l-5.623-6.646H6.669C2.991,38.237,0,35.245,0,31.567V10.573     c0-3.678,2.992-6.67,6.669-6.67h35.803c3.679,0,6.669,2.992,6.669,6.67v20.994c0,3.678-2.992,6.67-6.669,6.67H41.08v6     c0,0.419-0.262,0.794-0.655,0.938C40.312,45.218,40.197,45.237,40.082,45.237z M6.669,5.903C4.094,5.903,2,7.999,2,10.573v20.994     c0,2.574,2.095,4.67,4.669,4.67h27.489c0.293,0,0.572,0.129,0.763,0.354l4.159,4.916v-4.27c0-0.553,0.449-1,1-1h2.392     c2.575,0,4.669-2.096,4.669-4.67V10.573c0-2.575-2.095-4.67-4.669-4.67H6.669z"/>
        <circle cx="16.873" cy="21.362" r="2.339"/>
        <circle cx="24.571" cy="21.362" r="2.339"/>
        <circle cx="32.748" cy="21.362" r="2.339"/>
  </svg>
  `;
  const OtherSvg = () => <SvgXml xml={other} width="50%" height="50%" />;
  return <OtherSvg />;
}
