'use client'

import { Fade } from '@mui/material'
import React, { useEffect, useState } from 'react' 
import SearchComponent from '../UI/SearchComponent';
import CloseIcon from '../UI/Assets/CloseIcon';

interface SearchModalProps {
  open: boolean;
  setSearchOpen: (open: boolean) => void;
}

export default function SearchModal({open, setSearchOpen}: SearchModalProps) {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  return (
    <Fade in={isOpen} timeout={500} unmountOnExit>
      <div className='fixed dark:text-white text-black dark:bg-black/50 bg-white/50 backdrop-blur-sm w-full h-full top-0 left-0 z-50'>
        <button onClick={() => setSearchOpen(false)} className='absolute top-4 right-4 cursor-pointer'>
          <CloseIcon />
        </button>
        <div className='flex items-center justify-center h-full'>
          <SearchComponent onHandleSearch={() => setSearchOpen(false)} />
        </div>
      </div>
    </Fade>
  )
}
