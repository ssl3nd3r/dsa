import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store/authStore';
import { serviceProviderApi } from '@/utils/api';

interface ServiceProvider {
  _id: string;
  businessName: string;
  businessDescription: string;
  phone: string;
  email: string;
  website?: string;
  serviceAreas: string[];
  services: Array<{
    category: string;
    description: string;
    priceRange: {
      min: number;
      max: number;
      currency: string;
    };
  }>;
  businessType: string;
  licenseNumber: string;
  emergencyService: boolean;
  rating: {
    average: number;
    count: number;
  };
  isVerified: boolean;
  images: Array<{
    url: string;
    caption: string;
    isPrimary: boolean;
  }>;
  user: {
    _id: string;
    name: string;
    email: string;
  };
}

export default function Services() {
  const router = useRouter();
  const { user, token, isAuthenticated } = useAuthStore();
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    area: '',
    minRating: '',
    maxPrice: '',
    emergency: false,
    verified: false
  });

  useEffect(() => {
    fetchProviders();
  }, [filters]);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const data = await serviceProviderApi.getServiceProviders({
        ...filters,
        minRating: filters.minRating ? parseFloat(filters.minRating) : undefined,
        maxPrice: filters.maxPrice ? parseFloat(filters.maxPrice) : undefined
      });
      setProviders(data.providers || []);
    } catch (error) {
      console.error('Error fetching service providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      area: '',
      minRating: '',
      maxPrice: '',
      emergency: false,
      verified: false
    });
  };

  const getServiceCategories = () => {
    const categories = new Set<string>();
    providers.forEach(provider => {
      provider.services.forEach(service => {
        categories.add(service.category);
      });
    });
    return Array.from(categories);
  };

  const getServiceAreas = () => {
    const areas = new Set<string>();
    providers.forEach(provider => {
      provider.serviceAreas.forEach(area => {
        areas.add(area);
      });
    });
    return Array.from(areas);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'text-yellow-400' : 'text-gray-300'}>
          ★
        </span>
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading services...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Home Services & Maintenance</h1>
            <div className="flex space-x-4">
              {isAuthenticated && (
                <button
                  onClick={() => router.push('/services/create')}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Post Service Ad
                </button>
              )}
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Find Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">All Categories</option>
                {getServiceCategories().map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Area</label>
              <select
                value={filters.area}
                onChange={(e) => handleFilterChange('area', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">All Areas</option>
                {getServiceAreas().map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Rating</label>
              <select
                value={filters.minRating}
                onChange={(e) => handleFilterChange('minRating', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Any Rating</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
              </select>
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

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="emergency"
                checked={filters.emergency}
                onChange={(e) => handleFilterChange('emergency', e.target.checked)}
                className="rounded"
              />
              <label htmlFor="emergency" className="text-sm font-medium text-gray-700">
                Emergency Service
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="verified"
                checked={filters.verified}
                onChange={(e) => handleFilterChange('verified', e.target.checked)}
                className="rounded"
              />
              <label htmlFor="verified" className="text-sm font-medium text-gray-700">
                Verified Only
              </label>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Service Providers Grid */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {providers.length} Service Providers Found
            </h2>
          </div>

          {providers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No service providers found matching your criteria.</p>
              <button
                onClick={clearFilters}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {providers.map((provider) => (
                <div key={provider._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{provider.businessName}</h3>
                      {provider.isVerified && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                          Verified
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-2">{provider.businessDescription}</p>
                    
                    <div className="flex items-center mb-2">
                      <div className="flex mr-2">
                        {renderStars(provider.rating.average)}
                      </div>
                      <span className="text-sm text-gray-600">
                        ({provider.rating.count} reviews)
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Services:</strong> {provider.services.map(s => s.category).join(', ')}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Areas:</strong> {provider.serviceAreas.join(', ')}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Type:</strong> {provider.businessType}
                      </p>
                    </div>

                    {provider.emergencyService && (
                      <div className="mb-4">
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                          Emergency Service Available
                        </span>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <button
                        onClick={() => router.push(`/services/${provider._id}`)}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => router.push(`/messages?recipient=${provider.user._id}`)}
                        className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
                      >
                        Contact
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 