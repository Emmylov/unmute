import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { ChevronLeft, ChevronRight, Image, Save, X } from 'lucide-react';

interface MemeTemplate {
  id: string;
  name: string;
  url: string;
}

interface MemeCreatorProps {
  onClose: () => void;
  onMemeCreated: (memeData: string) => void;
}

const MemeCreator = ({ onClose, onMemeCreated }: MemeCreatorProps) => {
  const [templates, setTemplates] = useState<MemeTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<MemeTemplate | null>(null);
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Load meme templates
    const fetchTemplates = async () => {
      try {
        setIsLoading(true);
        // Use static templates since we don't have an API
        const staticTemplates: MemeTemplate[] = [
          { id: 'drake', name: 'Drake', url: 'https://i.imgflip.com/30b1gx.jpg' },
          { id: 'distracted', name: 'Distracted Boyfriend', url: 'https://i.imgflip.com/1ur9b0.jpg' },
          { id: 'button', name: 'Two Buttons', url: 'https://i.imgflip.com/1g8my4.jpg' },
          { id: 'change', name: 'Change My Mind', url: 'https://i.imgflip.com/24y43o.jpg' },
          { id: 'doge', name: 'Doge', url: 'https://i.imgflip.com/4t0m5.jpg' },
          { id: 'batman', name: 'Batman Slaps Robin', url: 'https://i.imgflip.com/9ehk.jpg' },
          { id: 'expanding', name: 'Expanding Brain', url: 'https://i.imgflip.com/1jwhww.jpg' },
          { id: 'thinking', name: 'Thinking Guy', url: 'https://i.imgflip.com/1h7in3.jpg' },
          { id: 'woman-yelling', name: 'Woman Yelling at Cat', url: 'https://i.imgflip.com/345v97.jpg' },
          { id: 'disaster-girl', name: 'Disaster Girl', url: 'https://i.imgflip.com/23ls.jpg' },
          { id: 'guy-looking', name: 'Guy Looking Back', url: 'https://i.imgflip.com/1ihzfe.jpg' },
          { id: 'bernie', name: 'Bernie Sanders', url: 'https://i.imgflip.com/4frcuo.jpg' },
        ];
        
        setTemplates(staticTemplates);
        if (staticTemplates.length > 0) {
          setSelectedTemplate(staticTemplates[0]);
        }
      } catch (error) {
        console.error('Error fetching meme templates:', error);
        toast.error('Failed to load meme templates');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  // Generate meme when template or text changes
  useEffect(() => {
    if (selectedTemplate && canvasRef.current) {
      generateMeme();
    }
  }, [selectedTemplate, topText, bottomText]);

  const generateMeme = () => {
    if (!selectedTemplate || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Set canvas dimensions to match image
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Configure text style
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 5;
      ctx.textAlign = 'center';
      ctx.lineJoin = 'round';

      // Calculate font size based on canvas width
      const fontSize = Math.floor(canvas.width / 15);
      ctx.font = `bold ${fontSize}px Impact, sans-serif`;

      // Draw top text
      if (topText) {
        const textX = canvas.width / 2;
        const textY = fontSize + 10;
        ctx.strokeText(topText.toUpperCase(), textX, textY);
        ctx.fillText(topText.toUpperCase(), textX, textY);
      }

      // Draw bottom text
      if (bottomText) {
        const textX = canvas.width / 2;
        const textY = canvas.height - 20;
        ctx.strokeText(bottomText.toUpperCase(), textX, textY);
        ctx.fillText(bottomText.toUpperCase(), textX, textY);
      }
    };

    img.onerror = () => {
      toast.error('Failed to load meme template image');
    };

    img.src = selectedTemplate.url;
  };

  const handleSaveMeme = () => {
    if (!canvasRef.current) return;

    try {
      // Get meme as data URL
      const memeDataUrl = canvasRef.current.toDataURL('image/jpeg');
      
      // Create meme tag format with template ID and text
      const memeTag = `[MEME:${selectedTemplate?.id || 'custom'}|${topText}|${bottomText}]`;
      
      // Call the onMemeCreated callback with the meme info
      onMemeCreated(memeTag);
      toast.success('Meme created successfully!');
      onClose();
    } catch (error) {
      console.error('Error saving meme:', error);
      toast.error('Failed to create meme');
    }
  };

  const nextPage = () => {
    setPage(prev => Math.min(prev + 1, Math.floor((templates.length - 1) / 6)));
  };

  const prevPage = () => {
    setPage(prev => Math.max(0, prev - 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-xl overflow-hidden">
        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Create a Meme</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <X size={20} />
          </button>
        </div>

        <div className="p-5">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Preview panel */}
              <div className="flex flex-col">
                <h3 className="text-lg font-medium mb-3">Preview</h3>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 flex items-center justify-center mb-4 h-48 md:h-[300px]">
                  {selectedTemplate ? (
                    <div className="relative">
                      <canvas 
                        ref={canvasRef} 
                        className="max-w-full max-h-[250px] rounded shadow"
                      ></canvas>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-gray-400">
                      <Image size={40} />
                      <p className="mt-2">Select a template</p>
                    </div>
                  )}
                </div>

                {/* Text inputs */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Top Text</label>
                    <input
                      type="text"
                      className="w-full border dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                      placeholder="Top text"
                      value={topText}
                      onChange={(e) => setTopText(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bottom Text</label>
                    <input
                      type="text"
                      className="w-full border dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                      placeholder="Bottom text"
                      value={bottomText}
                      onChange={(e) => setBottomText(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Template selection */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-medium">Templates</h3>
                  <div className="flex space-x-2">
                    <button 
                      onClick={prevPage} 
                      disabled={page === 0}
                      className="p-1 rounded-full border disabled:opacity-30"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button 
                      onClick={nextPage} 
                      disabled={page >= Math.floor((templates.length - 1) / 6)}
                      className="p-1 rounded-full border disabled:opacity-30"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 h-64 md:h-[300px] overflow-y-auto">
                  {templates.slice(page * 6, (page + 1) * 6).map((template) => (
                    <div 
                      key={template.id}
                      className={`cursor-pointer border rounded-lg overflow-hidden ${selectedTemplate?.id === template.id ? 'border-purple-500 ring-2 ring-purple-500 ring-opacity-50' : 'border-gray-200 hover:border-purple-300'}`}
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <div className="h-24 overflow-hidden">
                        <img 
                          src={template.url} 
                          alt={template.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/150?text=Template+Error';
                          }}
                        />
                      </div>
                      <div className="p-2 text-center text-sm truncate">
                        {template.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg mr-2 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveMeme}
              disabled={!selectedTemplate || (!topText && !bottomText) || isLoading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center"
            >
              <Save size={18} className="mr-2" />
              Create Meme
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemeCreator;
