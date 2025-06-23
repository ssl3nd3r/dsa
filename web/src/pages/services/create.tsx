import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store/authStore';
import { serviceProviderApi } from '@/utils/api';

export default function CreateServiceProvider() {
  const router = useRouter();
  const { user, token, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    businessDescription: '',
    phone: '',
    email: '',
    website: '',
    serviceAreas: [''],
    businessType: 'Individual',
    licenseNumber: '',
    emergencyService: false,
    services: [{
      category: 'Plumbing',
      description: '',
      priceRange: { min: 0, max: 0, currency: 'AED' }
    }]
  });

  const serviceCategories = [
    'Plumbing', 'Electrical', 'HVAC', 'Cleaning', 'Pest Control',
    'Carpentry', 'Painting', 'Landscaping', 'Security', 'Appliance Repair',
    'Moving Services', 'Interior Design', 'Other'
  ];

  const businessTypes = ['Individual', 'Company', 'Freelancer'];

  const dubaiAreas = [
    'Dubai Marina', 'Downtown Dubai', 'Palm Jumeirah', 'JBR', 'Business Bay',
    'JLT', 'DIFC', 'Sheikh Zayed Road', 'Al Barsha', 'Dubai Hills Estate',
    'Dubai Silicon Oasis', 'Dubai Sports City', 'Dubai Production City',
    'Dubai Media City', 'Dubai Internet City', 'Dubai Knowledge Park'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleServiceAreaChange = (index: number, value: string) => {
    const newServiceAreas = [...formData.serviceAreas];
    newServiceAreas[index] = value;
    setFormData(prev => ({ ...prev, serviceAreas: newServiceAreas }));
  };

  const addServiceArea = () => {
    setFormData(prev => ({
      ...prev,
      serviceAreas: [...prev.serviceAreas, '']
    }));
  };

  const removeServiceArea = (index: number) => {
    if (formData.serviceAreas.length > 1) {
      const newServiceAreas = formData.serviceAreas.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, serviceAreas: newServiceAreas }));
    }
  };

  const handleServiceChange = (index: number, field: string, value: any) => {
    const newServices = [...formData.services];
    if (field === 'priceRange') {
      newServices[index] = { ...newServices[index], priceRange: { ...newServices[index].priceRange, ...value } };
    } else {
      newServices[index] = { ...newServices[index], [field]: value };
    }
    setFormData(prev => ({ ...prev, services: newServices }));
  };

  const addService = () => {
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, {
        category: 'Plumbing',
        description: '',
        priceRange: { min: 0, max: 0, currency: 'AED' }
      }]
    }));
  };

  const removeService = (index: number) => {
    if (formData.services.length > 1) {
      const newServices = formData.services.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, services: newServices }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !token) {
      router.push('/onboarding');
      return;
    }

    try {
      setLoading(true);
      
      // Filter out empty service areas
      const filteredServiceAreas = formData.serviceAreas.filter(area => area.trim() !== '');
      
      const submitData = {
        ...formData,
        serviceAreas: filteredServiceAreas,
        email: formData.email || user?.email
      };

      await serviceProviderApi.createServiceProvider(token, submitData);
      
      router.push('/services');
    } catch (error) {
      console.error('Error creating service provider:', error);
      alert('Error creating service provider profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    router.push('/onboarding');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Post Service Advertisement</h1>
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
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Your business name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Type *
                  </label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    {businessTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Description *
                  </label>
                  <textarea
                    name="businessDescription"
                    value={formData.businessDescription}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Describe your business and services"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="+971 50 123 4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="business@example.com"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty to use your account email: {user?.email}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website (Optional)
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="https://www.yourwebsite.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    License Number *
                  </label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Your business license number"
                  />
                </div>
              </div>
            </div>

            {/* Service Areas */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Service Areas</h2>
              {formData.serviceAreas.map((area, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <select
                    value={area}
                    onChange={(e) => handleServiceAreaChange(index, e.target.value)}
                    required
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">Select service area</option>
                    {dubaiAreas.map(dubaiArea => (
                      <option key={dubaiArea} value={dubaiArea}>{dubaiArea}</option>
                    ))}
                  </select>
                  {formData.serviceAreas.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeServiceArea(index)}
                      className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addServiceArea}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Add Service Area
              </button>
            </div>

            {/* Services */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Services Offered</h2>
              {formData.services.map((service, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Service Category *
                      </label>
                      <select
                        value={service.category}
                        onChange={(e) => handleServiceChange(index, 'category', e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      >
                        {serviceCategories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Service Description
                      </label>
                      <input
                        type="text"
                        value={service.description}
                        onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="Brief description of this service"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Minimum Price (AED) *
                      </label>
                      <input
                        type="number"
                        value={service.priceRange.min}
                        onChange={(e) => handleServiceChange(index, 'priceRange', { min: parseFloat(e.target.value) || 0 })}
                        required
                        min="0"
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Maximum Price (AED) *
                      </label>
                      <input
                        type="number"
                        value={service.priceRange.max}
                        onChange={(e) => handleServiceChange(index, 'priceRange', { max: parseFloat(e.target.value) || 0 })}
                        required
                        min="0"
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                  </div>

                  {formData.services.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeService(index)}
                      className="mt-2 bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                    >
                      Remove Service
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addService}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Add Service
              </button>
            </div>

            {/* Additional Options */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Additional Options</h2>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="emergencyService"
                  name="emergencyService"
                  checked={formData.emergencyService}
                  onChange={handleInputChange}
                  className="rounded"
                />
                <label htmlFor="emergencyService" className="text-sm font-medium text-gray-700">
                  Provide Emergency Services (24/7 availability)
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push('/services')}
                className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Service Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 