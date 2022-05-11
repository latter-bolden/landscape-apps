import React from 'react';
import { ChatImage } from '../../types/chat';
import ElipsisCircleIcon from '../icons/ElipsisCircleIcon';
import ExpandIcon from '../icons/ExpandIcon';

export default function ChatImage({ src, height, width, altText }: ChatImage) {
  return (
    <div
      className="group relative py-2"
      style={{ width: width ? (width > 600 ? 375 : width) : 375 }}
    >
      <a href={src} target="_blank" rel="noreferrer">
        <img
          src={src}
          height={height}
          width={width}
          alt={altText ? altText : 'A chat image'}
        />
      </a>
      <div className="absolute top-5 right-[11px] flex space-x-2 text-white opacity-0 group-hover:opacity-100">
        <a
          className="h-[18px] w-[18px] cursor-pointer"
          href={src}
          target="_blank"
          rel="noreferrer"
        >
          <ExpandIcon />
        </a>
        <button
          className="h-[18px] w-[18px] cursor-pointer"
          onClick={() => console.log('hi')}
        >
          <ElipsisCircleIcon />
        </button>
      </div>
    </div>
  );
}
