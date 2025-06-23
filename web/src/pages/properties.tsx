import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { propertyApi } from '@/utils/api';

export default function Properties() {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    area: '',
    minPrice: '',
    maxPrice: '',
    propertyType: '',
    roomType: '',
    bedrooms: ''
  });

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const data = await propertyApi.getAll(filters);
      setProperties(data.properties || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      area: '',
      minPrice: '',
      maxPrice: '',
      propertyType: '',
      roomType: '',
      bedrooms: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Find Your Perfect Accommodation</h1>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Dashboard
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
              <select
                value={filters.area}
                onChange={(e) => handleFilterChange('area', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">All Areas</option>
                <option value="Dubai Marina">Dubai Marina</option>
                <option value="Downtown Dubai">Downtown Dubai</option>
                <option value="Palm Jumeirah">Palm Jumeirah</option>
                <option value="JBR">JBR</option>
                <option value="Business Bay">Business Bay</option>
                <option value="JLT">JLT</option>
                <option value="DIFC">DIFC</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                placeholder="Min AED"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                placeholder="Max AED"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
              <select
                value={filters.propertyType}
                onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">All Types</option>
                <option value="Studio">Studio</option>
                <option value="1BR">1BR</option>
                <option value="2BR">2BR</option>
                <option value="3BR">3BR</option>
                <option value="4BR+">4BR+</option>
                <option value="Shared Room">Shared Room</option>
                <option value="Private Room">Private Room</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
              <select
                value={filters.roomType}
                onChange={(e) => handleFilterChange('roomType', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">All</option>
                <option value="Entire Place">Entire Place</option>
                <option value="Private Room">Private Room</option>
                <option value="Shared Room">Shared Room</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
              <select
                value={filters.bedrooms}
                onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Any</option>
                <option value="0">Studio</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4+</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mr-2"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-xl">Loading properties...</div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {properties.length} Properties Found
              </h2>
            </div>

            {properties.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No properties found matching your criteria.</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property: any) => (
                  <div key={property._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{property.title}</h3>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                          {property.propertyType}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-2">{property.area}</p>
                      <p className="text-2xl font-bold text-gray-900 mb-2">
                        {property.price} {property.currency}
                        <span className="text-sm font-normal text-gray-500">/{property.billingCycle}</span>
                      </p>
                      
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <span className="mr-4">{property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}</span>
                        <span className="mr-4">{property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}</span>
                        <span>{property.size} sq ft</span>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {property.amenities?.slice(0, 3).map((amenity: string) => (
                          <span key={amenity} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            {amenity}
                          </span>
                        ))}
                        {property.amenities?.length > 3 && (
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            +{property.amenities.length - 3} more
                          </span>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => router.push(`/property/${property._id}`)}
                          className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => router.push(`/messages?recipient=${property.owner?._id || ''}`)}
                          className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
                        >
                          Contact Owner
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 