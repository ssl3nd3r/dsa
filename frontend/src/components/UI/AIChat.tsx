import React, { useState } from 'react'
import AIStars from './Assets/AIStars';
import { ClickAwayListener } from '@mui/material';
import AIDialog from './AIDialog';

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [threadId, setThreadId] = useState('');
  return (
    <ClickAwayListener onClickAway={() => setIsOpen(false)}>
      <div>
        <AIDialog isOpen={isOpen} threadId={threadId} setIsOpen={setIsOpen} setThreadId={setThreadId} />
        <button
          className="p-2 fixed cursor-pointer bottom-4 right-4 rounded-full bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black"
          aria-label={`AI Chat`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <AIStars size={20} />
        </button>
      </div>
    </ClickAwayListener>
  )
}
