import React from 'react'

interface AIChatBotProps {
  size?: number;
}

export default function AIChatBot({ size = 24 }: AIChatBotProps) {
  return (
    <svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 89" width={size} height={size}>
      <g>
        <path fill="currentColor" d="m63.1 9.1h-10.8v-8.7h-8.6v8.6h-10.8c-17.9 0.1-32.4 14.2-32.4 31.7 0 17.4 14.5 31.6 32.4 31.6h2.1v-8.6h-2.2c-13.1 0-23.8-10.3-23.8-22.9 0-12.7 10.7-22.9 23.8-22.9h30.2c13.1 0 23.8 10.3 23.8 22.9 0 12.7-10.7 22.9-23.8 22.9h-12.3l-15.7 13.6v11.5l18.9-16.5h9.2c17.9 0 32.4-14.2 32.4-31.6 0-17.5-14.5-31.6-32.4-31.6z"/>
        <path fill="currentColor" d="m32.9 48c-3.6 0-6.5-2.9-6.5-6.5 0-3.6 2.9-6.5 6.5-6.5 3.6 0 6.5 2.9 6.5 6.5 0 3.6-2.9 6.5-6.5 6.5z"/>
        <path fill="currentColor" d="m63.1 48c-3.6 0-6.5-2.9-6.5-6.5 0-3.6 2.9-6.5 6.5-6.5 3.6 0 6.5 2.9 6.5 6.5 0 3.6-2.9 6.5-6.5 6.5z"/>
      </g>
    </svg>
  )
}
