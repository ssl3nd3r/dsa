import React from 'react'

interface SendIconProps {
  size?: number;
}

export default function SendIcon({size = 24}: SendIconProps) {
  return (
    <svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 90" width={size} height={size}>
      <path fill='currentColor' d="m0.1 8.1c-0.9-5.8 5.3-10.1 10.4-7.2l66 38c4.7 2.7 4.7 9.5 0 12.2l-66 38c-5.1 2.9-11.3-1.4-10.4-7.2l5.1-33.4h32.3c1.9-0.1 3.5-1.6 3.5-3.5 0-1.9-1.6-3.5-3.5-3.5h-32.3z"/>
    </svg>
  )
}
