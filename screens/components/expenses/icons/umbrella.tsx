import React from "react";
import { SvgXml } from "react-native-svg";

export default function UmbrellaIcon() {
  const umbrella = `
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" >
  <g clip-path="url(#clip0_24_45)">
  <path d="M19.3744 32C18.3381 32 17.3637 31.5965 16.6306 30.8635C15.8974 30.1304 15.4939 29.1558 15.4939 28.1195V15.4456H16.5062V28.1195C16.5062 28.8854 16.8046 29.6059 17.3466 30.1478C17.8883 30.6894 18.6085 30.9877 19.3746 30.9877C20.1406 30.9877 20.8606 30.6894 21.4027 30.1478C21.9445 29.6059 22.2427 28.8854 22.2427 28.1195H23.255C23.255 29.156 22.8515 30.1304 22.1186 30.8635C21.3851 31.5965 20.4106 32 19.3744 32Z" fill="white"/>
  <path d="M10.2215 19.5985L9.82625 18.7944C8.75905 16.6227 6.59473 15.2733 4.17777 15.2733C3.65489 15.2733 3.13313 15.3382 2.62689 15.4664L1.96545 15.6339L1.99713 14.9523C2.34465 7.46111 8.49538 1.59311 16 1.59311C23.5042 1.59311 29.6549 7.46111 30.0029 14.9523L30.0346 15.6339L29.373 15.4664C28.8671 15.3382 28.3451 15.2733 27.8213 15.2733C25.4053 15.2733 23.2415 16.6224 22.1743 18.7939L21.7791 19.5979L21.2943 18.8446C20.1287 17.0331 18.1495 15.9515 16 15.9515C13.8506 15.9515 11.8715 17.0333 10.7064 18.8448L10.2215 19.5985ZM4.17777 14.2609C6.70849 14.2609 9.00081 15.5349 10.3346 17.6346C11.7154 15.9336 13.7792 14.9393 16 14.9393C18.2208 14.9393 20.285 15.9334 21.6659 17.6342C22.9999 15.5349 25.2915 14.2609 27.8213 14.2609C28.1979 14.2609 28.5741 14.2899 28.9453 14.3475C28.3083 7.71215 22.7429 2.60543 16 2.60543C9.25666 2.60543 3.69137 7.71215 3.05457 14.3475C3.42577 14.2901 3.80161 14.2609 4.17777 14.2609Z" fill="white"/>
  <path d="M22.2257 18.5712H21.2136C21.2136 9.02079 18.5178 2.60543 16 2.60543C13.4822 2.60543 10.7866 9.02079 10.7866 18.5712H9.77423C9.77423 14.1163 10.379 9.92095 11.4774 6.75759C12.6338 3.42719 14.2402 1.59311 16 1.59311C17.7598 1.59311 19.3662 3.42719 20.5227 6.75759C21.6211 9.92095 22.2257 14.1165 22.2257 18.5712Z" fill="white"/>
  <path d="M16.5061 0H15.4938V2.09936H16.5061V0Z" fill="white"/>
  
  <defs>
  <clipPath id="clip0_24_45">
  <rect width="32" height="32" fill="white"/>
  </clipPath>
  </defs>
  </g></svg>
  `;
  const UmbrellaSvg = () => <SvgXml xml={umbrella} width="50%" height="50%" />;
  return <UmbrellaSvg />;
}
