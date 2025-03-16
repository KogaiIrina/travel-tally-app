import React from "react";
import { SvgXml } from "react-native-svg";

export default function DogIcon() {
  const dog = `
    <svg version="1.1" id="Layer_1" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve" fill="#ffffff" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>Dog</title> <desc>Created with Sketch.</desc> <g id="Group" transform="translate(1.000000, 6.000000)" sketch:type="MSShapeGroup"> <path id="Shape_1_" fill="none" stroke="#ffffff" stroke-width="2.368" stroke-linejoin="round" d="M34.7,42c-2.8,0-6.4,4.9-6.4,8h-5.2 c-1.7,0-3.2,1.6-3.2,3.5l0,0c0,2,1.4,3.4,3.2,3.4h22.5C58.6,57,62.1,45.3,61,37.1l0,0c0,0-11.1,11.8-14.1,11.8 c0.1-12.2-8.9-23.7-14.8-29C28.8,16.9,27.9,9,27.9,9V4.8c0-4.3-0.3-8.9-1.2-9.5c-1.6-1.1-4.4,4.6-6.7,4.6c-11.7,0-10,8-12.5,8H2.2 C0,7.9,0,9.7,0,10.9c0.2,3.3,1.9,6,10,6c2,0,5.1,2.8,5.1,7.9v26.1H15h-1c-1.1,0-2,0.9-2,2v2c0,1.1,0.9,2,2,2h15.75"></path> <path id="Shape_2_" fill="none" stroke="#ffffff" stroke-width="2.368" stroke-linejoin="round" d="M20.9,38v8.8"></path> <path id="Shape_4_" fill="none" stroke="#ffffff" stroke-width="2.368" stroke-linejoin="round" d="M1,14h6"></path> </g> </g></svg>
  `;
  const DogSvg = () => <SvgXml xml={dog} width="50%" height="50%" />;
  return <DogSvg />;
} 
