import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  name: string;
  bio: string;
  avatar: string;
  followingCauses: string[];
  followingUsers: string[];
  subscribers: string[];
  interests: string[];
  completedTutorial?: boolean;
  settings?: {
    theme?: string;
    language?: string;
    darkMode?: boolean;
    notificationPreferences?: {
      likes: boolean;
      comments: boolean;
      newFollowers: boolean;
      mentions: boolean;
      directMessages: boolean;
    };
    privacy?: {
      privateAccount: boolean;
      showActivity: boolean;
      allowTagging: boolean;
    };
  };
}

interface AuthContextType {
  currentUser: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, name: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  updateSettings: (settings: Partial<User['settings']>) => void;
  followCause: (cause: string) => void;
  unfollowCause: (cause: string) => void;
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
  subscribeToUser: (userId: string) => void;
  unsubscribeFromUser: (userId: string) => void;
  completeTutorial: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.username === username && u.password === password);
    
    if (user) {
      const { password, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return true;
    }
    
    return false;
  };

  const register = async (username: string, name: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.some((u: any) => u.username === username)) {
      return false;
    }
    
    const newUser = {
      id: `user-${Date.now()}`,
      username,
      name,
      password,
      bio: '',
      avatar: `https://ui-avatars.com/api/?name=${name.replace(/ /g, '+')}&background=random`,
      followingCauses: [],
      followingUsers: [],
      subscribers: [],
      interests: [],
      completedTutorial: false,
      settings: {
        theme: 'purple',
        language: 'en',
        darkMode: false,
        notificationPreferences: {
          likes: true,
          comments: true,
          newFollowers: true,
          mentions: true,
          directMessages: true
        },
        privacy: {
          privateAccount: false,
          showActivity: true,
          allowTagging: true
        }
      }
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    const { password: _, ...userWithoutPassword } = newUser;
    setCurrentUser(userWithoutPassword);
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === currentUser.id);
    
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      localStorage.setItem('users', JSON.stringify(users));
    }
  };
  
  const updateSettings = (settings: Partial<User['settings']>) => {
    if (!currentUser) return;
    
    const currentSettings = currentUser.settings || {};
    const updatedSettings = { ...currentSettings, ...settings };
    
    const updatedUser = { 
      ...currentUser, 
      settings: updatedSettings
    };
    
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === currentUser.id);
    
    if (userIndex !== -1) {
      users[userIndex] = { 
        ...users[userIndex], 
        settings: updatedSettings
      };
      localStorage.setItem('users', JSON.stringify(users));
    }
  };

  const followCause = (cause: string) => {
    if (!currentUser) return;
    
    if (!currentUser.followingCauses.includes(cause)) {
      const updatedCauses = [...currentUser.followingCauses, cause];
      updateProfile({ followingCauses: updatedCauses });
    }
  };

  const unfollowCause = (cause: string) => {
    if (!currentUser) return;
    
    const updatedCauses = currentUser.followingCauses.filter(c => c !== cause);
    updateProfile({ followingCauses: updatedCauses });
  };
  
  const followUser = (userId: string) => {
    if (!currentUser || userId === currentUser.id) return;
    
    if (!currentUser.followingUsers.includes(userId)) {
      const updatedFollowing = [...currentUser.followingUsers, userId];
      updateProfile({ followingUsers: updatedFollowing });
      
      // Update the followed user's subscribers list
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === userId);
      if (userIndex !== -1) {
        if (!users[userIndex].subscribers) {
          users[userIndex].subscribers = [];
        }
        users[userIndex].subscribers.push(currentUser.id);
        localStorage.setItem('users', JSON.stringify(users));
      }
    }
  };
  
  const unfollowUser = (userId: string) => {
    if (!currentUser) return;
    
    const updatedFollowing = currentUser.followingUsers.filter(id => id !== userId);
    updateProfile({ followingUsers: updatedFollowing });
    
    // Update the unfollowed user's subscribers list
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === userId);
    if (userIndex !== -1 && users[userIndex].subscribers) {
      users[userIndex].subscribers = users[userIndex].subscribers.filter((id: string) => id !== currentUser.id);
      localStorage.setItem('users', JSON.stringify(users));
    }
  };
  
  const subscribeToUser = (userId: string) => {
    // Subscription is similar to following, but might have additional features in a real app
    followUser(userId);
  };
  
  const unsubscribeFromUser = (userId: string) => {
    unfollowUser(userId);
  };
  
  const completeTutorial = () => {
    updateProfile({ completedTutorial: true });
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    updateProfile,
    updateSettings,
    followCause,
    unfollowCause,
    followUser,
    unfollowUser,
    subscribeToUser,
    unsubscribeFromUser,
    completeTutorial
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
