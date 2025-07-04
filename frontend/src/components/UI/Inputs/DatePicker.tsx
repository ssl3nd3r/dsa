import React from 'react'

interface DatePickerProps {
  onChange: (date: string) => void;
  value?: string;
  name: string;
  label?: string;
  placeholder?: string;
  min?: string;
}

export default function DatePicker({ onChange, value, label, name, placeholder, min }: DatePickerProps) {
  return (
    <div className='flex flex-col gap-1'>
      {label && <span className='block text-sm'>{label}</span>}
      <input
        type="date"
        name={name}
        min={min}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className='w-full px-3 py-2 rounded-md outline-none border dark:border-white border-black dark:bg-black bg-white dark:text-gray-200 text-gray-800 focus:outline-none text-sm disabled:opacity-50 disabled:cursor-not-allowed'
      />
    </div>
  )
}
