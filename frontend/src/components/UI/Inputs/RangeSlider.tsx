import React, { useEffect, useState } from 'react'
import TextInput from './TextInput';

interface RangeSliderProps {
  min?: number;
  max: number;
  value: number[];
  width?: string;
  onChange: (event: Event, value: number[], activeThumb: number) => void;
  name: string;
}

export default function RangeSlider({ max, value, onChange, name, width = "100%" }: RangeSliderProps) {
  const [rangeValue, setRangeValue] = useState<number[]>(value);

  useEffect(() => {
    console.log(rangeValue);
    onChange(new Event('change'), rangeValue, 0);
  }, [rangeValue]);
  
  // const {theme} = useTheme();

  // const sliderStyles = {
  //   width: '95%',
  //   margin: '0 auto',
    
  //   // Track styling
  //   '& .MuiSlider-track': {
  //     backgroundColor: theme === 'dark' ? '#fff' : '#000',
  //     border: `2px solid ${theme === 'dark' ? '#fff' : '#000'}`,
  //   },
    
  //   // Thumb styling
  //   '& .MuiSlider-thumb': {
  //     backgroundColor: theme === 'dark' ? '#fff' : '#000',
  //     border: `2px solid ${theme === 'dark' ? '#fff' : '#000'}`,
  //     height: '15px',
  //     width: '15px',
      
  //     '&:hover, &.Mui-focusVisible': {
  //       backgroundColor: theme === 'dark' ? '#fff' : '#000',
  //       border: `2px solid ${theme === 'dark' ? '#fff' : '#000'}`,
  //       boxShadow: `0 0 0 4px ${theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
  //     },
      
  //     '&.Mui-active': {
  //       backgroundColor: theme === 'dark' ? '#fff' : '#000',
  //       border: `2px solid ${theme === 'dark' ? '#fff' : '#000'}`,
  //       boxShadow: `0 0 0 6px ${theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
  //     },
  //   },
    
  //   // Rail styling
  //   '& .MuiSlider-rail': {
  //     backgroundColor: theme === 'dark' ? '#666' : '#ccc',
  //   },
  // }

  return (
    <div style={{width}} className='flex flex-col gap-1 rounded-md relative py-2 outline-none text-black dark:text-white'>
      <div className='flex items-center justify-between gap-2.5 text-sm'>
        <p>{name}</p>
      </div>
      <div className='flex items-center gap-2'>
        <TextInput     
          label={name}
          className='flex-1'
          name={name}
          autoComplete={name}
          placeholder={`Min ${name}`}
          type='number'
          min={0}
          max={rangeValue[1]}
          value={rangeValue[0]}
          onChange={(e) => {
            setRangeValue([parseInt(e.target.value), rangeValue[1]]);
          }}
        />
        <TextInput
          label={name}
          className='flex-1'
          name={name}
          autoComplete={name}
          placeholder={`Max ${name}`}
          type='number'
          min={rangeValue[0]}
          max={max}
          value={rangeValue[1]}
          onChange={(e) => {
            setRangeValue([rangeValue[0], parseInt(e.target.value)]);
          }}
          onBlur={(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const maxValue = parseInt(e.target.value);
            if (maxValue < rangeValue[0]) {
              setRangeValue([rangeValue[0], rangeValue[0]]);
            }
          }}
        />
      </div>
    </div>
  )
}
