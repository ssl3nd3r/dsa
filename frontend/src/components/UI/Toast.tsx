import React from 'react'
import toast, { Toaster } from 'react-hot-toast';

export const successToast = (message: string) => {
  toast.success(message);
}

export const errorToast = (message: string) => {
  toast.error(message);
}

export default function Toast() {
  return (
    <Toaster 
      position="bottom-right"
      toastOptions={{
        success: {
          className: 'bg-green-500 text-white',
        },
        error: {  
          className: 'bg-red-500 text-white',
        },
      }}
    />
  )
}
