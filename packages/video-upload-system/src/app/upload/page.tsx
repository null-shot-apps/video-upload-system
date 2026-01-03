'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/AuthGuard';
import VideoUploader from '@/components/VideoUploader';
import PropertyDetailsForm from '@/components/PropertyDetailsForm';
import { VideoFile, PropertyDetails } from '@/types';
import { getCurrentUser } from '@/lib/auth';

type Step = 'videos' | 'details' | 'success';

export default function UploadPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('videos');
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [propertyId, setPropertyId] = useState<string>('');

  const handleVideosReady = (uploadedVideos: VideoFile[]) => {
    setVideos(uploadedVideos);
    setStep('details');
  };

  const handlePropertySubmit = async (details: PropertyDetails) => {
    const user = getCurrentUser();
    if (!user) return;

    // In production, send to API endpoint
    const property = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      videos: videos.map(v => v.url!),
      details,
      createdAt: new Date(),
      status: 'published'
    };

    // Mock API call
    console.log('Submitting property:', property);
    
    setPropertyId(property.id);
    setStep('success');
  };

  const handleBackToVideos = () => {
    setStep('videos');
  };

  const handleUploadAnother = () => {
    setVideos([]);
    setPropertyId('');
    setStep('videos');
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">ShowRoom</h1>
                  <p className="text-xs text-gray-600">Upload Property</p>
                </div>
              </div>

              {/* Progress Indicator */}
              {step !== 'success' && (
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step === 'videos' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-600'
                  }`}>
                    1
                  </div>
                  <div className="w-8 h-0.5 bg-gray-300"></div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step === 'details' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    2
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 py-8">
          {step === 'videos' && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Upload Property Videos</h2>
                <p className="text-gray-600">
                  Show your property with 1-4 walkthrough videos (30s-2min each)
                </p>
              </div>
              <VideoUploader onVideosReady={handleVideosReady} />
            </div>
          )}

          {step === 'details' && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Property Details</h2>
                <p className="text-gray-600">
                  Complete your listing with location and pricing information
                </p>
              </div>
              <PropertyDetailsForm
                onSubmit={handlePropertySubmit}
                onBack={handleBackToVideos}
              />
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Property Listed Successfully!</h2>
              <p className="text-gray-600 mb-2">
                Your property is now live on ShowRoom
              </p>
              <p className="text-sm text-gray-500 mb-8">
                Property ID: <span className="font-mono font-semibold">{propertyId}</span>
              </p>

              <div className="max-w-md mx-auto space-y-3">
                <button
                  onClick={handleUploadAnother}
                  className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
                >
                  Upload Another Property
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="w-full py-3 px-6 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Back to Home
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Footer Info */}
        {step === 'videos' && (
          <div className="max-w-4xl mx-auto px-4 pb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">📱 Tips for Great Property Videos</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Hold your phone horizontally (landscape mode)</li>
                <li>• Show all rooms, kitchen, bathroom, and compound</li>
                <li>• Walk slowly and keep the camera steady</li>
                <li>• Record during daytime for better lighting</li>
                <li>• Include surroundings and nearby landmarks</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}

