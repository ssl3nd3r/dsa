import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store/authStore';
import { propertyApi } from '@/utils/api';

export default function Dashboard() {
  const router = useRouter();
  const { user, token, isAuthenticated, logout } = useAuthStore();
  const [myProperties, setMyProperties] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/onboarding');
      return;
    }

    const fetchData = async () => {
      try {
        if (token) {
          const [propertiesData, matchesData] = await Promise.all([
            propertyApi.getMyProperties(token),
            propertyApi.getMatches(user?._id || '')
          ]);
          
          setMyProperties(propertiesData.properties || []);
          setMatches(matchesData.matches || []);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, token, user?._id, router]);

  const handleLogout = () => {
    logout();
    router.push('/onboarding');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/messages')}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Messages
              </button>
              <span className="text-gray-700">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Profile Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Profile Information</h2>
            <button
              onClick={() => setShowEditProfile(!showEditProfile)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              {showEditProfile ? 'Cancel Edit' : 'Edit Profile'}
            </button>
          </div>
          
          {!showEditProfile ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><strong>Name:</strong> {user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Lifestyle:</strong> {user?.lifestyle}</p>
                <p><strong>Work Schedule:</strong> {user?.workSchedule}</p>
                <p><strong>Budget:</strong> {user?.budget ? `AED ${user.budget.min} - ${user.budget.max}` : 'Not set'}</p>
                <p><strong>Preferred Areas:</strong> {user?.preferredAreas?.join(', ') || 'Not set'}</p>
              </div>
              <div>
                <p><strong>Languages:</strong> {user?.culturalPreferences?.languages?.join(', ')}</p>
                <p><strong>Personality Traits:</strong> {user?.personalityTraits?.join(', ')}</p>
                <p><strong>Dietary:</strong> {user?.culturalPreferences?.dietary || 'Not specified'}</p>
                <p><strong>Religion:</strong> {user?.culturalPreferences?.religion || 'Not specified'}</p>
                <p><strong>Amenities:</strong> {user?.amenities?.join(', ') || 'Not set'}</p>
                <p><strong>Lease Duration:</strong> {user?.leaseDuration ? `${user.leaseDuration} months` : 'Not set'}</p>
              </div>
            </div>
          ) : (
            <ProfileEditForm user={user} onClose={() => setShowEditProfile(false)} />
          )}
        </div>

        {/* My Properties Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">My Properties</h2>
            <button
              onClick={() => router.push('/property/create')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Add Property
            </button>
          </div>
          
          {myProperties.length === 0 ? (
            <p className="text-gray-500">No properties listed yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myProperties.map((property: any) => (
                <div key={property._id} className="border rounded-lg p-4">
                  <h3 className="font-semibold">{property.title}</h3>
                  <p className="text-gray-600">{property.area}</p>
                  <p className="text-lg font-bold">{property.price} {property.currency}</p>
                  <p className="text-sm text-gray-500">{property.propertyType}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Matches Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Smart Property Recommendations</h2>
          
          {matches.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No recommendations found. Try updating your preferences.</p>
              <button
                onClick={() => setShowEditProfile(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Update Preferences
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map((match: any) => (
                <div key={match._id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg">{match.title}</h3>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                      {match.matchingScore}% match
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-gray-600 flex items-center">
                      <span className="font-medium">📍</span> {match.area}
                    </p>
                    <p className="text-xl font-bold text-blue-600">
                      {match.price} {match.currency}
                      <span className="text-sm font-normal text-gray-500">/{match.billingCycle}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      {match.propertyType} • {match.bedrooms} bed{match.bedrooms !== 1 ? 's' : ''} • {match.bathrooms} bath{match.bathrooms !== 1 ? 's' : ''}
                    </p>
                  </div>

                  {/* Match Reasons */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Why this matches you:</p>
                    <div className="space-y-1">
                      {match.matchingScore >= 80 && (
                        <p className="text-xs text-green-600">✓ Perfect budget match</p>
                      )}
                      {match.amenities?.length > 0 && (
                        <p className="text-xs text-green-600">✓ Has your preferred amenities</p>
                      )}
                      {match.area && user?.preferredAreas?.includes(match.area) && (
                        <p className="text-xs text-green-600">✓ In your preferred area</p>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => router.push(`/property/${match._id}`)}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => {/* Contact owner */}}
                      className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors"
                    >
                      Contact
                    </button>
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

// Profile Edit Form Component
function ProfileEditForm({ user, onClose }: { user: any, onClose: () => void }) {
  const [form, setForm] = useState({
    name: user?.name || '',
    lifestyle: user?.lifestyle || '',
    personalityTraits: user?.personalityTraits || [],
    workSchedule: user?.workSchedule || '',
    culturalPreferences: {
      languages: user?.culturalPreferences?.languages || [],
      dietary: user?.culturalPreferences?.dietary || '',
      religion: user?.culturalPreferences?.religion || ''
    },
    budget: { min: user?.budget?.min || '', max: user?.budget?.max || '' },
    preferredAreas: user?.preferredAreas || [],
    amenities: user?.amenities || [],
    moveInDate: user?.moveInDate || '',
    leaseDuration: user?.leaseDuration || '',
    billingCycle: user?.billingCycle || ''
  });

  const personalityOptions = ['Introvert', 'Extrovert', 'Organized', 'Flexible', 'Social', 'Quiet', 'Adventurous', 'Calm'];
  const lifestyleOptions = ['Quiet', 'Active', 'Smoker', 'Non-smoker', 'Pet-friendly', 'No pets'];
  const workScheduleOptions = ['9-5', 'Night shift', 'Remote', 'Flexible', 'Student'];
  const languageOptions = ['English', 'Arabic', 'Hindi', 'Urdu', 'Tagalog', 'Other'];
  const areaOptions = [
    'Dubai Marina', 'Downtown Dubai', 'Palm Jumeirah', 'JBR', 'Business Bay',
    'Dubai Hills Estate', 'Arabian Ranches', 'Emirates Hills', 'Meadows',
    'Springs', 'Lakes', 'JLT', 'DIFC', 'Sheikh Zayed Road', 'Al Barsha',
    'Jumeirah', 'Umm Suqeim', 'Al Sufouh', 'Al Quoz', 'Al Khail', 'Other'
  ];
  const amenitiesOptions = [
    'WiFi', 'AC', 'Heating', 'Kitchen', 'Washing Machine', 'Dryer',
    'Parking', 'Gym', 'Pool', 'Garden', 'Balcony', 'Terrace',
    'Security', 'Concierge', 'Cleaning Service', 'Furnished',
    'Pet Friendly', 'Smoking Allowed', 'Wheelchair Accessible'
  ];
  const billingCycleOptions = ['Monthly', 'Quarterly', 'Yearly'];

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleBudgetChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      budget: { ...prev.budget, [name]: value }
    }));
  };

  const handlePersonality = (trait: string) => {
    setForm((prev) => ({
      ...prev,
      personalityTraits: prev.personalityTraits.includes(trait)
        ? prev.personalityTraits.filter((t) => t !== trait)
        : [...prev.personalityTraits, trait]
    }));
  };

  const handleLanguage = (lang: string) => {
    setForm((prev) => ({
      ...prev,
      culturalPreferences: {
        ...prev.culturalPreferences,
        languages: prev.culturalPreferences.languages.includes(lang)
          ? prev.culturalPreferences.languages.filter((l) => l !== lang)
          : [...prev.culturalPreferences.languages, lang]
      }
    }));
  };

  const handleArea = (area: string) => {
    setForm((prev) => ({
      ...prev,
      preferredAreas: prev.preferredAreas.includes(area)
        ? prev.preferredAreas.filter((a) => a !== area)
        : [...prev.preferredAreas, area]
    }));
  };

  const handleAmenity = (amenity: string) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // TODO: Implement profile update API call
    console.log('Updating profile:', form);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-semibold">Name</label>
          <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Lifestyle</label>
          <select name="lifestyle" value={form.lifestyle} onChange={handleChange} className="w-full border rounded px-3 py-2">
            <option value="">Select...</option>
            {lifestyleOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block mb-1 font-semibold">Personality Traits</label>
        <div className="flex flex-wrap gap-2">
          {personalityOptions.map(trait => (
            <button type="button" key={trait} onClick={() => handlePersonality(trait)}
              className={`px-3 py-1 rounded-full border ${form.personalityTraits.includes(trait) ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
              {trait}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-semibold">Work Schedule</label>
          <select name="workSchedule" value={form.workSchedule} onChange={handleChange} className="w-full border rounded px-3 py-2">
            <option value="">Select...</option>
            {workScheduleOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-semibold">Languages</label>
          <div className="flex flex-wrap gap-2">
            {languageOptions.map(lang => (
              <button type="button" key={lang} onClick={() => handleLanguage(lang)}
                className={`px-3 py-1 rounded-full border ${form.culturalPreferences.languages.includes(lang) ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
                {lang}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-semibold">Budget (AED)</label>
          <div className="flex gap-2">
            <input name="min" type="number" value={form.budget.min} onChange={handleBudgetChange} placeholder="Min" className="w-1/2 border rounded px-3 py-2" />
            <input name="max" type="number" value={form.budget.max} onChange={handleBudgetChange} placeholder="Max" className="w-1/2 border rounded px-3 py-2" />
          </div>
        </div>
        <div>
          <label className="block mb-1 font-semibold">Preferred Locations</label>
          <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
            {areaOptions.map(area => (
              <button type="button" key={area} onClick={() => handleArea(area)}
                className={`px-3 py-1 rounded-full border text-xs ${form.preferredAreas.includes(area) ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
                {area}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="block mb-1 font-semibold">Amenities</label>
        <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
          {amenitiesOptions.map(amenity => (
            <button type="button" key={amenity} onClick={() => handleAmenity(amenity)}
              className={`px-3 py-1 rounded-full border text-xs ${form.amenities.includes(amenity) ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
              {amenity}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block mb-1 font-semibold">Move-in Date</label>
          <input name="moveInDate" type="date" value={form.moveInDate} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Lease Duration (months)</label>
          <input name="leaseDuration" type="number" value={form.leaseDuration} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Billing Cycle</label>
          <select name="billingCycle" value={form.billingCycle} onChange={handleChange} className="w-full border rounded px-3 py-2">
            <option value="">Select...</option>
            {billingCycleOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
          Cancel
        </button>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Save Changes
        </button>
      </div>
    </form>
  );
} 