import React, { useEffect, useState } from 'react'
import SelectComponent from 'react-select'
import { useTheme } from '@/lib/hooks/useTheme';
import { formatSelectValue } from '@/lib/helpers';

interface CustomSelectProps {
  options: any;
  required?: boolean;
  label?: string;
  maxWidth?: string;
  minWidth?: string;
  onChange: (value: any) => void;
  isMulti?: boolean;
  value?: any;
  placeholder?: string; 
  notClearable?: boolean;
  className?: string;
}

export default function Select({options, label, onChange, isMulti = false, value, placeholder, required = false, notClearable = false, maxWidth = '100%', minWidth = '240px', className = ''}: CustomSelectProps) {

  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(formatSelectValue(value));
  }, [value]);

  const handleChange = (value: any) => {
    setInputValue(value);
    onChange(value);
  }

  const {theme, BLACK, WHITE} = useTheme();
  return (
    <div className={`flex flex-col gap-1 text-sm text-black dark:text-white ${className}`}>
      {label && <p>{label}</p>}
      <SelectComponent
        isClearable={!notClearable}
        menuPlacement='auto'
        options={options}
        required={required}
        placeholder={placeholder ?? `Select ${label}`}
        onChange={handleChange}
        isMulti={isMulti}
        value={inputValue}
        styles={{
          control: (provided) => ({
            ...provided,
            backgroundColor: theme === 'dark' ? BLACK : WHITE,
            color: theme === 'dark' ? WHITE : BLACK,
            borderRadius: '6px',
            minWidth: minWidth,
            maxWidth: maxWidth,
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
          option: (provided) => ({
            ...provided,
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
