import React from "react";
import { SvgXml } from "react-native-svg";

export default function BeautyIcon() {
  const scissor = `
  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="800px" width="800px" version="1.1" id="Capa_1" viewBox="0 0 200.899 200.899" xml:space="preserve" >
		<path style="fill:#ffffff;" d="M98.963,147.588c-7.208,0-14.251,6.657-16.738,15.811c-1.653,6.023-1.031,12.419,1.65,17.093    c1.847,3.207,4.427,5.325,7.451,6.148c0.941,0.261,1.929,0.387,2.917,0.387c7.19,0,14.237-6.646,16.753-15.811    c1.646-6.138,1.034-12.358-1.671-17.082c-1.27-2.219-3.597-5.1-7.455-6.159C100.935,147.713,99.954,147.588,98.963,147.588z     M105.161,156.514c2.079,3.643,2.516,8.543,1.195,13.442c-2.108,7.68-8.654,13.442-13.764,12.046    c-1.807-0.487-3.335-1.797-4.552-3.905c-2.058-3.59-2.498-8.614-1.185-13.428c1.872-6.886,7.197-12.283,12.107-12.283    c0.569,0,1.117,0.075,1.639,0.211C102.874,153.236,104.331,155.082,105.161,156.514z"/>
		<path style="fill:#ffffff;" d="M48.472,93.272c-4.706-2.691-11.041-3.303-17.089-1.657c-10.479,2.856-17.551,11.857-15.436,19.666    c0.834,3.017,2.956,5.587,6.156,7.444c2.927,1.671,6.514,2.555,10.368,2.555c2.251,0,4.513-0.301,6.725-0.898    c10.654-2.895,17.583-11.706,15.436-19.662C53.568,96.876,50.698,94.546,48.472,93.272z M37.94,115.74    c-4.781,1.296-9.924,0.82-13.442-1.185c-2.101-1.224-3.421-2.756-3.922-4.549c-1.403-5.2,4.227-11.621,12.064-13.754    c1.847-0.497,3.704-0.759,5.529-0.759c2.956,0,5.687,0.673,7.906,1.943c1.446,0.834,3.296,2.294,3.922,4.552    C51.4,107.19,45.767,113.625,37.94,115.74z"/>
		<path style="fill:#ffffff;" d="M199.815,70.267c-0.279-1.832-1.832-2.831-3.071-3.131l-0.351-0.086l-63.875,3.529l-8.417,6.295    l6.914-8.643l3.93-63.929l0.018-0.412l-0.111-0.397C134.372,1.811,133.137,0,131.136,0c-2.799,0-4.252,3.228-5.569,8.067    c-1.202,4.427-13.983,35.538-20.661,51.607c-0.057,0.2-5.723,19.702-7.916,26.297l-0.225,0.673l-28.928,7.831    c-2.194-5.687-6.438-10.536-12.161-13.814c-7.988-4.563-18.349-5.712-28.101-3.078c-8.847,2.405-16.377,7.58-21.223,14.562    c-4.932,7.118-6.496,15.249-4.409,22.915c1.822,6.735,6.428,12.508,12.963,16.248c7.992,4.574,18.36,5.748,28.112,3.092    c4.277-1.17,8.249-2.992,11.653-5.297l0.723-0.49c0.251-0.186,0.505-0.372,0.605-0.472c16.796-12.447,29.053-17.06,37.034-18.578    c-1.521,7.97-6.12,20.203-18.478,36.909c-0.186,0.215-0.361,0.437-0.705,0.898l-0.501,0.662v0.115    c-2.283,3.439-4.015,7.279-5.154,11.445c-2.645,9.785-1.514,20.038,3.092,28.105c3.747,6.535,9.52,11.134,16.23,12.955    l0.623,0.136l0.691-2.308l-0.512,2.344l0.326,0.075l13.907-0.837l0.662-0.136c10.25-3.615,18.603-13.167,21.802-24.902    c2.652-9.799,1.535-20.049-3.078-28.126c-3.285-5.701-8.128-9.949-13.814-12.136l8.049-29.551    c7.924-2.494,27.711-7.72,28.237-7.881c0.419-0.175,41.096-17.544,49.059-19.712l0.612-0.261    C196.984,75.603,200.266,73.209,199.815,70.267z M109.434,61.277c0.734-1.757,16.989-40.835,20.292-50.447l-3.411,55.597    l-13.754,17.207l-9.942,0.523C105.172,75.979,109.309,61.764,109.434,61.277z M191.859,73.087    c-8.965,2.595-47.667,19.115-49.009,19.712c-0.909,0.236-22.422,5.923-29.422,8.253l-1.217,0.412l-9.949,36.533l2.298,0.651    c5.443,1.51,10.128,5.297,13.202,10.651c3.983,6.968,4.932,15.897,2.616,24.476c-2.759,10.114-9.82,18.331-18.46,21.523    l-13.131,0.787v-0.064c-5.572-1.51-10.185-5.211-13.328-10.697c-3.99-6.982-4.95-15.897-2.638-24.465    c1.059-3.865,2.698-7.419,4.907-10.626l0.157-0.247L77.897,150l0.404-0.523c14.849-20.063,19.065-34.192,19.974-42.51l0.333-2.978    l-2.981,0.336c-8.328,0.923-22.461,5.139-42.638,20.088l-0.687,0.497c-3.167,2.169-6.721,3.815-10.554,4.864    c-8.528,2.294-17.569,1.321-24.465-2.63c-5.494-3.142-9.201-7.755-10.712-13.331C4.86,107.541,6.184,100.823,10.3,94.9    c4.198-6.059,10.776-10.561,18.524-12.669c8.528-2.308,17.576-1.321,24.465,2.616c5.436,3.106,9.126,7.68,10.665,13.195    l0.644,2.308l35.048-9.552l14.97-0.798l19.612-14.698l59.226-3.282C193.036,72.325,192.514,72.686,191.859,73.087z"/>
  </svg>
  `;
  const ScissorSvg = () => <SvgXml xml={scissor} width="50%" height="50%" />;
  return <ScissorSvg />;
}
