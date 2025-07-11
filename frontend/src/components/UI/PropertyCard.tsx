import { Property } from '@/lib/slices/propertySlice'
import ArrowEnter from './Assets/ArrowEnter'
import { RouteLink } from '@/components/UI/RouteLink'
import React from 'react'

interface PropertyCardProps {
  property: Property;
  showDescription?: boolean;
  showAvailability?: boolean;
}

export default function PropertyCard({property, showDescription = true, showAvailability = false}: PropertyCardProps) {
  return (
    <div className="bg-white flex flex-col gap-4 dark:bg-black rounded-lg dark:shadow-gray-700 hover:shadow-sm transition-shadow" key={property.id || property.slug}>
      <div className='relative'>
        <img src={property.images[0]} alt={property.title} className="w-full rounded-t-lg aspect-[16/10] object-cover" />
        {showAvailability && (
          <span className={`px-3 py-1 rounded-full text-[10px] absolute top-2 right-2 ${property.is_available ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 shadow-sm dark:text-yellow-100 whitespace-nowrap'}`}>
            {property.is_available ? 'Active' : 'Pending Approval'}
          </span>
        )}
        <span className='absolute bottom-2 left-2 text-xs px-3 py-1 bg-blue-800 text-blue-100 rounded-full'>Published {new Date(property.created_at ?? '').toLocaleDateString('en-GB')}</span>
      </div>
      <div className="px-4 pt-4 flex flex-col justify-between">
        <div className='flex items-center justify-between w-full gap-2'>
          <h2 className="text-xl font-semibold text-black dark:text-white mb-2">{property.title}</h2>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-2xl font-bold text-black dark:text-white">
            {property.price.toLocaleString()} {property.currency}
          </div>
          <div className="text-sm text-black dark:text-white">
            {property.billing_cycle}
          </div>
        </div>
      </div>

      {showDescription && <p className="px-4 text-sm text-black dark:text-white">{property.description}</p>}

      
      <div className="px-4 flex flex-wrap gap-4">
        <div className="text-center flex items-center gap-2">
          <div className="text-sm font-semibold text-black dark:text-white">{property.bedrooms}</div>
          <div className="text-sm text-black dark:text-white">Bedrooms</div>
        </div>
        <div className="text-center flex items-center gap-2">
          <div className="text-sm font-semibold text-black dark:text-white">{property.bathrooms}</div>
          <div className="text-sm text-black dark:text-white">Bathrooms</div>
        </div>
        <div className="text-center flex items-center gap-2">
          <div className="text-sm font-semibold text-black dark:text-white">{property.size} ft<sup>2</sup></div>
          <div className="text-sm text-black dark:text-white">Size</div>
        </div>
        <div className="text-center flex items-center gap-2">
          <div className="text-sm font-semibold text-black dark:text-white">{property.location}</div>
        </div>
      </div>
      
      <div className="px-4 flex flex-wrap gap-2">
        <span className="px-3 py-1 dark:bg-blue-800 bg-blue-100 dark:text-blue-100 text-blue-800 rounded-full text-sm">
          {property.property_type}
        </span>
        <span className="px-3 py-1 dark:bg-green-800 bg-green-100 dark:text-green-100 text-green-800 rounded-full text-sm">
          {property.room_type}
        </span>
        {property.utilities_included && (
          <span className="px-3 py-1 dark:bg-purple-800 bg-purple-100 dark:text-purple-100 text-purple-800 rounded-full text-sm">
            Utilities Included
          </span>
        )}
      </div>
      
      {property.amenities && property.amenities.length > 0 && (
        <div className="px-4">
          <h4 className="text-sm font-medium text-black dark:text-white mb-2">Amenities:</h4>
          <div className="flex flex-wrap gap-1">
            {property.amenities.slice(0, 5).map((amenity, index) => (
              <span key={index} className="px-2 py-1 dark:bg-gray-800 bg-gray-100 dark:text-gray-100 text-gray-700 rounded text-xs">
                {amenity}
              </span>
            ))}
            {property.amenities.length > 5 && (
              <span className="px-2 py-1 dark:bg-gray-800 bg-gray-100 dark:text-gray-100 text-gray-700 rounded text-xs">
                +{property.amenities.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}
      
      <div className="px-4 pb-4 mt-auto flex justify-between items-center text-sm text-black dark:text-white">
        <div>
          Available from: {property.available_from ? new Date(property.available_from).toLocaleDateString() : 'N/A'}
        </div>
        {property.is_available && (
          <RouteLink href={`/properties/${property.slug}`} className="flex items-center p-2.5 border border-black dark:border-white rounded-full gap-2">
            <ArrowEnter />
          </RouteLink>
        )}
      </div>
    </div>
  )
}
