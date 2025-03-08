import { useState } from 'react';
import { Loader, Search, X } from 'lucide-react';
import GifPickerReact, { TenorResult } from 'gif-picker-react';
import { toast } from 'react-hot-toast';

interface GifPickerProps {
  onGifSelected: (gif: { url: string, width: number, height: number }) => void;
  onClose: () => void;
}

const GifPicker = ({ onGifSelected, onClose }: GifPickerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleGifClick = (tenorGif: TenorResult) => {
    try {
      // Get the best quality but not too large
      const gifData = tenorGif.media_formats.gif || tenorGif.media_formats.mediumgif || tenorGif.media_formats.tinygif;
      
      if (gifData) {
        onGifSelected({
          url: gifData.url,
          width: gifData.dims[0],
          height: gifData.dims[1]
        });
        onClose();
      } else {
        toast.error('Could not get GIF data');
      }
    } catch (error) {
      console.error('Error selecting GIF:', error);
      toast.error('Failed to select GIF');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-xl overflow-hidden">
        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-medium">Select a GIF</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search GIFs..."
              className="w-full pl-10 pr-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            {isLoading && (
              <Loader className="absolute right-3 top-2.5 text-gray-400 animate-spin" size={20} />
            )}
          </div>
          
          <div className="h-96 overflow-y-auto">
            <GifPickerReact
              onGifClick={handleGifClick}
              tenorApiKey="LIVDSRZULELA"
              contentFilter="high"
              theme="light"
              searchPlaceholder="Search GIFs..."
              width={400}
              height={400}
              autoFocusSearch={false}
              muted={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GifPicker;
