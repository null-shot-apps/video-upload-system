'use client';

import { useState, useRef } from 'react';
import { VideoFile } from '@/types';
import { validateVideoFormat, validateVideoDuration, getVideoDuration, VIDEO_CONSTRAINTS } from '@/lib/video-validation';
import { VideoUploadManager } from '@/lib/upload-manager';
import { shouldCompress, compressVideo } from '@/lib/video-compression';

interface VideoUploaderProps {
  onVideosReady: (videos: VideoFile[]) => void;
}

export default function VideoUploader({ onVideosReady }: VideoUploaderProps) {
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadManagers = useRef<Map<string, VideoUploadManager>>(new Map());

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setError('');

    // Check total video count
    if (videos.length + files.length > VIDEO_CONSTRAINTS.MAX_VIDEOS) {
      setError(`Maximum ${VIDEO_CONSTRAINTS.MAX_VIDEOS} videos allowed per property`);
      return;
    }

    // Process each file
    for (const file of files) {
      // Validate format
      const formatValidation = validateVideoFormat(file);
      if (!formatValidation.valid) {
        setError(formatValidation.error!);
        continue;
      }

      try {
        // Get video duration
        const duration = await getVideoDuration(file);
        
        // Validate duration
        const durationValidation = validateVideoDuration(duration);
        if (!durationValidation.valid) {
          setError(durationValidation.error!);
          continue;
        }

        // Create video file object
        const videoFile: VideoFile = {
          id: Math.random().toString(36).substr(2, 9),
          file,
          duration,
          size: file.size,
          uploadProgress: 0,
          status: 'pending'
        };

        setVideos(prev => [...prev, videoFile]);
        
        // Start upload
        startUpload(videoFile);
        
      } catch (err) {
        setError('Failed to process video. Please try again.');
      }
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const startUpload = async (video: VideoFile) => {
    const manager = new VideoUploadManager();
    uploadManagers.current.set(video.id, manager);

    // Update status to uploading
    setVideos(prev => prev.map(v => 
      v.id === video.id ? { ...v, status: 'uploading' as const } : v
    ));

    try {
      // Compress if needed
      let fileToUpload = video.file;
      if (shouldCompress(video.file)) {
        const compressed = await compressVideo(video.file, (progress) => {
          // Could show compression progress here
        });
        fileToUpload = new File([compressed], video.file.name, { type: video.file.type });
      }

      // Upload with progress tracking
      await manager.uploadVideo(fileToUpload, {
        chunkSize: 1024 * 1024, // 1MB chunks
        maxRetries: 5,
        retryDelay: 2000,
        onProgress: (progress) => {
          setVideos(prev => prev.map(v =>
            v.id === video.id ? { ...v, uploadProgress: progress } : v
          ));
        },
        onError: (error) => {
          setVideos(prev => prev.map(v =>
            v.id === video.id ? { ...v, status: 'error' as const, error } : v
          ));
        },
        onComplete: (url) => {
          setVideos(prev => {
            const updated = prev.map(v =>
              v.id === video.id ? { ...v, status: 'completed' as const, url, uploadProgress: 100 } : v
            );
            
            // Check if all videos are completed
            const allCompleted = updated.every(v => v.status === 'completed');
            if (allCompleted && updated.length >= VIDEO_CONSTRAINTS.MIN_VIDEOS) {
              onVideosReady(updated);
            }
            
            return updated;
          });
        }
      });
    } catch (err) {
      setVideos(prev => prev.map(v =>
        v.id === video.id ? { ...v, status: 'error' as const, error: 'Upload failed' } : v
      ));
    }
  };

  const removeVideo = (videoId: string) => {
    // Cancel upload if in progress
    const manager = uploadManagers.current.get(videoId);
    if (manager) {
      manager.abort();
      uploadManagers.current.delete(videoId);
    }

    setVideos(prev => prev.filter(v => v.id !== videoId));
    setError('');
  };

  const retryUpload = (video: VideoFile) => {
    setVideos(prev => prev.map(v =>
      v.id === video.id ? { ...v, status: 'pending' as const, error: undefined, uploadProgress: 0 } : v
    ));
    startUpload(video);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const canAddMore = videos.length < VIDEO_CONSTRAINTS.MAX_VIDEOS;
  const hasMinimum = videos.length >= VIDEO_CONSTRAINTS.MIN_VIDEOS;
  const allCompleted = videos.every(v => v.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Upload Button */}
      <div className="text-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/quicktime,video/x-msvideo,video/webm"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={!canAddMore}
        />
        
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={!canAddMore}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all ${
            canAddMore
              ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <div className="flex items-center justify-center gap-3">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {videos.length === 0 ? 'Select Videos from Gallery' : `Add More Videos (${videos.length}/${VIDEO_CONSTRAINTS.MAX_VIDEOS})`}
          </div>
        </button>

        <p className="text-sm text-gray-600 mt-3">
          {VIDEO_CONSTRAINTS.MIN_VIDEOS}-{VIDEO_CONSTRAINTS.MAX_VIDEOS} videos • {VIDEO_CONSTRAINTS.MIN_DURATION}s-{VIDEO_CONSTRAINTS.MAX_DURATION / 60}min each
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Video List */}
      {videos.length > 0 && (
        <div className="space-y-3">
          {videos.map((video, index) => (
            <div
              key={video.id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                {/* Video Number */}
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-green-700 font-semibold">{index + 1}</span>
                </div>

                {/* Video Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{video.file.name}</p>
                      <p className="text-sm text-gray-600">
                        {formatDuration(video.duration)} • {formatSize(video.size)}
                      </p>
                    </div>

                    {/* Status Icon */}
                    <div className="flex-shrink-0">
                      {video.status === 'completed' && (
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                      {video.status === 'error' && (
                        <button
                          onClick={() => retryUpload(video)}
                          className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                        >
                          <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </button>
                      )}
                      {(video.status === 'pending' || video.status === 'uploading') && (
                        <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {video.status === 'uploading' && (
                    <div className="mb-2">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-600 transition-all duration-300"
                          style={{ width: `${video.uploadProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        Uploading... {Math.round(video.uploadProgress)}%
                      </p>
                    </div>
                  )}

                  {/* Error Message */}
                  {video.status === 'error' && video.error && (
                    <p className="text-sm text-red-600 mb-2">{video.error}</p>
                  )}

                  {/* Remove Button */}
                  <button
                    onClick={() => removeVideo(video.id)}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Status Message */}
      {videos.length > 0 && (
        <div className={`text-center p-4 rounded-lg ${
          hasMinimum && allCompleted
            ? 'bg-green-50 text-green-800'
            : 'bg-blue-50 text-blue-800'
        }`}>
          {hasMinimum && allCompleted ? (
            <p className="font-medium">✓ All videos uploaded successfully! Continue to property details.</p>
          ) : !hasMinimum ? (
            <p>Upload at least {VIDEO_CONSTRAINTS.MIN_VIDEOS} video to continue</p>
          ) : (
            <p>Uploading videos...</p>
          )}
        </div>
      )}
    </div>
  );
}

