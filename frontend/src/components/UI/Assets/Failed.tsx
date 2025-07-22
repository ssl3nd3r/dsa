import React from 'react'

interface FailedProps {
  size?: number;
}

export default function Failed({ size = 5 }: FailedProps) {
  return (
    <svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width={size} height={size}>
      <path fill="red" d="m30 48c-1.1 0-2-0.9-2-2 0-1.1 0.9-2 2-2 1.1 0 2 0.9 2 2 0 1.1-0.9 2-2 2z"/>
      <path fill="red" d="m32 13c0-1.1-0.9-2-2-2-1.1 0-2 0.9-2 2v25c0 1.1 0.9 2 2 2 1.1 0 2-0.9 2-2z"/>
      <path fill="red" d="m30 0c16.6 0 30 13.4 30 30 0 16.6-13.4 30-30 30-16.6 0-30-13.4-30-30 0-16.6 13.4-30 30-30zm26 30c0-14.4-11.6-26-26-26-14.4 0-26 11.6-26 26 0 14.4 11.6 26 26 26 14.4 0 26-11.6 26-26z"/>
    </svg>
  )
}
