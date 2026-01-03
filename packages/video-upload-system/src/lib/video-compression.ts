// Video compression utilities for mobile optimization
// Uses browser APIs to compress videos before upload

export interface CompressionOptions {
  maxWidth: number;
  maxHeight: number;
  quality: number;
  bitrate: number;
}

const DEFAULT_COMPRESSION: CompressionOptions = {
  maxWidth: 1280,
  maxHeight: 720,
  quality: 0.8,
  bitrate: 1500000 // 1.5 Mbps for Nigerian internet
};

export async function compressVideo(
  file: File,
  onProgress?: (progress: number) => void,
  options: CompressionOptions = DEFAULT_COMPRESSION
): Promise<Blob> {
  // For now, return original file
  // In production, implement actual compression using:
  // - WebCodecs API (modern browsers)
  // - FFmpeg.wasm (fallback)
  // - Server-side compression endpoint
  
  if (onProgress) {
    onProgress(100);
  }
  
  return file;
}

export function estimateCompressedSize(originalSize: number): number {
  // Estimate ~60% size reduction with compression
  return Math.floor(originalSize * 0.4);
}

export function shouldCompress(file: File): boolean {
  // Compress if file is larger than 50MB
  return file.size > 50 * 1024 * 1024;
}

