import { useState, useEffect, useRef } from 'react';
import { Brush, Camera, Check, Download, Eraser, Palette, Smile, Type, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Draggable from 'react-draggable';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

interface StoryEffectsProps {
  image: string;
  onSave: (editedImage: string) => void;
  onCancel: () => void;
}

const StoryEffects = ({ image, onSave, onCancel }: StoryEffectsProps) => {
  const [filter, setFilter] = useState('');
  const [textElements, setTextElements] = useState<Array<{
    id: string;
    text: string;
    x: number;
    y: number;
    color: string;
    fontSize: number;
  }>>([]);
  const [stickers, setStickers] = useState<Array<{
    id: string;
    emoji: string;
    x: number;
    y: number;
    size: number;
  }>>([]);
  const [activeTextId, setActiveTextId] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [editingText, setEditingText] = useState('');
  const [textColor, setTextColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState(24);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingColor, setDrawingColor] = useState('#ff0000');
  const [brushSize, setBrushSize] = useState(5);
  const [isErasing, setIsErasing] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  // Initialize drawing canvas
  useEffect(() => {
    if (drawingCanvasRef.current) {
      const canvas = drawingCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctxRef.current = ctx;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = brushSize;
        ctx.strokeStyle = drawingColor;
      }
    }
  }, [drawingColor, brushSize]);

  // Handle drawing
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!ctxRef.current || !drawingCanvasRef.current) return;
    
    const rect = drawingCanvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctxRef.current || !drawingCanvasRef.current) return;
    
    const rect = drawingCanvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();
  };

  const stopDrawing = () => {
    if (!ctxRef.current) return;
    ctxRef.current.closePath();
    setIsDrawing(false);
  };

  // Add new text element
  const addTextElement = () => {
    const newId = `text-${Date.now()}`;
    const containerWidth = containerRef.current?.offsetWidth || 300;
    const containerHeight = containerRef.current?.offsetHeight || 400;
    
    const newElement = {
      id: newId,
      text: 'Tap to edit',
      x: containerWidth / 2 - 50,
      y: containerHeight / 2 - 10,
      color: textColor,
      fontSize: fontSize
    };
    
    setTextElements([...textElements, newElement]);
    setActiveTextId(newId);
    setEditingText('Tap to edit');
  };

  // Add sticker (emoji)
  const addSticker = (emoji: EmojiClickData) => {
    const containerWidth = containerRef.current?.offsetWidth || 300;
    const containerHeight = containerRef.current?.offsetHeight || 400;
    
    setStickers([
      ...stickers, 
      {
        id: `sticker-${Date.now()}`,
        emoji: emoji.emoji,
        x: containerWidth / 2 - 15,
        y: containerHeight / 2 - 15,
        size: 30
      }
    ]);
    
    setShowEmojiPicker(false);
  };

  // Update text element
  const updateTextElement = () => {
    if (!activeTextId) return;
    
    setTextElements(textElements.map(el => 
      el.id === activeTextId 
        ? { ...el, text: editingText, color: textColor, fontSize }
        : el
    ));
    
    setActiveTextId(null);
  };

  // Clear everything
  const clearAll = () => {
    setTextElements([]);
    setStickers([]);
    setFilter('');
    
    if (ctxRef.current && drawingCanvasRef.current) {
      ctxRef.current.clearRect(0, 0, drawingCanvasRef.current.width, drawingCanvasRef.current.height);
    }
  };

  // Clear drawing
  const clearDrawing = () => {
    if (ctxRef.current && drawingCanvasRef.current) {
      ctxRef.current.clearRect(0, 0, drawingCanvasRef.current.width, drawingCanvasRef.current.height);
    }
  };

  // Toggle eraser
  const toggleEraser = () => {
    if (!ctxRef.current) return;
    
    setIsErasing(!isErasing);
    
    if (!isErasing) {
      // Switch to eraser
      ctxRef.current.globalCompositeOperation = 'destination-out';
    } else {
      // Switch back to drawing
      ctxRef.current.globalCompositeOperation = 'source-over';
    }
  };

  // Save the edited image
  const saveImage = () => {
    if (!canvasRef.current || !containerRef.current) return;
    
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        toast.error('Canvas context not available');
        return;
      }
      
      // Set canvas dimensions to match container
      canvas.width = containerRef.current.offsetWidth;
      canvas.height = containerRef.current.offsetHeight;
      
      // Draw the base image with filter
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        // Draw image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Apply filter
        if (filter) {
          ctx.filter = filter;
          ctx.globalCompositeOperation = 'source-atop';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.filter = 'none';
          ctx.globalCompositeOperation = 'source-over';
        }
        
        // Draw from drawing canvas
        if (drawingCanvasRef.current) {
          ctx.drawImage(drawingCanvasRef.current, 0, 0);
        }
        
        // Draw text elements
        textElements.forEach(el => {
          ctx.font = `${el.fontSize}px Arial, sans-serif`;
          ctx.fillStyle = el.color;
          ctx.fillText(el.text, el.x, el.y);
        });
        
        // Draw stickers (emojis)
        stickers.forEach(sticker => {
          ctx.font = `${sticker.size}px Arial, sans-serif`;
          ctx.fillText(sticker.emoji, sticker.x, sticker.y);
        });
        
        // Convert to data URL and save
        const dataUrl = canvas.toDataURL('image/jpeg');
        onSave(dataUrl);
      };
      
      img.onerror = () => {
        toast.error('Error loading image');
      };
      
      img.src = image;
    } catch (error) {
      console.error('Error saving image:', error);
      toast.error('Failed to save image');
    }
  };

  // Define filter presets
  const filterPresets = [
    { name: 'None', value: '' },
    { name: 'Vintage', value: 'sepia(0.5) contrast(1.2)' },
    { name: 'B&W', value: 'grayscale(1)' },
    { name: 'Warm', value: 'contrast(1.1) saturate(1.5) hue-rotate(15deg)' },
    { name: 'Cool', value: 'contrast(1.1) saturate(1.1) hue-rotate(-15deg)' },
    { name: 'Bright', value: 'brightness(1.3) contrast(1.1)' },
    { name: 'Dramatic', value: 'contrast(1.5) saturate(1.5)' }
  ];

  // Color palette for text
  const colorPalette = [
    '#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', 
    '#ffff00', '#ff00ff', '#00ffff', '#ff8000', '#8000ff'
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      <div className="p-4 flex justify-between items-center">
        <button 
          onClick={onCancel} 
          className="text-white hover:text-gray-300"
        >
          <X size={24} />
        </button>
        <h2 className="text-white text-lg font-medium">Edit Story</h2>
        <button 
          onClick={saveImage} 
          className="text-white hover:text-gray-300"
        >
          <Check size={24} />
        </button>
      </div>
      
      <div className="flex-1 relative overflow-hidden" ref={containerRef}>
        {/* Main image with filter */}
        <div 
          className="absolute inset-0 bg-center bg-no-repeat bg-cover"
          style={{ 
            backgroundImage: `url(${image})`,
            filter: filter 
          }}
        ></div>
        
        {/* Drawing canvas */}
        <canvas
          ref={drawingCanvasRef}
          width={containerRef.current?.offsetWidth || 500}
          height={containerRef.current?.offsetHeight || 700}
          className="absolute inset-0 z-10"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        ></canvas>
        
        {/* Draggable text elements */}
        {textElements.map(el => (
          <Draggable
            key={el.id}
            defaultPosition={{ x: el.x, y: el.y }}
            onStop={(_, data) => {
              setTextElements(textElements.map(item => 
                item.id === el.id ? { ...item, x: data.x, y: data.y } : item
              ));
            }}
          >
            <div
              className={`absolute cursor-move z-20 ${activeTextId === el.id ? 'ring-2 ring-blue-500' : ''}`}
              style={{ top: 0, left: 0 }}
              onClick={() => {
                setActiveTextId(el.id);
                setEditingText(el.text);
                setTextColor(el.color);
                setFontSize(el.fontSize);
              }}
            >
              <div 
                style={{ 
                  color: el.color, 
                  fontSize: `${el.fontSize}px`,
                  textShadow: '1px 1px 3px rgba(0,0,0,0.5)'
                }}
              >
                {el.text}
              </div>
            </div>
          </Draggable>
        ))}
        
        {/* Draggable stickers */}
        {stickers.map(sticker => (
          <Draggable
            key={sticker.id}
            defaultPosition={{ x: sticker.x, y: sticker.y }}
            onStop={(_, data) => {
              setStickers(stickers.map(item => 
                item.id === sticker.id ? { ...item, x: data.x, y: data.y } : item
              ));
            }}
          >
            <div
              className="absolute cursor-move z-20"
              style={{ 
                top: 0, 
                left: 0, 
                fontSize: `${sticker.size}px` 
              }}
            >
              {sticker.emoji}
            </div>
          </Draggable>
        ))}
        
        {/* Canvas for final image generation (invisible) */}
        <canvas 
          ref={canvasRef} 
          className="hidden"
        ></canvas>
      </div>
      
      {/* Text editor */}
      {activeTextId && (
        <div className="absolute inset-x-0 bottom-20 bg-black bg-opacity-80 p-4 z-30">
          <input
            type="text"
            value={editingText}
            onChange={(e) => setEditingText(e.target.value)}
            className="w-full bg-transparent text-white border-b border-gray-500 focus:outline-none focus:border-purple-500 mb-3 px-2 py-1"
            placeholder="Enter text..."
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: textColor }}
              ></button>
              <input
                type="range"
                min="12"
                max="48"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-24"
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setTextElements(textElements.filter(el => el.id !== activeTextId));
                  setActiveTextId(null);
                }}
                className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm"
              >
                Delete
              </button>
              <button
                onClick={updateTextElement}
                className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm"
              >
                Apply
              </button>
            </div>
          </div>
          
          {showColorPicker && (
            <div className="mt-3 flex flex-wrap gap-2">
              {colorPalette.map(color => (
                <button
                  key={color}
                  onClick={() => {
                    setTextColor(color);
                    setShowColorPicker(false);
                  }}
                  className="w-8 h-8 rounded-full border-2 border-white"
                  style={{ backgroundColor: color }}
                ></button>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Tools bar */}
      <div className="bg-black p-4 flex justify-between">
        {/* Filter selector */}
        <div className="flex space-x-2 overflow-x-auto pb-2 max-w-[50%]">
          {filterPresets.map(preset => (
            <button
              key={preset.name}
              onClick={() => setFilter(preset.value)}
              className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${
                filter === preset.value 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-800 text-white'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
        
        {/* Tools */}
        <div className="flex space-x-4">
          <button 
            onClick={addTextElement}
            className="text-white flex flex-col items-center text-xs"
          >
            <Type size={20} />
            <span>Text</span>
          </button>
          <button 
            onClick={() => setShowEmojiPicker(true)}
            className="text-white flex flex-col items-center text-xs"
          >
            <Smile size={20} />
            <span>Emoji</span>
          </button>
          <button 
            onClick={toggleEraser}
            className={`flex flex-col items-center text-xs ${
              isErasing ? 'text-red-500' : 'text-white'
            }`}
          >
            <Eraser size={20} />
            <span>Erase</span>
          </button>
          <button 
            onClick={clearAll}
            className="text-white flex flex-col items-center text-xs"
          >
            <X size={20} />
            <span>Clear</span>
          </button>
        </div>
      </div>
      
      {/* Drawing tools */}
      <div className="absolute bottom-20 left-4 z-20 bg-black bg-opacity-80 p-2 rounded-lg flex flex-col space-y-2">
        <input
          type="range"
          min="1"
          max="20"
          value={brushSize}
          onChange={(e) => {
            const size = parseInt(e.target.value);
            setBrushSize(size);
            if (ctxRef.current) {
              ctxRef.current.lineWidth = size;
            }
          }}
          className="w-32"
        />
        <div className="flex flex-wrap gap-1 w-32">
          {['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#ffffff', '#000000'].map(color => (
            <button
              key={color}
              onClick={() => {
                setDrawingColor(color);
                setIsErasing(false);
                if (ctxRef.current) {
                  ctxRef.current.strokeStyle = color;
                  ctxRef.current.globalCompositeOperation = 'source-over';
                }
              }}
              className={`w-6 h-6 rounded-full ${drawingColor === color && !isErasing ? 'ring-2 ring-white' : ''}`}
              style={{ backgroundColor: color }}
            ></button>
          ))}
        </div>
      </div>
      
      {/* Emoji picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-20 right-0 z-40">
          <div className="fixed inset-0 bg-transparent" onClick={() => setShowEmojiPicker(false)}></div>
          <div className="relative">
            <EmojiPicker
              onEmojiClick={addSticker}
              width={300}
              height={400}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryEffects;
