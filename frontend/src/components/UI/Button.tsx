import React from 'react'

interface ButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function Button({ children, onClick = () => {}, type = 'button', disabled = false, className = '' }: ButtonProps) {
  return (
    <button onClick={onClick} type={type} disabled={disabled} className={`cursor-pointer bg-dsa-blue  text-white px-4 py-2 transition-colors duration-300 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black rounded-lg ${className}`}>{children}</button>
  )
}