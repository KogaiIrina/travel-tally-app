import React from "react";
import { SvgXml } from "react-native-svg";

export default function GroceriesIcon() {
  const groceries = `
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M4.46484 21.375L6.75 32.625H29.25L31.5 21.375" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M10.4766 30.375L9 23.6173" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M27 23.6173L25.5234 30.375" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M22.7988 23.6173L21.6738 30.375" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M14.0625 30.375L12.9375 23.6173" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M24.9961 19.125L18.0942 7.12687C18.001 6.96538 17.9757 6.77346 18.024 6.59334C18.0722 6.41322 18.1901 6.25965 18.3516 6.1664L19.0821 5.74453C19.2436 5.65129 19.4355 5.62603 19.6157 5.67429C19.7958 5.72255 19.9493 5.84038 20.0426 6.00187L27.5977 19.125" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M27 21.375H2.95312C2.76664 21.375 2.5878 21.3009 2.45594 21.1691C2.32408 21.0372 2.25 20.8583 2.25 20.6719V19.8281C2.25 19.6416 2.32408 19.4628 2.45594 19.3309C2.5878 19.1991 2.76664 19.125 2.95312 19.125H33.0469C33.2334 19.125 33.4122 19.1991 33.5441 19.3309C33.6759 19.4628 33.75 19.6416 33.75 19.8281V20.6719C33.75 20.8583 33.6759 21.0372 33.5441 21.1691C33.4122 21.3009 33.2334 21.375 33.0469 21.375H29.25M11.0039 19.125L17.9058 7.12687C17.999 6.96537 18.0243 6.77346 17.976 6.59334C17.9278 6.41322 17.8099 6.25964 17.6484 6.1664L16.9179 5.74452C16.7567 5.6524 16.5656 5.62775 16.3864 5.67597C16.2071 5.72418 16.0542 5.84133 15.9609 6.00187L8.40234 19.125H11.0039Z" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M18 23.6173V30.375" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M4.46484 19.125V14.625H10.9927" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M24.75 14.1785V10.125L25.875 7.875H30.375L31.5 10.125V19.125" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M28.125 12.375C28.7463 12.375 29.25 11.8713 29.25 11.25C29.25 10.6287 28.7463 10.125 28.125 10.125C27.5037 10.125 27 10.6287 27 11.25C27 11.8713 27.5037 12.375 28.125 12.375Z" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M25.875 7.875V5.65031H30.375V7.875" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M12.9375 16.875C12.9375 16.2783 13.1746 15.706 13.5965 15.284C14.0185 14.8621 14.5908 14.625 15.1875 14.625V14.625C15.7842 14.625 16.3565 14.8621 16.7785 15.284C17.2004 15.706 17.4375 16.2783 17.4375 16.875M12.375 16.875H13.5C14.0967 16.875 14.669 17.1121 15.091 17.534C15.5129 17.956 15.75 18.5283 15.75 19.125C15.75 18.5283 15.9871 17.956 16.409 17.534C16.831 17.1121 17.4033 16.875 18 16.875V16.875C18.5967 16.875 19.169 17.1121 19.591 17.534C20.0129 17.956 20.25 18.5283 20.25 19.125L12.375 16.875Z" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M18 16.875V12.375H21.1205" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M6.75 14.625V12.375C6.75 11.7783 6.98705 11.206 7.40901 10.784C7.83097 10.3621 8.40326 10.125 9 10.125V10.125V3.375H11.25V10.125C11.6014 10.1244 11.9485 10.2033 12.2651 10.3559C12.5817 10.5085 12.8596 10.7307 13.0781 11.006" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M9 5.65031H11.25" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  `;
  const GroceriesSvg = () => (
    <SvgXml xml={groceries} width="50%" height="50%" />
  );
  return <GroceriesSvg />;
}
