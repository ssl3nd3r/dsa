import { RouteLink } from '@/components/UI/RouteLink'
import React from 'react'

interface PropertyTypeCardProps {
  label: string;
  type: string;
  propertyOrRoomType?: 'property' | 'room';
}

export default function PropertyTypeCard({ label, type, propertyOrRoomType = 'property' }: PropertyTypeCardProps) {
  return (
    <RouteLink href={`/properties?${propertyOrRoomType === 'property' ? 'property_type' : 'room_type'}=${type}`} className='group p-8 min-h-[100px] md:p-12 dark:bg-black bg-white dark:text-white text-black rounded-md text-center border dark:border-white border-black dark:hover:shadow-gray-700 hover:shadow-md !transition-all duration-300 relative'>
        <span className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:text-base text-sm group-hover:scale-105 blue-400 !transition-all duration-300 block'>{label}</span>
    </RouteLink>
  )
}
