import { useState } from 'react';
import { Copy, Facebook, Link, Mail, Twitter, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ShareModalProps {
  title: string;
  url: string;
  text?: string;
  onClose: () => void;
}

const ShareModal = ({ title, url, text = '', onClose }: ShareModalProps) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy link');
    }
  };
  
  const encodedText = encodeURIComponent(text || title);
  const encodedUrl = encodeURIComponent(url);
  
  const shareLinks = [
    {
      name: 'Facebook',
      icon: <Facebook size={20} className="text-blue-600" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
    },
    {
      name: 'Twitter',
      icon: <Twitter size={20} className="text-blue-400" />,
      url: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`
    },
    {
      name: 'Email',
      icon: <Mail size={20} className="text-gray-500" />,
      url: `mailto:?subject=${encodedText}&body=${encodedUrl}`
    }
  ];
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl w-full max-w-md mx-4 p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Share</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Share this link:</p>
          <div className="flex items-center">
            <input
              type="text"
              value={url}
              readOnly
              className="flex-1 border rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 bg-gray-50"
            />
            <button
              onClick={handleCopy}
              className={`px-3 py-2 rounded-r-lg flex items-center ${
                copied ? 'bg-green-500 text-white' : 'bg-purple-600 text-white'
              }`}
            >
              <Copy size={18} className="mr-1" />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
        
        <div className="mt-6">
          <p className="text-sm text-gray-600 mb-3">Share via:</p>
          <div className="grid grid-cols-3 gap-2">
            {shareLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-lg border hover:bg-gray-50 transition"
              >
                {link.icon}
                <span className="text-xs mt-1">{link.name}</span>
              </a>
            ))}
          </div>
        </div>
        
        <div className="mt-6 border-t pt-4">
          <p className="text-xs text-gray-500 text-center">
            By sharing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
