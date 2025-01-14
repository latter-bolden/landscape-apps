import React from 'react';
import { IconProps } from './icon';
import ChristmasIcon from './ChristmasIcon';

export default function TalkIcon({ className }: IconProps) {
  // christmas decoration
  const now = new Date();
  const day = now.getDate();
  if (now.getMonth() === 11 && day >= 24 && day <= 26) {
    return <ChristmasIcon className={className} />;
  }

  return (
    <svg
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <path
        className="fill-current"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1 18C1 18.1726 1.00874 18.3431 1.02581 18.5112C1.145 19.6849 1.67009 20.7385 2.45848 21.5295C2.54516 21.6165 2.63502 21.7003 2.72787 21.7807C3.60481 22.5404 4.74873 23 6 23H18C20.7614 23 23 20.7614 23 18L23 17.9956C22.9976 15.2362 20.76 13 18 13H16V15.2609C16 15.8132 15.5523 16.2609 15 16.2609C14.4477 16.2609 14 15.8132 14 15.2609V8.73914C14 8.18685 14.4477 7.73914 15 7.73914C15.5523 7.73914 16 8.18685 16 8.73914V11H18C20.7614 11 23 8.76142 23 6C23 3.23858 20.7614 1 18 1L6 1.00001C3.23858 1.00001 1 3.23858 1 6.00001C1 8.76143 3.23858 11 6 11H8L8 8.73914C8 8.18685 8.44772 7.73914 9 7.73914C9.55228 7.73914 10 8.18685 10 8.73914V15.2609C10 15.8132 9.55228 16.2609 9 16.2609C8.44771 16.2609 8 15.8132 8 15.2609L8 13H6C3.23858 13 1 15.2386 1 18Z"
      />
    </svg>
  );
}
