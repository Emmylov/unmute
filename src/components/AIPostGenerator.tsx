import React, { useState } from 'react';
import { Clipboard, Sparkles, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { CAUSES } from '../utils/data';

interface AIPostGeneratorProps {
  onClose: () => void;
  onSelectContent: (content: string) => void;
}

const AIPostGenerator = ({ onClose, onSelectContent }: AIPostGeneratorProps) => {
  const { currentUser } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [cause, setCause] = useState('');
  const [tone, setTone] = useState('inspirational');
  const [length, setLength] = useState('medium');
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [result, setResult] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Default prompt based on user's followed causes
    if (currentUser?.followingCauses?.length > 0) {
      const userCause = CAUSES.find(c => c.id === currentUser.followingCauses[0]);
      if (userCause) {
        setPrompt(`A post about ${userCause.name} and its importance`);
        setCause(userCause.id);
      }
    }
  }, [currentUser]);

  const generatePost = async () => {
    if (!prompt) {
      toast.error('Please enter a topic for your post');
      return;
    }

    setIsGenerating(true);
    setResult('');

    try {
      // In a real implementation, this would call the OpenAI API
      // For now, we'll simulate a response based on the prompt and settings
      
      const delay = Math.floor(Math.random() * 2000) + 1000; // Simulate API delay
      
      setTimeout(() => {
        let response = generateSimulatedResponse(prompt, cause, tone, length, includeHashtags);
        setResult(response);
        setIsGenerating(false);
      }, delay);
      
    } catch (error) {
      console.error('Error generating post:', error);
      toast.error('Failed to generate post content');
      setIsGenerating(false);
    }
  };
  
  const generateSimulatedResponse = (
    prompt: string, 
    cause: string, 
    tone: string, 
    length: string,
    includeHashtags: boolean
  ): string => {
    // Get cause info if selected
    const causeInfo = CAUSES.find(c => c.id === cause);
    
    // Base content templates by tone
    const toneTemplates: Record<string, string[]> = {
      inspirational: [
        "Today, I'm reflecting on the power each of us holds to make a difference. When we come together with purpose and passion, there's nothing we can't achieve.",
        "The greatest changes begin with the smallest actions. Let's commit to being the change we wish to see in our world.",
        "Never underestimate your ability to inspire others. Your voice matters, your actions count, and your commitment can spark a movement."
      ],
      informative: [
        "Did you know that collective action has been shown to be 3x more effective than individual efforts? This is why community organizing remains essential for sustainable change.",
        "Understanding the root causes of issues is the first step toward creating meaningful solutions. Here's what we need to know about this challenge.",
        "The data is clear: when we invest in preventative measures, we see exponentially better outcomes. Here's what the research tells us."
      ],
      personal: [
        "I wanted to share something that's been on my mind lately. My journey with this cause began when I witnessed firsthand how it affects real people in our communities.",
        "Sometimes the most meaningful connections happen when we share our authentic experiences. Here's my story and why this matters to me personally.",
        "The reason I'm so passionate about this issue comes from a deeply personal place. Let me tell you about my experience."
      ],
      urgent: [
        "We can't afford to wait any longer. The time for meaningful action is now, and here's why everyone needs to pay attention.",
        "This is a critical moment that requires immediate attention and action from all of us. Here's what's at stake and why we need to act now.",
        "The window for effective action is closing. Here's what we stand to lose if we don't mobilize immediately."
      ]
    };
    
    // Select a random template based on tone
    const templates = toneTemplates[tone] || toneTemplates.inspirational;
    let content = templates[Math.floor(Math.random() * templates.length)];
    
    // Add cause-specific content if a cause was selected
    if (causeInfo) {
      const causeStatements = [
        `${causeInfo.name} isn't just a cause—it's a commitment to creating a better future for all of us.`,
        `When we talk about ${causeInfo.name}, we're really discussing the foundation of a more just and sustainable world.`,
        `${causeInfo.name} represents one of the most pressing challenges of our time, requiring both immediate action and long-term vision.`
      ];
      
      content += "\n\n" + causeStatements[Math.floor(Math.random() * causeStatements.length)];
    }
    
    // Add specific details from the prompt
    if (prompt) {
      const promptResponses = [
        `Speaking of ${prompt}, I believe this is an area where each of us can contribute meaningfully.`,
        `This is especially relevant when we consider ${prompt} and its impact on our communities.`,
        `When I think about ${prompt}, I'm reminded of why I began this journey in the first place.`
      ];
      
      content += "\n\n" + promptResponses[Math.floor(Math.random() * promptResponses.length)];
    }
    
    // Add call to action based on tone
    const callsToAction = {
      inspirational: "What small step will you take today to make a difference? Share in the comments!",
      informative: "If you found this information valuable, consider sharing it with others who might benefit.",
      personal: "I'd love to hear your experiences with this issue. Please share in the comments below.",
      urgent: "Tag someone who needs to see this, and share what actions you're taking in response."
    };
    
    content += "\n\n" + (callsToAction[tone as keyof typeof callsToAction] || callsToAction.inspirational);
    
    // Add hashtags if requested
    if (includeHashtags) {
      const generalHashtags = ["#MakeADifference", "#SocialImpact", "#Community", "#Advocacy", "#ChangeStartsHere"];
      
      let hashtags = [...generalHashtags];
      
      // Add cause-specific hashtags
      if (causeInfo) {
        const causeHashtags: Record<string, string[]> = {
          climate: ["#ClimateAction", "#SustainableFuture", "#ClimateJustice", "#ProtectOurPlanet"],
          education: ["#EducationForAll", "#LearningMatters", "#QualityEducation", "#KnowledgeIsPower"],
          equality: ["#EqualityMatters", "#HumanRights", "#InclusionMatters", "#DiversityAndInclusion"],
          health: ["#HealthForAll", "#MentalHealthMatters", "#WellnessAdvocate", "#HealthcareEquity"],
          peace: ["#PeaceBuilding", "#ConflictResolution", "#HarmonyNotHate", "#PeacefulFuture"]
        };
        
        const specificHashtags = causeHashtags[causeInfo.id as keyof typeof causeHashtags] || 
          [`#${causeInfo.name.replace(/\s+/g, '')}`, `#Support${causeInfo.name.replace(/\s+/g, '')}`];
        
        hashtags = [...specificHashtags, ...hashtags];
      }
      
      // Select 5 random hashtags
      const selectedHashtags = [];
      while (selectedHashtags.length < 5 && hashtags.length > 0) {
        const randomIndex = Math.floor(Math.random() * hashtags.length);
        selectedHashtags.push(hashtags[randomIndex]);
        hashtags.splice(randomIndex, 1);
      }
      
      content += "\n\n" + selectedHashtags.join(" ");
    }
    
    // Adjust length
    if (length === "short" && content.length > 300) {
      content = content.split("\n\n").slice(0, 2).join("\n\n");
      if (includeHashtags) {
        content += "\n\n" + content.split("\n\n").pop();
      }
    } else if (length === "long" && content.length < 500) {
      const expansions = [
        "This perspective becomes even more important when we consider the broader implications for future generations.",
        "When we zoom out and look at the bigger picture, the interconnectedness of these issues becomes clear.",
        "The beauty of collective action is that it amplifies individual efforts into something truly transformative.",
        "By approaching this with both compassion and strategic thinking, we can address both immediate needs and long-term change."
      ];
      
      content = content.split("\n\n");
      content.splice(1, 0, expansions[Math.floor(Math.random() * expansions.length)]);
      content = content.join("\n\n");
    }
    
    return content;
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

  const handleUseContent = () => {
    onSelectContent(result);
    onClose();
    toast.success('Added to your post!');
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
            <h2 className="text-xl font-bold">AI Post Generator</h2>
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
              What would you like to post about?
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              rows={2}
              placeholder="Enter a topic or idea for your post"
            ></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                <option value="informative">Informative</option>
                <option value="personal">Personal</option>
                <option value="urgent">Urgent</option>
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
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeHashtags"
                checked={includeHashtags}
                onChange={(e) => setIncludeHashtags(e.target.checked)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="includeHashtags" className="ml-2 block text-sm text-gray-700">
                Include relevant hashtags
              </label>
            </div>
          </div>
          
          <button
            onClick={generatePost}
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
                Generate Post
              </>
            )}
          </button>
          
          {result && (
            <div className="border rounded-lg p-4 relative bg-gray-50">
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={copyToClipboard}
                  className="p-2 text-gray-500 hover:text-purple-600 transition-colors"
                  title="Copy to clipboard"
                >
                  <Clipboard size={18} />
                </button>
              </div>
              <h3 className="font-medium mb-2 text-purple-700">Generated Post:</h3>
              <div className="whitespace-pre-wrap text-gray-800 mb-4">
                {result}
              </div>
              <button
                onClick={handleUseContent}
                className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Use This Content
              </button>
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

export default AIPostGenerator;
