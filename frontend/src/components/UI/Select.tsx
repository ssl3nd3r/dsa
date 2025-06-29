import React from 'react'
import SelectComponent from 'react-select'
import { useTheme } from '@/lib/hooks/useTheme';

interface CustomSelectProps {
  options: any;
  label: string;
  onChange: (value: any) => void;
  isMulti?: boolean;
  value?: any;
}

export default function Select({options, label, onChange, isMulti = false, value}: CustomSelectProps) {

  const {theme, BLACK, WHITE} = useTheme();
  return (
    <div className='flex flex-col gap-1 text-sm text-black dark:text-white'>
      <p>{label}</p>
      <SelectComponent
        options={options}
        placeholder={`Select ${label}`}
        onChange={onChange}
        isMulti={isMulti}
        defaultValue={value}
        styles={{
          control: (provided) => ({
            ...provided,
            backgroundColor: theme === 'dark' ? BLACK : WHITE,
            color: theme === 'dark' ? WHITE : BLACK,
            borderRadius: '10px',
            width: '220px',
            border: `1px solid ${theme === 'dark' ? WHITE : BLACK}`,
            outline: 'none !important',
            boxShadow: 'none !important',
            outlineOffset: '0px',
            '&:focus': {
              outline: 'none',
              boxShadow: 'none',
              border: `1px solid ${theme === 'dark' ? WHITE : BLACK}`,
            },
            '&:hover': {
              border: `1px solid ${theme === 'dark' ? WHITE : BLACK}`,
            },
          }),
          option: (provided, state) => ({
            ...provided,
            width: '220px',
            borderRadius: '0px',
            backgroundColor: 'transparent',
            color: theme === 'dark' ? WHITE : BLACK,
            '&:hover': {
              backgroundColor: theme === 'dark' ? WHITE : BLACK,
              color: theme === 'dark' ? BLACK : WHITE,
              cursor: 'pointer',
            },
          }),
          menu: (provided) => ({
            ...provided,
            padding: '0px',
            backgroundColor: theme === 'dark' ? BLACK : WHITE,
            borderRadius: '0px',
            border: `1px solid ${theme === 'dark' ? WHITE : BLACK}`,
          }),
          singleValue: (provided) => ({
            ...provided,
            color: theme === 'dark' ? WHITE : BLACK,
          }),
          placeholder: (provided) => ({
            ...provided,
            color: theme === 'dark' ? WHITE : BLACK,
            opacity: 0.7,
          }),
          input: (provided) => ({
            ...provided,
            color: theme === 'dark' ? WHITE : BLACK,
          }),
          multiValue: (provided) => ({
            ...provided,
            backgroundColor: theme === 'dark' ? WHITE : BLACK,
            borderRadius: '6px',
            margin: '2px',
          }),
          multiValueLabel: (provided) => ({
            ...provided,
            color: theme === 'dark' ? BLACK : WHITE,
            padding: '2px 6px',
            fontWeight: 'semibold',
          }),
          multiValueRemove: (provided) => ({
            ...provided,
            color: theme === 'dark' ? BLACK : WHITE,
            borderRadius: '6px',
            '&:hover': {
              backgroundColor: '#ff3333',
              color: WHITE,
            },
          }),
        }}
      />
    </div>
  )
}
