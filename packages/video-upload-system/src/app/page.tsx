'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getCurrentUser, logout } from '@/lib/auth';
import { User } from '@/types';

export default function Landing() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-green-500 to-blue-600">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">ShowRoom</h1>
                <p className="text-xs text-green-100">Nigeria&apos;s Video-First Rental Platform</p>
              </div>
            </div>

            {user && (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition-colors backdrop-blur-sm"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Find Your Perfect Home
            <br />
            <span className="text-green-100">Through Video</span>
          </h2>
          
          <p className="text-xl sm:text-2xl text-green-50 mb-12 max-w-2xl mx-auto">
            Experience properties like never before. Watch real walkthrough videos from landlords and agents across Nigeria.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => router.push('/upload')}
              className="w-full sm:w-auto px-8 py-4 bg-white text-green-600 rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl hover:scale-105 transition-all"
            >
              Upload Property Videos
            </button>
            
            <button
              className="w-full sm:w-auto px-8 py-4 bg-green-700 text-white rounded-xl font-bold text-lg shadow-xl hover:bg-green-800 transition-colors"
            >
              Browse Properties
            </button>
          </div>

          {user && (
            <div className="mt-8 inline-block px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full">
              <p className="text-white">
                Welcome back, <span className="font-semibold">{user.name}</span> ({user.role})
              </p>
            </div>
          )}

          {/* Features */}
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Video Walkthroughs</h3>
              <p className="text-green-100 text-sm">See every room, compound, and surrounding area before visiting</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Mobile-First</h3>
              <p className="text-green-100 text-sm">Upload and browse from your phone, optimized for Nigerian internet</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Verified Listings</h3>
              <p className="text-green-100 text-sm">Only landlords and agents can upload, ensuring authentic properties</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


