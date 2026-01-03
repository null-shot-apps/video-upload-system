const MIN_DURATION = 30; // seconds
const MAX_DURATION = 120; // seconds (2 minutes)
const MIN_VIDEOS = 1;
const MAX_VIDEOS = 4;
const ALLOWED_FORMATS = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB per video

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateVideoFormat(file: File): ValidationResult {
  if (!ALLOWED_FORMATS.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid format. Please upload MP4, MOV, AVI, or WebM videos.`
    };
  }
  
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`
    };
  }
  
  return { valid: true };
}

export function validateVideoDuration(duration: number): ValidationResult {
  if (duration < MIN_DURATION) {
    return {
      valid: false,
      error: `Video too short. Minimum duration is ${MIN_DURATION} seconds.`
    };
  }
  
  if (duration > MAX_DURATION) {
    return {
      valid: false,
      error: `Video too long. Maximum duration is ${MAX_DURATION / 60} minutes.`
    };
  }
  
  return { valid: true };
}

export function validateVideoCount(count: number): ValidationResult {
  if (count < MIN_VIDEOS) {
    return {
      valid: false,
      error: `Please upload at least ${MIN_VIDEOS} video.`
    };
  }
  
  if (count > MAX_VIDEOS) {
    return {
      valid: false,
      error: `Maximum ${MAX_VIDEOS} videos allowed per property.`
    };
  }
  
  return { valid: true };
}

export function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };
    
    video.onerror = () => {
      reject(new Error('Failed to load video metadata'));
    };
    
    video.src = URL.createObjectURL(file);
  });
}

export const VIDEO_CONSTRAINTS = {
  MIN_DURATION,
  MAX_DURATION,
  MIN_VIDEOS,
  MAX_VIDEOS,
  ALLOWED_FORMATS,
  MAX_FILE_SIZE
};

