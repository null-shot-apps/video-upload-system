// Chunked upload manager for handling unstable connections
// Implements retry logic and resumable uploads

export interface UploadOptions {
  chunkSize: number;
  maxRetries: number;
  retryDelay: number;
  onProgress: (progress: number) => void;
  onError: (error: string) => void;
  onComplete: (url: string) => void;
}

const DEFAULT_OPTIONS: Partial<UploadOptions> = {
  chunkSize: 1024 * 1024, // 1MB chunks for Nigerian internet
  maxRetries: 5,
  retryDelay: 2000
};

export class VideoUploadManager {
  private abortController: AbortController | null = null;
  private uploadedChunks: Set<number> = new Set();
  
  async uploadVideo(
    file: File,
    options: UploadOptions
  ): Promise<void> {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    this.abortController = new AbortController();
    
    const totalChunks = Math.ceil(file.size / opts.chunkSize!);
    let uploadedBytes = 0;
    
    try {
      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        if (this.uploadedChunks.has(chunkIndex)) {
          continue; // Skip already uploaded chunks (resume support)
        }
        
        const start = chunkIndex * opts.chunkSize!;
        const end = Math.min(start + opts.chunkSize!, file.size);
        const chunk = file.slice(start, end);
        
        await this.uploadChunkWithRetry(
          chunk,
          chunkIndex,
          totalChunks,
          file.name,
          opts
        );
        
        this.uploadedChunks.add(chunkIndex);
        uploadedBytes += chunk.size;
        
        const progress = (uploadedBytes / file.size) * 100;
        options.onProgress(progress);
      }
      
      // Simulate successful upload - replace with real endpoint
      const mockUrl = URL.createObjectURL(file);
      options.onComplete(mockUrl);
      
    } catch (error) {
      if (error instanceof Error) {
        options.onError(error.message);
      } else {
        options.onError('Upload failed');
      }
      throw error;
    }
  }
  
  private async uploadChunkWithRetry(
    chunk: Blob,
    chunkIndex: number,
    totalChunks: number,
    fileName: string,
    options: Partial<UploadOptions>
  ): Promise<void> {
    let retries = 0;
    
    while (retries < options.maxRetries!) {
      try {
        await this.uploadChunk(chunk, chunkIndex, totalChunks, fileName);
        return;
      } catch (error) {
        retries++;
        if (retries >= options.maxRetries!) {
          throw error;
        }
        
        // Exponential backoff
        const delay = options.retryDelay! * Math.pow(2, retries - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  private async uploadChunk(
    chunk: Blob,
    chunkIndex: number,
    totalChunks: number,
    fileName: string
  ): Promise<void> {
    // Mock upload - replace with real API endpoint
    // In production, send to: POST /api/upload/chunk
    
    const formData = new FormData();
    formData.append('chunk', chunk);
    formData.append('chunkIndex', chunkIndex.toString());
    formData.append('totalChunks', totalChunks.toString());
    formData.append('fileName', fileName);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Simulate occasional network failures (10% chance)
    if (Math.random() < 0.1) {
      throw new Error('Network error');
    }
  }
  
  abort() {
    if (this.abortController) {
      this.abortController.abort();
    }
  }
  
  reset() {
    this.uploadedChunks.clear();
    this.abortController = null;
  }
}

