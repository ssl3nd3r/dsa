import React from 'react';
import Link from 'next/link';

// Mock data for preview
const recommendedProperties = [
  { id: 1, title: 'Luxury Downtown Apartment', location: 'Downtown', price: 'AED 8,000/mo', matchReason: 'Matches your budget and preferred area', image: '/property1.jpg' },
  { id: 2, title: 'Palm Jumeirah Villa', location: 'Palm Jumeirah', price: 'AED 25,000/mo', matchReason: 'Includes your desired amenities', image: '/property2.jpg' },
];
const serviceProviders = [
  { id: 1, name: 'CleanCo', service: 'Cleaning', rating: 4.8 },
  { id: 2, name: 'FixIt Dubai', service: 'Maintenance', rating: 4.6 },
];
const recentMessages = [
  { id: 1, user: 'Agent Sarah', preview: 'Your viewing is confirmed for tomorrow.', time: '2h ago' },
  { id: 2, user: 'Landlord Ali', preview: 'Lease agreement sent. Please review.', time: '5h ago' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-4">
          <span className="text-2xl font-bold text-blue-800">Dubai Smart Accommodations</span>
          <nav className="hidden md:flex gap-6 ml-8">
            <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
            <Link href="/properties" className="hover:text-blue-600">Properties</Link>
            <Link href="/services" className="hover:text-blue-600">Services</Link>
            <Link href="/messages" className="hover:text-blue-600">Messages</Link>
            <Link href="/profile" className="hover:text-blue-600">Profile</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center font-bold text-blue-800">U</div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-100 to-blue-300 py-12 px-8 text-center">
        <h1 className="text-4xl font-extrabold mb-4 text-blue-900">Find Your Perfect Dubai Home</h1>
        <p className="mb-6 text-lg text-blue-800">Smart recommendations based on your preferences</p>
        <div className="flex flex-col md:flex-row gap-4 justify-center max-w-2xl mx-auto">
          <input className="flex-1 px-4 py-2 rounded border" placeholder="Location" />
          <input className="flex-1 px-4 py-2 rounded border" placeholder="Budget (AED)" />
          <input className="flex-1 px-4 py-2 rounded border" placeholder="Amenities" />
          <input className="flex-1 px-4 py-2 rounded border" placeholder="Lease Term" />
          <button className="bg-blue-700 text-white px-6 py-2 rounded font-semibold hover:bg-blue-800">Search</button>
        </div>
      </section>

      {/* Recommended Properties */}
      <section className="py-10 px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-blue-900">Recommended Properties</h2>
          <Link href="/properties" className="text-blue-700 hover:underline">See all</Link>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-2">
          {recommendedProperties.map((prop) => (
            <div key={prop.id} className="bg-white rounded-lg shadow w-80 flex-shrink-0">
              <div className="h-40 bg-gray-200 rounded-t-lg" style={{backgroundImage: `url(${prop.image})`, backgroundSize: 'cover'}}></div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">{prop.title}</h3>
                <p className="text-gray-600">{prop.location}</p>
                <p className="text-blue-700 font-bold mt-2">{prop.price}</p>
                <p className="text-green-700 text-sm mt-1">{prop.matchReason}</p>
                <Link href="/properties" className="inline-block mt-3 text-blue-600 hover:underline">View Details</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-6 px-8 flex flex-wrap gap-6 justify-center">
        <button className="bg-white shadow rounded-lg px-6 py-4 font-semibold text-blue-800 hover:bg-blue-50">Edit Profile</button>
        <button className="bg-white shadow rounded-lg px-6 py-4 font-semibold text-blue-800 hover:bg-blue-50">Post Property</button>
        <button className="bg-white shadow rounded-lg px-6 py-4 font-semibold text-blue-800 hover:bg-blue-50">Find Service Provider</button>
      </section>

      {/* Service Providers */}
      <section className="py-10 px-8 bg-blue-50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-blue-900">Top Service Providers</h2>
          <Link href="/services" className="text-blue-700 hover:underline">See all</Link>
        </div>
        <div className="flex gap-6 flex-wrap">
          {serviceProviders.map((sp) => (
            <div key={sp.id} className="bg-white rounded-lg shadow p-6 w-64">
              <h3 className="font-semibold text-lg">{sp.name}</h3>
              <p className="text-gray-600">{sp.service}</p>
              <p className="text-yellow-500 font-bold">★ {sp.rating}</p>
              <Link href="/services" className="inline-block mt-3 text-blue-600 hover:underline">View Profile</Link>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Messages */}
      <section className="py-10 px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-blue-900">Recent Messages</h2>
          <Link href="/messages" className="text-blue-700 hover:underline">Go to Messages</Link>
        </div>
        <div className="flex flex-col gap-4 max-w-2xl mx-auto">
          {recentMessages.map((msg) => (
            <div key={msg.id} className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
              <div>
                <span className="font-semibold text-blue-800">{msg.user}</span>
                <span className="ml-2 text-gray-600">{msg.preview}</span>
              </div>
              <span className="text-gray-400 text-sm">{msg.time}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-6 px-8 mt-auto text-center text-gray-500">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <div>
            &copy; {new Date().getFullYear()} Dubai Smart Accommodations
          </div>
          <div className="flex gap-4">
            <Link href="/about" className="hover:underline">About</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
            <Link href="/terms" className="hover:underline">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
} 