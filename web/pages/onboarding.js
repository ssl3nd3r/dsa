import { useState } from 'react';
import axios from 'axios';

const personalityOptions = [
  'Introvert', 'Extrovert', 'Organized', 'Flexible', 'Social', 'Quiet', 'Adventurous', 'Calm'
];
const lifestyleOptions = [
  'Quiet', 'Active', 'Smoker', 'Non-smoker', 'Pet-friendly', 'No pets'
];
const workScheduleOptions = [
  '9-5', 'Night shift', 'Remote', 'Flexible', 'Student'
];
const languageOptions = [
  'English', 'Arabic', 'Hindi', 'Urdu', 'Tagalog', 'Other'
];
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

export default function Onboarding() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    lifestyle: '',
    personalityTraits: [],
    workSchedule: '',
    culturalPreferences: {
      languages: [],
      dietary: '',
      religion: ''
    },
    budget: { min: '', max: '' },
    preferredAreas: [],
    amenities: [],
    moveInDate: '',
    leaseDuration: '',
    billingCycle: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handlePersonality = (trait) => {
    setForm((prev) => ({
      ...prev,
      personalityTraits: prev.personalityTraits.includes(trait)
        ? prev.personalityTraits.filter((t) => t !== trait)
        : [...prev.personalityTraits, trait]
    }));
  };

  const handleLanguage = (lang) => {
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

  const handleCulturalChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      culturalPreferences: {
        ...prev.culturalPreferences,
        [name]: value
      }
    }));
  };

  const handleBudgetChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      budget: { ...prev.budget, [name]: value }
    }));
  };

  const handleArea = (area) => {
    setForm((prev) => ({
      ...prev,
      preferredAreas: prev.preferredAreas.includes(area)
        ? prev.preferredAreas.filter((a) => a !== area)
        : [...prev.preferredAreas, area]
    }));
  };

  const handleAmenity = (amenity) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:5000/api/user/preferences', form);
      setSuccess(true);
    } catch (err) {
      setError('Submission failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white">
      <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-lg p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-blue-700">Onboarding</h2>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Name</label>
          <input name="name" value={form.name} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Password</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Lifestyle</label>
          <select name="lifestyle" value={form.lifestyle} onChange={handleChange} required className="w-full border rounded px-3 py-2">
            <option value="">Select...</option>
            {lifestyleOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Personality Traits</label>
          <div className="flex flex-wrap gap-2">
            {personalityOptions.map(trait => (
              <button type="button" key={trait} onClick={() => handlePersonality(trait)}
                className={`px-3 py-1 rounded-full border ${form.personalityTraits.includes(trait) ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>{trait}</button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Work Schedule</label>
          <select name="workSchedule" value={form.workSchedule} onChange={handleChange} required className="w-full border rounded px-3 py-2">
            <option value="">Select...</option>
            {workScheduleOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Languages</label>
          <div className="flex flex-wrap gap-2">
            {languageOptions.map(lang => (
              <button type="button" key={lang} onClick={() => handleLanguage(lang)}
                className={`px-3 py-1 rounded-full border ${form.culturalPreferences.languages.includes(lang) ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>{lang}</button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Dietary Preference</label>
          <input name="dietary" value={form.culturalPreferences.dietary} onChange={handleCulturalChange} className="w-full border rounded px-3 py-2" placeholder="e.g. Halal, Vegetarian" />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Religion</label>
          <input name="religion" value={form.culturalPreferences.religion} onChange={handleCulturalChange} className="w-full border rounded px-3 py-2" placeholder="e.g. Muslim, Christian" />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Budget (AED)</label>
          <div className="flex gap-2">
            <input name="min" type="number" value={form.budget.min} onChange={handleBudgetChange} placeholder="Min" className="w-1/2 border rounded px-3 py-2" />
            <input name="max" type="number" value={form.budget.max} onChange={handleBudgetChange} placeholder="Max" className="w-1/2 border rounded px-3 py-2" />
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Preferred Locations</label>
          <div className="flex flex-wrap gap-2">
            {areaOptions.map(area => (
              <button type="button" key={area} onClick={() => handleArea(area)}
                className={`px-3 py-1 rounded-full border ${form.preferredAreas.includes(area) ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>{area}</button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Amenities</label>
          <div className="flex flex-wrap gap-2">
            {amenitiesOptions.map(amenity => (
              <button type="button" key={amenity} onClick={() => handleAmenity(amenity)}
                className={`px-3 py-1 rounded-full border ${form.amenities.includes(amenity) ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>{amenity}</button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Move-in Date</label>
          <input name="moveInDate" type="date" value={form.moveInDate} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Lease Duration (months)</label>
          <input name="leaseDuration" type="number" value={form.leaseDuration} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Billing Cycle</label>
          <select name="billingCycle" value={form.billingCycle} onChange={handleChange} className="w-full border rounded px-3 py-2">
            <option value="">Select...</option>
            {billingCycleOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">Preferences submitted successfully!</div>}
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition">
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
} 