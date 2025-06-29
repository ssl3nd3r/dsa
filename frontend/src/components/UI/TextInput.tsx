import React from 'react'

interface TextInputProps {
  label: string;
  name: string;
  type: string;
  autoComplete: string;
  required?: boolean;
  hidden?: boolean;
  disabled?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

export default function TextInput({ label, name, type, autoComplete, required = false, hidden = false, disabled = false, value, onChange, placeholder }: TextInputProps) {
  return (
    <div>
      <label htmlFor={name} className="sr-only">
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
        onChange={onChange}
        className="appearance-none rounded-md relative block w-full px-3 py-2 outline-none border dark:border-white border-black dark:bg-black bg-white dark:placeholder-gray-200 placeholder-gray-800 text-black dark:text-white focus:outline-none text-sm"
        placeholder={placeholder}
      />
    </div>
  )
}
