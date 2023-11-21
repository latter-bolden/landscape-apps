import React from 'react';
import { IconProps } from './icon';

export default function BubbleIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
    >
      <path
        d="M12.9363 18.9622L12.8633 18.0652C12.722 18.0767 12.5854 18.1214 12.4647 18.1958L12.9363 18.9622ZM8.97581 18.5847L9.84119 18.8319C9.97753 18.3547 9.70185 17.8572 9.22497 17.7198L8.97581 18.5847ZM8 22L7.13463 21.7528C7.03262 22.1098 7.16035 22.4928 7.45625 22.7172C7.75214 22.9415 8.15544 22.9611 8.47169 22.7665L8 22ZM20.1 11C20.1 14.9772 17.0392 17.7254 12.8633 18.0652L13.0093 19.8593C17.8946 19.4617 21.9 16.1247 21.9 11H20.1ZM12 3.9C16.6109 3.9 20.1 6.76406 20.1 11H21.9C21.9 5.51573 17.3302 2.1 12 2.1V3.9ZM3.9 11C3.9 6.76406 7.38906 3.9 12 3.9V2.1C6.66981 2.1 2.1 5.51573 2.1 11H3.9ZM9.22497 17.7198C6.06678 16.81 3.9 14.3618 3.9 11H2.1C2.1 15.2836 4.91897 18.3525 8.72666 19.4495L9.22497 17.7198ZM8.86537 22.2472L9.84119 18.8319L8.11044 18.3374L7.13463 21.7528L8.86537 22.2472ZM12.4647 18.1958L7.52831 21.2335L8.47169 22.7665L13.408 19.7287L12.4647 18.1958Z"
        className="fill-current"
      />
    </svg>
  );
}
