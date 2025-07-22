'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useTransition } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/lib/store'
import { setLoading } from '@/lib/slices/uiSlice'

interface Props {
  href: string
  children?: React.ReactNode
  className?: string
  onClick?: () => void
}

export function RouteLink({ href, children, className = "", onClick }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(setLoading(isPending))
  }, [isPending, dispatch])

  return (
      <Link
        href={href}
        onClick={(e) => {
          e.preventDefault()
          if (onClick) onClick();
          startTransition(() => {
            router.push(href)
          })
        }}
        className={`${className}`}
      >
        {children}
      </Link>
  )
}
