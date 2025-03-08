import { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

// Mock types to maintain compatibility with components
type User = {
  id: string;
  email?: string;
  [key: string]: any;
};

type AuthResponse = {
  data: {
    user: User | null;
  };
  error: Error | null;
};

// Create a mock context that only uses localStorage
interface SupabaseContextType {
  supabase: null; // No actual Supabase client
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<AuthResponse | null>;
  signIn: (email: string, password: string) => Promise<AuthResponse | null>;
  signOut: () => Promise<void>;
  uploadFile: (bucket: string, path: string, file: File) => Promise<string | null>;
  getFileUrl: (bucket: string, path: string) => Promise<string | null>;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
}

export const SupabaseProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Auth functions
  const signUp = async (email: string, password: string, userData: any): Promise<AuthResponse | null> => {
    setLoading(true);
    
    try {
      // Store in localStorage instead of Supabase
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if user exists
      const existingUser = users.find((u: any) => u.email === email);
      if (existingUser) {
        return {
          data: { user: null },
          error: new Error('User already exists')
        };
      }
      
      // Create new user
      const newUser = {
        id: uuidv4(),
        email,
        ...userData,
        created_at: new Date().toISOString()
      };
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      setUser(newUser);
      
      return {
        data: { user: newUser },
        error: null
      };
    } catch (error) {
      console.error('Signup error:', error);
      return {
        data: { user: null },
        error: error instanceof Error ? error : new Error('Unknown error')
      };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<AuthResponse | null> => {
    setLoading(true);
    
    try {
      // Find user in localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => u.email === email);
      
      if (user) {
        setUser(user);
        return {
          data: { user },
          error: null
        };
      } else {
        return {
          data: { user: null },
          error: new Error('Invalid credentials')
        };
      }
    } catch (error) {
      console.error('Signin error:', error);
      return {
        data: { user: null },
        error: error instanceof Error ? error : new Error('Unknown error')
      };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    setUser(null);
  };

  // Storage functions - using base64 and localStorage
  const uploadFile = async (bucket: string, path: string, file: File): Promise<string | null> => {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.onload = () => {
          const fileId = `${bucket}_${path}_${uuidv4()}`;
          const fileData = {
            id: fileId,
            data: reader.result,
            type: file.type,
            name: file.name,
            uploadedAt: new Date().toISOString()
          };
          
          // Save file data to localStorage
          const filesStorage = JSON.parse(localStorage.getItem('uploaded_files') || '{}');
          filesStorage[fileId] = fileData;
          localStorage.setItem('uploaded_files', JSON.stringify(filesStorage));
          
          resolve(fileId);
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      } catch (error) {
        toast.error('Upload failed. Please try again.');
        reject(error);
      }
    });
  };

  const getFileUrl = async (bucket: string, path: string): Promise<string | null> => {
    try {
      // For simplicity, we'll just return a mock URL or the path directly
      // In a real implementation, you'd retrieve the file from localStorage
      
      // Check if we have the file in localStorage
      const filesStorage = JSON.parse(localStorage.getItem('uploaded_files') || '{}');
      const fileId = path; // Use path as fileId
      
      if (filesStorage[fileId]) {
        return filesStorage[fileId].data;
      }
      
      // If not in localStorage, use a placeholder or the path itself
      if (path.includes('avatar')) {
        return `https://ui-avatars.com/api/?name=${path}&background=random`;
      } else {
        return `https://source.unsplash.com/random/800x600?${bucket}`;
      }
    } catch (error) {
      console.error('Error getting file URL:', error);
      return null;
    }
  };

  const value = {
    supabase: null, // No actual Supabase client
    user,
    loading,
    signUp,
    signIn,
    signOut,
    uploadFile,
    getFileUrl,
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
};
