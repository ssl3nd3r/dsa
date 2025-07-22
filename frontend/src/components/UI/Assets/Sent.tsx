import React from 'react'

interface SentProps {
  size?: number;
  isRead?: boolean;
}

export default function Sent({ size = 5, isRead = false }: SentProps) {
  return (
    <svg className={`translate-y-0.5 ${isRead ? 'translate-x-2.5' : ''}`} version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 86 68" width={size} height={size}>
      <path fill="currentColor" d="m85.4 8c-0.1-2.1-1.1-4-2.6-5.4-1.5-1.4-3.5-2.1-5.6-1.9-2.1 0.1-4 1.1-5.3 2.6l-40 45-18.3-16.6c-1.5-1.4-3.5-2.1-5.6-2-2.1 0.1-4 1-5.3 2.5-1.4 1.5-2.1 3.5-2 5.6 0.1 2.1 1 4 2.5 5.3l24.1 21.9c1.4 1.3 3.3 2 5.2 2h0.5c2-0.1 3.9-1 5.4-2.6l45.2-50.9c1.2-1.5 1.9-3.5 1.8-5.5z"/>
    </svg>
  )
}
