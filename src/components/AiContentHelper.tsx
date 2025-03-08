import React, { useState, useEffect } from 'react';
import { Clipboard, Sparkles, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { CAUSES } from '../utils/data';

interface AiContentHelperProps {
  contentType: 'caption' | 'ideas' | 'hashtags';
  onClose: () => void;
}

const AiContentHelper = ({ contentType, onClose }: AiContentHelperProps) => {
  const { currentUser } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [cause, setCause] = useState('');
  const [tone, setTone] = useState('inspirational');
  const [length, setLength] = useState('medium');
  const [result, setResult] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Set a default prompt based on content type
  useEffect(() => {
    if (contentType === 'caption') {
      setPrompt('A post about climate change and its effects on communities');
    } else if (contentType === 'ideas') {
      setPrompt('Content ideas related to education advocacy');
    } else if (contentType === 'hashtags') {
      setPrompt('Social justice and equality');
    }
  }, [contentType]);

  const generateContent = async () => {
    if (!prompt) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    setResult('');

    try {
      // In a real implementation, this would call the OpenAI API
      // For now, we'll simulate a response based on the prompt and settings
      
      let response = '';
      const delay = Math.floor(Math.random() * 1000) + 1500; // Simulate API delay
      
      setTimeout(() => {
        if (contentType === 'caption') {
          if (cause === 'climate') {
            response = `🌍 Our planet is calling for help, and we must answer. The climate crisis isn't just about rising temperatures—it's about the communities being displaced, ecosystems collapsing, and futures being erased.

But there's hope in collective action. Today, I'm committed to reducing my carbon footprint by ${getRandomItem(['carpooling', 'using public transit', 'reducing meat consumption', 'planting trees'])}.

What small change will you make today for a better tomorrow? 

#ClimateAction #SustainableFuture #EarthMatters`;
          } else if (cause === 'equality') {
            response = `⚖️ Equality isn't just a concept—it's a fundamental right that shapes our society's foundation. When we fight for equality, we fight for dignity, respect, and opportunity for all.

I believe that ${getRandomItem(['everyone deserves a seat at the table', 'our differences make us stronger', 'diversity leads to better outcomes', 'equal rights are human rights'])}.

Join me in building a more equitable world. Share your story below!

#EqualityMatters #HumanRights #DiversityAndInclusion`;
          } else {
            response = `✨ The challenges we face today require more than just awareness—they demand action. I'm passionate about creating meaningful change through ${getRandomItem(['education', 'advocacy', 'community building', 'policy reform'])}.

Remember: every voice matters, and every action counts. Together, we can build the future we want to see.

What cause are you passionate about? Let me know in the comments!

#SocialImpact #Changemakers #CommunityFirst`;
          }
        } else if (contentType === 'ideas') {
          response = `Content Ideas for Your Platform:

1. "Day in the Life" series showing your activism work
2. Q&A sessions addressing common questions about ${cause || 'your cause'}
3. Interviews with other activists and change-makers
4. Before/After transformation stories highlighting impact
5. Tutorial: "How to Get Involved in ${getRandomItem(['Local Advocacy', 'Climate Action', 'Education Reform', 'Community Building'])}"
6. Myth-busting series about misconceptions in your field
7. Highlight stories of people impacted by your work
8. Share relevant statistics with eye-catching graphics
9. Collaboration posts with complementary creators
10. Behind-the-scenes of planning an event or campaign`;
        } else if (contentType === 'hashtags') {
          response = `Recommended Hashtags:

Popular & Trending:
#SocialJustice #Equality #HumanRights #Advocacy

Topic-Specific:
#EqualOpportunity #DiversityMatters #InclusionMatters #RepresentationMatters

Community-Building:
#CommunityFirst #TogetherForChange #CollectiveAction #Solidarity

Call-to-Action:
#SpeakUp #TakeAction #MakeADifference #BeTheChange

Engagement:
#JoinTheMovement #ShareYourStory #AmplifyVoices`;
        }
        
        setResult(response);
        setIsGenerating(false);
      }, delay);
      
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Failed to generate content. Please try again.');
      setIsGenerating(false);
    }
  };

  const getRandomItem = (items: string[]): string => {
    return items[Math.floor(Math.random() * items.length)];
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result)
      .then(() => {
        setCopied(true);
        toast.success('Copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        toast.error('Failed to copy to clipboard');
      });
  };

  const renderTitle = () => {
    switch (contentType) {
      case 'caption':
        return 'AI Caption Generator';
      case 'ideas':
        return 'Content Ideas Generator';
      case 'hashtags':
        return 'Hashtag Recommendations';
      default:
        return 'AI Assistant';
    }
  };

  if (!currentUser) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden animate-fadeIn">
        <div className="p-6 border-b flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-purple-100 p-2 rounded-lg mr-3">
              <Sparkles size={20} className="text-purple-600" />
            </div>
            <h2 className="text-xl font-bold">{renderTitle()}</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              What would you like to create?
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              rows={3}
              placeholder={`Enter details about your ${contentType === 'caption' ? 'post' : contentType === 'ideas' ? 'content needs' : 'topic for hashtags'}`}
            ></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cause
              </label>
              <select
                value={cause}
                onChange={(e) => setCause(e.target.value)}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Any cause</option>
                {CAUSES.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tone
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="inspirational">Inspirational</option>
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="educational">Educational</option>
                <option value="persuasive">Persuasive</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Length
              </label>
              <select
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="long">Long</option>
              </select>
            </div>
          </div>
          
          <button
            onClick={generateContent}
            disabled={isGenerating || !prompt}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-medium flex items-center justify-center disabled:opacity-50 mb-6"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={20} className="mr-2" />
                Generate {contentType === 'caption' ? 'Caption' : contentType === 'ideas' ? 'Ideas' : 'Hashtags'}
              </>
            )}
          </button>
          
          {result && (
            <div className="border rounded-lg p-4 relative bg-gray-50">
              <div className="absolute top-2 right-2">
                <button
                  onClick={copyToClipboard}
                  className="p-2 text-gray-500 hover:text-purple-600 transition-colors"
                >
                  <Clipboard size={18} />
                </button>
              </div>
              <h3 className="font-medium mb-2 text-purple-700">Generated {contentType}:</h3>
              <div className="whitespace-pre-wrap text-gray-800">
                {result}
              </div>
            </div>
          )}
          
          <div className="mt-4 text-xs text-gray-500 text-center">
            <p>AI-generated content may need review and personalization before posting.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiContentHelper;
