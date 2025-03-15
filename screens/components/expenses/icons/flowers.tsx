import React from "react";
import { SvgXml } from "react-native-svg";

export default function FlowersIcon() {
  const flowers = `
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" >
    <path d="M14 11.6667C15.4167 11.6667 16.5833 10.5 16.5833 9.08333C16.5833 7.66667 15.4167 6.5 14 6.5C12.5833 6.5 11.4167 7.66667 11.4167 9.08333C11.4167 10.5 12.5833 11.6667 14 11.6667ZM14 13.4167C12.5833 13.4167 11.4167 14.5833 11.4167 16C11.4167 17.4167 12.5833 18.5833 14 18.5833C15.4167 18.5833 16.5833 17.4167 16.5833 16C16.5833 14.5833 15.4167 13.4167 14 13.4167ZM14 20.3333C12.5833 20.3333 11.4167 21.5 11.4167 22.9167C11.4167 24.3333 12.5833 25.5 14 25.5C15.4167 25.5 16.5833 24.3333 16.5833 22.9167C16.5833 21.5 15.4167 20.3333 14 20.3333ZM20.9167 13.4167C19.5 13.4167 18.3333 14.5833 18.3333 16C18.3333 17.4167 19.5 18.5833 20.9167 18.5833C22.3333 18.5833 23.5 17.4167 23.5 16C23.5 14.5833 22.3333 13.4167 20.9167 13.4167ZM7.08333 13.4167C5.66667 13.4167 4.5 14.5833 4.5 16C4.5 17.4167 5.66667 18.5833 7.08333 18.5833C8.5 18.5833 9.66667 17.4167 9.66667 16C9.66667 14.5833 8.5 13.4167 7.08333 13.4167ZM7.08333 6.5C5.66667 6.5 4.5 7.66667 4.5 9.08333C4.5 10.5 5.66667 11.6667 7.08333 11.6667C8.5 11.6667 9.66667 10.5 9.66667 9.08333C9.66667 7.66667 8.5 6.5 7.08333 6.5ZM20.9167 6.5C19.5 6.5 18.3333 7.66667 18.3333 9.08333C18.3333 10.5 19.5 11.6667 20.9167 11.6667C22.3333 11.6667 23.5 10.5 23.5 9.08333C23.5 7.66667 22.3333 6.5 20.9167 6.5ZM14 0.583333C12.5833 0.583333 11.4167 1.75 11.4167 3.16667C11.4167 4.58333 12.5833 5.75 14 5.75C15.4167 5.75 16.5833 4.58333 16.5833 3.16667C16.5833 1.75 15.4167 0.583333 14 0.583333Z" fill="white"/>
  </svg>
  `;
  const FlowersSvg = () => <SvgXml xml={flowers} width="50%" height="50%" />;
  return <FlowersSvg />;
} 
