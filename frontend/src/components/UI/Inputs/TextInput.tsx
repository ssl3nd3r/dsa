import React from 'react'

interface TextInputProps {
  label: string;
  name: string;
  type: string;
  autoComplete: string;
  required?: boolean;
  hidden?: boolean;
  min?: number;
  max?: number;
  disabled?: boolean;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder: string;
  className?: string;
  inputClassName?: string;
  showLabel?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  }

export default function TextInput({ label, name, type, autoComplete, required = false, hidden = false, min = 0, max = 999999999999999999, disabled = false, value, onChange, onBlur, placeholder, className = '', inputClassName = '', showLabel = false, onKeyDown }: TextInputProps) {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (type === 'number') {
      const numValue = parseFloat(e.target.value);
      if (isNaN(numValue)) {
        // Create a new event with value set to 0
        const newEvent = {
            ...e,
            target: {
              ...e.target,
              value: '0'
            }
          };
          onChange(newEvent as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>);
      }
    }
    
    if (onBlur) {
      onBlur(e);
    }
  };


  if (type === 'textarea') {
    return (
      <div className={`${className}`}>
        <label htmlFor={name} className={`${showLabel ? 'block' : 'sr-only'}`}>
          {label}
        </label>
        <textarea
          id={name}
          name={name}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          hidden={hidden}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          className="appearance-none rounded-md relative block w-full px-3 py-2 outline-none border dark:border-white border-black dark:bg-black bg-white dark:placeholder-gray-200 placeholder-gray-800 text-black dark:text-white focus:outline-none text-sm disabled:opacity-50 disabled:cursor-not-allowed resize-none h-24"
          placeholder={placeholder}
        />
      </div>
    )
  }

  return (
    <div className={`${className} flex flex-col gap-1`}>
      <label htmlFor={name} className={`${showLabel ? 'block text-sm  ' : 'sr-only'}`}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        disabled={disabled}
        hidden={hidden}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        className={`appearance-none rounded-md relative block w-full px-3 py-2 outline-none border dark:border-white border-black dark:bg-black bg-white dark:placeholder-gray-200 placeholder-gray-800 text-black dark:text-white focus:outline-none text-sm disabled:opacity-50 disabled:cursor-not-allowed ${inputClassName}`}
        placeholder={placeholder}
        min={min}
        max={max}
        onKeyDown={onKeyDown}
      />
    </div>
  )
}
