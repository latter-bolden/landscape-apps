import React from 'react';
import IconButton from '../IconButton';
import BubbleIcon from '../icons/BubbleIcon';
import ElipsisIcon from '../icons/ElipsisIcon';
import FaceIcon from '../icons/FaceIcon';
import HashIcon from '../icons/HashIcon';
import ShareIcon from '../icons/ShareIcon';

export default function ChatMessageOptions() {
  return (
    <div className="z-1 absolute right-2 -top-5 flex flex space-x-[2px] rounded-md border-[1px] border-gray-100 bg-white p-[2px] align-middle opacity-0 group-one-hover:opacity-100">
      <IconButton
        icon={<FaceIcon className="text-gray-400" />}
        label="React"
        action={() => console.log('react')}
      />
      <IconButton
        icon={<BubbleIcon className="text-gray-400" />}
        label="Reply"
        action={() => console.log('reply')}
      />
      <IconButton
        icon={<HashIcon className="text-gray-400" />}
        label="Start Thread"
        action={() => console.log('start thread')}
      />
      <IconButton
        icon={<ShareIcon className="text-gray-400" />}
        label="Send to..."
        action={() => console.log('send to..')}
      />
      <IconButton
        icon={<ElipsisIcon className="text-gray-400" />}
        label="More..."
        action={() => console.log('More...')}
      />
    </div>
  );
}
