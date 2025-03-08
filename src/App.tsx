import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import './index.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SupabaseProvider } from './contexts/SupabaseContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import CreatePost from './pages/CreatePost';
import Explore from './pages/Explore';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Onboarding from './pages/Onboarding';
import Messages from './pages/Messages';
import Chat from './pages/Chat';
import SingleChat from './pages/SingleChat';
import Reels from './pages/Reels';
import CreateReel from './pages/CreateReel';
import Notifications from './pages/Notifications';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import LiveStreams from './pages/LiveStreams';
import LiveStream from './pages/Livestream';
import CreateLiveStream from './pages/CreateLiveStream';
import EditProfile from './pages/EditProfile';
import CreatorDashboard from './pages/CreatorDashboard';
import CreatePoll from './pages/CreatePoll';
import { initializeData } from './utils/data';
import { AnimatePresence } from 'framer-motion';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
}

function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize app data
    try {
      initializeData();
    } catch (error) {
      console.error("Error initializing data:", error);
    }
    setIsInitialized(true);

    // Load required fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    // Apply font to body
    document.body.style.fontFamily = "'Poppins', 'Inter', sans-serif";
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  if (!isInitialized) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
    </div>;
  }

  return (
    <SupabaseProvider>
      <AuthProvider>
        <Router>
          <Toaster 
            position="top-center" 
            toastOptions={{
              style: {
                background: '#4F46E5',
                color: '#fff',
                borderRadius: '10px',
                padding: '16px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#FFFFFF',
                }
              }
            }}
          />
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/onboarding" element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              } />
              <Route path="/home" element={
                <ProtectedRoute>
                  <Layout>
                    <Home />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/profile/:username" element={
                <ProtectedRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/profile/edit" element={
                <ProtectedRoute>
                  <Layout>
                    <EditProfile />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/create" element={
                <ProtectedRoute>
                  <Layout>
                    <CreatePost />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/poll/create" element={
                <ProtectedRoute>
                  <Layout>
                    <CreatePoll />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/explore" element={
                <ProtectedRoute>
                  <Layout>
                    <Explore />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/messages" element={
                <ProtectedRoute>
                  <Layout>
                    <Messages />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/chat" element={
                <ProtectedRoute>
                  <Layout>
                    <Chat />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/chat/:username" element={
                <ProtectedRoute>
                  <Layout>
                    <SingleChat />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/reels" element={
                <ProtectedRoute>
                  <Layout>
                    <Reels />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/reels/create" element={
                <ProtectedRoute>
                  <Layout>
                    <CreateReel />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/notifications" element={
                <ProtectedRoute>
                  <Layout>
                    <Notifications />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/live" element={
                <ProtectedRoute>
                  <Layout>
                    <LiveStreams />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/live/:streamId" element={
                <ProtectedRoute>
                  <Layout>
                    <LiveStream />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/live/create" element={
                <ProtectedRoute>
                  <Layout>
                    <CreateLiveStream />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/creator" element={
                <ProtectedRoute>
                  <Layout>
                    <CreatorDashboard />
                  </Layout>
                </ProtectedRoute>
              } />
            </Routes>
          </AnimatePresence>
        </Router>
      </AuthProvider>
    </SupabaseProvider>
  );
}

export default App;
