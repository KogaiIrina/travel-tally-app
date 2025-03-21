import React from "react";
import { SvgXml } from "react-native-svg";

export default function CatIcon() {
  const cat = `
  <svg version="1.1" id="Layer_1" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 54 65" enable-background="new 0 0 54 65" xml:space="preserve" fill="#ffffff" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>Cat</title> <desc>Created with Sketch.</desc> <g id="Page-1" sketch:type="MSPage"> <g id="Cat" transform="translate(1.000000, 2.000000)" sketch:type="MSLayerGroup"> <path id="Shape" sketch:type="MSShapeGroup" fill="none" stroke="#ffffff" stroke-width="2.97" stroke-linecap="round" stroke-linejoin="round" d=" M42.3,54.2c0-1-1.9-6.1,3.9-14.2S51,28.9,51,25.8"></path> <path id="Shape_2_" sketch:type="MSShapeGroup" fill="none" stroke="#ffffff" stroke-width="2.97" stroke-linecap="round" stroke-linejoin="round" d=" M30.3,32.6c7.2,6.8,12.1,17,12.1,23c0,9.7-9.3,5.4-21,5.4S0.1,65.2,0.1,55.6c0-6.1,4.9-16.2,12.1-23"></path> <path id="Shape_1_" sketch:type="MSShapeGroup" fill="none" stroke="#ffffff" stroke-width="2.97" stroke-linecap="round" stroke-linejoin="round" d=" M27.2,33c8.7-1.8,15.1-7.4,15.1-14.1c0-2.9-2-7.2-2.8-8.8C40.4,8.4,41,0.9,39.6,0c-1.5-0.8-8.3,6.4-8.3,6.4 c-3.2-1.4-6-2.2-10.1-2.2S13.3,5,10.1,6.4c0,0-5.6-7.1-7.1-6.2C1.6,1,1.9,8.1,2.7,10C1.9,11.6,0,16,0,18.9 C0,25.6,6.4,31.2,15.1,33"></path> </g> </g> </g></svg>
  `;
  const CatSvg = () => <SvgXml xml={cat} width="50%" height="50%" />;
  return <CatSvg />;
} 
