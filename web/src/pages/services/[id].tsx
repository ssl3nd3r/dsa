import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { serviceProviderApi } from '@/utils/api';

export default function ServiceProviderDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [provider, setProvider] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchProvider();
    // eslint-disable-next-line
  }, [id]);

  const fetchProvider = async () => {
    try {
      setLoading(true);
      const data = await serviceProviderApi.getServiceProvider(id as string);
      setProvider(data.provider);
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Error fetching provider:', error);
    } finally {
      setLoading(false);
    }
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
        <div className="text-xl">Loading service provider...</div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Service provider not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">{provider.businessName}</h1>
            <button
              onClick={() => router.push('/services')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Back to Services
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">{provider.businessName}</h2>
              <p className="text-gray-600 mb-2">{provider.businessDescription}</p>
              <div className="flex items-center mb-2">
                <div className="flex mr-2">{renderStars(provider.rating.average)}</div>
                <span className="text-sm text-gray-600">({provider.rating.count} reviews)</span>
              </div>
              <div className="mb-2">
                <span className="text-sm text-gray-600 font-medium">Type:</span> {provider.businessType}
              </div>
              <div className="mb-2">
                <span className="text-sm text-gray-600 font-medium">License:</span> {provider.licenseNumber}
              </div>
              <div className="mb-2">
                <span className="text-sm text-gray-600 font-medium">Areas:</span> {provider.serviceAreas.join(', ')}
              </div>
              <div className="mb-2">
                <span className="text-sm text-gray-600 font-medium">Contact:</span> {provider.phone} | {provider.email}
              </div>
              {provider.website && (
                <div className="mb-2">
                  <span className="text-sm text-gray-600 font-medium">Website:</span> <a href={provider.website} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{provider.website}</a>
                </div>
              )}
              {provider.emergencyService && (
                <div className="mb-2">
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">Emergency Service Available</span>
                </div>
              )}
              {provider.isVerified && (
                <div className="mb-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">Verified</span>
                </div>
              )}
            </div>
            <div className="mt-4 md:mt-0 md:ml-8 flex flex-col items-end">
              <button
                onClick={() => router.push(`/messages?recipient=${provider.user._id}`)}
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 mb-2"
              >
                Contact Provider
              </button>
            </div>
          </div>

          {/* Services Offered */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Services Offered</h3>
            <ul className="list-disc pl-6">
              {provider.services.map((service: any, idx: number) => (
                <li key={idx} className="mb-1">
                  <span className="font-medium">{service.category}</span>: {service.description} <span className="text-gray-500">(AED {service.priceRange.min} - {service.priceRange.max})</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Reviews */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Recent Reviews</h3>
            {reviews.length === 0 ? (
              <div className="text-gray-500">No reviews yet.</div>
            ) : (
              <ul className="space-y-4">
                {reviews.map((review, idx) => (
                  <li key={idx} className="border-b pb-2">
                    <div className="flex items-center mb-1">
                      <div className="flex mr-2">{renderStars(review.rating)}</div>
                      <span className="font-medium text-gray-800 mr-2">{review.reviewer?.name || 'User'}</span>
                      <span className="text-xs text-gray-400">{new Date(review.serviceDate).toLocaleDateString()}</span>
                    </div>
                    <div className="font-semibold">{review.title}</div>
                    <div className="text-gray-700">{review.content}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 