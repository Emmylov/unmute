import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Heart, Megaphone, MessageSquare, Users, Video } from 'lucide-react';

const LandingPage = () => {
  useEffect(() => {
    document.body.classList.add('landing-page');
    return () => {
      document.body.classList.remove('landing-page');
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-purple-600 to-purple-800 text-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Unmute</h1>
        <div className="space-x-4">
          <Link to="/login" className="text-white hover:text-purple-200">Login</Link>
          <Link 
            to="/register" 
            className="bg-white text-purple-700 px-4 py-2 rounded-full font-medium hover:bg-purple-100 transition"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h2 className="text-5xl font-bold mb-6">Make Your Voice Heard</h2>
          <p className="text-xl mb-8">
            Unmute is where activism meets social media. Share your story, connect with causes you care about, and make a real impact—all while having fun.
          </p>
          <Link 
            to="/register" 
            className="bg-white text-purple-700 px-6 py-3 rounded-full font-medium text-lg hover:bg-purple-100 transition inline-flex items-center"
          >
            Get Started <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
        <div className="md:w-1/2">
          <img 
            src="https://images.unsplash.com/photo-1577563908411-5077b6dc7624?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
            alt="People connecting" 
            className="rounded-2xl shadow-2xl"
          />
        </div>
      </section>

      {/* Features */}
      <section className="bg-white text-purple-900 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Express Yourself Through</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-purple-50 p-6 rounded-xl shadow-md hover:transform hover:scale-105 transition duration-300">
              <Video className="text-purple-600 mb-4 w-12 h-12" />
              <h3 className="text-xl font-bold mb-3">Short-Form Videos</h3>
              <p className="text-gray-700">
                Share dynamic clips that highlight social issues and personal stories that capture attention.
              </p>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-xl shadow-md hover:transform hover:scale-105 transition duration-300">
              <MessageSquare className="text-purple-600 mb-4 w-12 h-12" />
              <h3 className="text-xl font-bold mb-3">Live Streams</h3>
              <p className="text-gray-700">
                Broadcast events, discussions, or Q&A sessions in real-time to foster immediate interaction.
              </p>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-xl shadow-md hover:transform hover:scale-105 transition duration-300">
              <Heart className="text-purple-600 mb-4 w-12 h-12" />
              <h3 className="text-xl font-bold mb-3">Personal Stories</h3>
              <p className="text-gray-700">
                Share narratives about individual experiences to foster empathy and understanding.
              </p>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-xl shadow-md hover:transform hover:scale-105 transition duration-300">
              <Users className="text-purple-600 mb-4 w-12 h-12" />
              <h3 className="text-xl font-bold mb-3">Community Challenges</h3>
              <p className="text-gray-700">
                Participate in initiatives that encourage collective action and amplify impact.
              </p>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-xl shadow-md hover:transform hover:scale-105 transition duration-300">
              <Globe className="text-purple-600 mb-4 w-12 h-12" />
              <h3 className="text-xl font-bold mb-3">Educational Content</h3>
              <p className="text-gray-700">
                Explore social issues through in-depth articles and informative infographics.
              </p>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-xl shadow-md hover:transform hover:scale-105 transition duration-300">
              <Megaphone className="text-purple-600 mb-4 w-12 h-12" />
              <h3 className="text-xl font-bold mb-3">Advocacy Campaigns</h3>
              <p className="text-gray-700">
                Organize and participate in campaigns that drive social change and awareness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join thousands of activists, advocates, and changemakers who are using Unmute to amplify their voice and create meaningful change.
        </p>
        <Link 
          to="/register" 
          className="bg-white text-purple-700 px-8 py-3 rounded-full font-medium text-lg hover:bg-purple-100 transition"
        >
          Join Unmute Today
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-purple-900 py-8">
        <div className="container mx-auto px-4 text-center text-purple-200">
          <p className="mb-4">© 2023 Unmute. All rights reserved.</p>
          <div className="space-x-4">
            <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white">Terms of Service</Link>
            <a href="#" className="hover:text-white">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
