import React, { useState } from 'react'
import { Slider } from '@mui/material'
import { useTheme } from '@/lib/hooks/useTheme';

interface RangeSliderProps {
  min: number;
  max: number;
  value: number[];
  width?: string;
  onChange: (event: Event, value: number[], activeThumb: number) => void;
  name: string;
}

export default function RangeSlider({ min, max, value, onChange, name, width = "100%" }: RangeSliderProps) {
  const [rangeValue, setRangeValue] = useState<number[]>(value);

  const {theme} = useTheme();

  const sliderStyles = {
    width: '95%',
    margin: '0 auto',
    
    // Track styling
    '& .MuiSlider-track': {
      backgroundColor: theme === 'dark' ? '#fff' : '#000',
      border: `2px solid ${theme === 'dark' ? '#fff' : '#000'}`,
    },
    
    // Thumb styling
    '& .MuiSlider-thumb': {
      backgroundColor: theme === 'dark' ? '#fff' : '#000',
      border: `2px solid ${theme === 'dark' ? '#fff' : '#000'}`,
      height: '15px',
      width: '15px',
      
      '&:hover, &.Mui-focusVisible': {
        backgroundColor: theme === 'dark' ? '#fff' : '#000',
        border: `2px solid ${theme === 'dark' ? '#fff' : '#000'}`,
        boxShadow: `0 0 0 4px ${theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
      },
      
      '&.Mui-active': {
        backgroundColor: theme === 'dark' ? '#fff' : '#000',
        border: `2px solid ${theme === 'dark' ? '#fff' : '#000'}`,
        boxShadow: `0 0 0 6px ${theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
      },
    },
    
    // Rail styling
    '& .MuiSlider-rail': {
      backgroundColor: theme === 'dark' ? '#666' : '#ccc',
    },
  }

  return (
    <div style={{width}} className='flex flex-col min-w-[220px] gap-1 rounded-md relative px-3 py-2 outline-none text-black dark:text-white'>
      <div className='flex items-center justify-between gap-2.5 text-sm'>
        <p>{name}</p>
        <div className='flex items-center gap-2'>
          <p>{rangeValue[0]}</p>
          <p>-</p>
          <p>{rangeValue[1]}</p>
        </div>
      </div>
      <Slider 
        min={min} 
        max={max} 
        value={rangeValue} 
        onChange={(e, value) => {
          setRangeValue(value as number[]);
          onChange(e, value, 0);
        }}
        sx={sliderStyles}
      />
      
    </div>
  )
}
