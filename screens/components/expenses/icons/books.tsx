import React from "react";
import { SvgXml } from "react-native-svg";

export default function BooksIcon() {
  const books = `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5 17H9C10.6569 17 12 18.3431 12 20V10C12 7.17157 12 5.75736 11.1213 4.87868C10.2426 4 8.82843 4 6 4H5C4.05719 4 3.58579 4 3.29289 4.29289C3 4.58579 3 5.05719 3 6V15C3 15.9428 3 16.4142 3.29289 16.7071C3.58579 17 4.05719 17 5 17Z" stroke="#ffffff"></path> <path d="M19 17H15C13.3431 17 12 18.3431 12 20V10C12 7.17157 12 5.75736 12.8787 4.87868C13.7574 4 15.1716 4 18 4H19C19.9428 4 20.4142 4 20.7071 4.29289C21 4.58579 21 5.05719 21 6V15C21 15.9428 21 16.4142 20.7071 16.7071C20.4142 17 19.9428 17 19 17Z" stroke="#ffffff"></path> </g></svg>
  `;
  const BooksSvg = () => <SvgXml xml={books} width="50%" height="50%" />;
  return <BooksSvg />;
} 
