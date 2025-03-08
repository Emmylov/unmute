import { useState } from 'react';
import { Camera, Check, FileVideo, Image, Upload, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

interface FileUploaderProps {
  onUploadComplete: (url: string) => void;
  type?: 'image' | 'video' | 'avatar' | 'media';
  initialPreview?: string;
  bucketName?: string;
  folderPath?: string;
  maxSizeMB?: number;
}

const FileUploader = ({
  onUploadComplete,
  type = 'image',
  initialPreview = '',
  bucketName = 'uploads',
  folderPath = 'general',
  maxSizeMB = 10
}: FileUploaderProps) => {
  const [preview, setPreview] = useState<string>(initialPreview);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileType, setFileType] = useState<'image' | 'video' | ''>('');

  const acceptMap = {
    image: 'image/*',
    video: 'video/*',
    avatar: 'image/*',
    media: 'image/*,video/*'
  };

  const compressImage = async (file: File, maxWidth = 1200): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Calculate new dimensions if width exceeds maxWidth
          if (width > maxWidth) {
            height = Math.floor(height * (maxWidth / width));
            width = maxWidth;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }
          
          ctx.drawImage(img, 0, 0, width, height);
          
          // Get compressed image as data URL
          const dataUrl = canvas.toDataURL(file.type, 0.85); // 0.85 quality
          resolve(dataUrl);
        };
        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };
      };
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File size should be less than ${maxSizeMB}MB`);
      return;
    }

    // Update file type
    if (file.type.startsWith('image/')) {
      setFileType('image');
    } else if (file.type.startsWith('video/')) {
      setFileType('video');
    }

    setIsUploading(true);
    setUploadProgress(10);

    try {
      // Generate a unique ID for storage
      const fileId = `${bucketName}_${folderPath}_${uuidv4()}`;
      let fileData: string;

      // Compress images to reduce storage size and improve load times
      if (file.type.startsWith('image/')) {
        fileData = await compressImage(file);
      } else {
        // For other file types, use regular data URL
        fileData = await readFileAsDataURL(file);
      }

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + (100 - prev) * 0.1;
          return newProgress > 95 ? 95 : newProgress;
        });
      }, 200);

      // Store file in localStorage
      const uploadedFiles = JSON.parse(localStorage.getItem('uploaded_files') || '{}');
      uploadedFiles[fileId] = {
        id: fileId,
        data: fileData,
        type: file.type,
        name: file.name,
        uploadedAt: new Date().toISOString()
      };
      
      localStorage.setItem('uploaded_files', JSON.stringify(uploadedFiles));
      
      // Update preview
      setPreview(fileData);
      
      // Complete progress
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Notify parent component
      setTimeout(() => {
        onUploadComplete(fileData);
        toast.success('File uploaded successfully');
        setIsUploading(false);
      }, 500);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed. Please try again.');
      setPreview('');
      setIsUploading(false);
    }
  };

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const clearFile = () => {
    setPreview('');
    setFileType('');
  };

  const getIcon = () => {
    switch (type) {
      case 'image': return <Image className="h-10 w-10 text-gray-400" />;
      case 'video': return <FileVideo className="h-10 w-10 text-gray-400" />;
      case 'avatar': return <Camera className="h-10 w-10 text-gray-400" />;
      case 'media': return (
        <div className="flex">
          <Image className="h-10 w-10 text-gray-400" />
          <FileVideo className="h-10 w-10 text-gray-400" />
        </div>
      );
      default: return <Upload className="h-10 w-10 text-gray-400" />;
    }
  };

  return (
    <div className="w-full">
      {preview ? (
        <div className="relative rounded-lg overflow-hidden">
          {fileType === 'image' || (!fileType && preview) ? (
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-64 object-cover" 
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = 'https://via.placeholder.com/400x400?text=Image+Error';
              }}
            />
          ) : fileType === 'video' ? (
            <video 
              src={preview} 
              className="w-full h-64 object-cover" 
              controls
              onError={(e) => {
                const target = e.target as HTMLVideoElement;
                target.onerror = null;
                // Replace with error message
                const parent = target.parentNode as HTMLElement;
                if (parent) {
                  parent.innerHTML = '<div class="flex items-center justify-center h-64 bg-gray-100 text-gray-500">Video preview not available</div>';
                }
              }}
            />
          ) : null}
          
          {isUploading ? (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
                  <div 
                    className="bg-purple-600 h-2.5 rounded-full" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm">Uploading: {Math.round(uploadProgress)}%</p>
              </div>
            </div>
          ) : uploadProgress === 100 ? (
            <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
              <Check size={16} />
            </div>
          ) : (
            <button
              onClick={clearFile}
              className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full"
            >
              <X size={16} />
            </button>
          )}
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          {getIcon()}
          <p className="mt-2 text-sm text-gray-600">
            {type === 'avatar' 
              ? 'Upload a profile picture' 
              : type === 'video'
              ? 'Upload a video'
              : type === 'media'
              ? 'Upload an image or video'
              : 'Upload an image'}
          </p>
          <label className="mt-4 inline-block file-input-label">
            Browse Files
            <input
              type="file"
              accept={acceptMap[type]}
              onChange={handleFileChange}
              className="file-input"
              disabled={isUploading}
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
