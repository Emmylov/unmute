export interface Post {
  id: string;
  userId: string;
  username: string;
  name: string;
  userAvatar: string;
  content: string;
  image?: string;
  cause: string;
  likes: string[];
  comments: Comment[];
  createdAt: number;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  content: string;
  createdAt: number;
}

export interface ReelComment {
  id: string;
  userId: string;
  username: string;
  userAvatar?: string;
  content: string;
  createdAt: number;
}

export interface Reel {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  audio: string;
  likes: number;
  comments: number | ReelComment[];
  likedBy?: string[];
  createdAt: number;
  mediaType?: 'video';
}

export interface LiveStream {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  title: string;
  thumbnailUrl: string;
  viewers: number;
  isLive: boolean;
  startedAt: number;
  cause?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: number;
  read?: boolean;
}

export interface MessageConversation {
  userId: string;
  username: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
}

export interface Notification {
  id: string;
  userId: string;
  fromId: string;
  fromUsername: string;
  fromName: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'reel';
  content: string;
  postId?: string;
  postImage?: string;
  timeAgo: string;
  read: boolean;
  timestamp: number;
}

export interface User {
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
  isCreator?: boolean;
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

// Define Poll interface for our polls feature
export interface Poll {
  id: string;
  userId: string;
  username: string;
  name: string;
  userAvatar: string;
  question: string;
  options: Array<{
    id: string;
    text: string;
    votes: number;
    voters: string[];
  }>;
  cause?: string;
  totalVotes: number;
  isAnonymous?: boolean;
  allowMultipleAnswers: boolean;
  createdAt: number;
  expiresAt: number;
  status: 'active' | 'ended';
}

export const CAUSES = [
  {
    id: 'climate',
    name: 'Climate Action',
    description: 'Fighting climate change and protecting our planet',
    color: 'bg-green-500',
    icon: '🌍'
  },
  {
    id: 'equality',
    name: 'Equality',
    description: 'Promoting equality and fighting discrimination',
    color: 'bg-purple-500',
    icon: '⚖️'
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Access to quality education for all',
    color: 'bg-blue-500',
    icon: '📚'
  },
  {
    id: 'health',
    name: 'Health',
    description: 'Advocating for better healthcare and wellness',
    color: 'bg-red-500',
    icon: '❤️'
  },
  {
    id: 'poverty',
    name: 'End Poverty',
    description: 'Working to eliminate poverty worldwide',
    color: 'bg-yellow-500',
    icon: '🏠'
  },
  {
    id: 'peace',
    name: 'Peace',
    description: 'Building peaceful and inclusive societies',
    color: 'bg-teal-500',
    icon: '☮️'
  },
  {
    id: 'animal_rights',
    name: 'Animal Rights',
    description: 'Protecting animals and fighting against cruelty',
    color: 'bg-orange-500',
    icon: '🐾'
  },
  {
    id: 'lgbtq',
    name: 'LGBTQ+ Rights',
    description: 'Supporting equality and inclusion for all identities',
    color: 'bg-pink-500',
    icon: '🏳️‍🌈'
  },
  {
    id: 'water',
    name: 'Clean Water',
    description: 'Ensuring access to clean water worldwide',
    color: 'bg-blue-400',
    icon: '💧'
  },
  {
    id: 'food_security',
    name: 'Food Security',
    description: 'Working to end hunger and improve food systems',
    color: 'bg-amber-600',
    icon: '🌽'
  },
  {
    id: 'disability_rights',
    name: 'Disability Rights',
    description: 'Advocating for accessibility and inclusion',
    color: 'bg-indigo-500',
    icon: '♿'
  },
  {
    id: 'mental_health',
    name: 'Mental Health',
    description: 'Raising awareness and improving mental health support',
    color: 'bg-emerald-500',
    icon: '🧠'
  },
  {
    id: 'womens_rights',
    name: 'Women\'s Rights',
    description: 'Advocating for gender equality and women\'s empowerment',
    color: 'bg-pink-600',
    icon: '👩'
  },
  {
    id: 'racial_justice',
    name: 'Racial Justice',
    description: 'Fighting racism and promoting racial equality',
    color: 'bg-amber-800',
    icon: '✊🏿'
  },
  {
    id: 'refugee_support',
    name: 'Refugee Support',
    description: 'Supporting refugees and displaced persons',
    color: 'bg-blue-700',
    icon: '🏠'
  },
  {
    id: 'indigenous_rights',
    name: 'Indigenous Rights',
    description: 'Supporting indigenous communities and their rights',
    color: 'bg-yellow-700',
    icon: '🏞️'
  },
  {
    id: 'ocean_conservation',
    name: 'Ocean Conservation',
    description: 'Protecting marine ecosystems and combating pollution',
    color: 'bg-cyan-600',
    icon: '🌊'
  },
  {
    id: 'forest_protection',
    name: 'Forest Protection',
    description: 'Preserving forests and biodiversity',
    color: 'bg-green-700',
    icon: '🌳'
  }
];

// Interests for user profiles
export const INTERESTS = [
  'Advocacy', 'Volunteering', 'Fundraising', 'Community Organizing', 
  'Policy Reform', 'Education', 'Awareness', 'Direct Action',
  'Documentary', 'Writing', 'Social Media', 'Art & Creativity',
  'Technology', 'Innovation', 'Sports', 'Music', 'Film', 'Literature',
  'Science', 'Health & Wellness', 'Sustainable Living', 'Travel',
  'Photography', 'Public Speaking', 'Journalism', 'Local Politics',
  'International Affairs', 'Economics', 'History', 'Philosophy'
];

// Helper functions to work with localStorage for posts
export const getPosts = (): Post[] => {
  try {
    return JSON.parse(localStorage.getItem('posts') || '[]');
  } catch (error) {
    console.error('Error parsing posts from localStorage:', error);
    return [];
  }
};

export const savePost = (post: Post): void => {
  try {
    const posts = getPosts();
    posts.unshift(post);
    localStorage.setItem('posts', JSON.stringify(posts));
  } catch (error) {
    console.error('Error saving post to localStorage:', error);
  }
};

export const likePost = (postId: string, userId: string): void => {
  try {
    const posts = getPosts();
    const postIndex = posts.findIndex(p => p.id === postId);
    
    if (postIndex !== -1) {
      const post = posts[postIndex];
      if (post.likes.includes(userId)) {
        post.likes = post.likes.filter(id => id !== userId);
      } else {
        post.likes.push(userId);
      }
      localStorage.setItem('posts', JSON.stringify(posts));
    }
  } catch (error) {
    console.error('Error liking post:', error);
  }
};

export const addComment = (postId: string, comment: Comment): void => {
  try {
    const posts = getPosts();
    const postIndex = posts.findIndex(p => p.id === postId);
    
    if (postIndex !== -1) {
      posts[postIndex].comments.push(comment);
      localStorage.setItem('posts', JSON.stringify(posts));
    }
  } catch (error) {
    console.error('Error adding comment:', error);
  }
};

// Functions for Polls
export const getPolls = (): Poll[] => {
  try {
    return JSON.parse(localStorage.getItem('polls') || '[]');
  } catch (error) {
    console.error('Error parsing polls from localStorage:', error);
    return [];
  }
};

export const savePoll = (poll: Poll): void => {
  try {
    const polls = getPolls();
    polls.unshift(poll);
    localStorage.setItem('polls', JSON.stringify(polls));
  } catch (error) {
    console.error('Error saving poll to localStorage:', error);
  }
};

// Functions for Reels
export const getReels = (): Reel[] => {
  try {
    const reels = JSON.parse(localStorage.getItem('reels') || '[]');
    if (reels.length === 0) {
      // Initialize with sample data if empty - using freely available MP4 files
      const sampleReels = [
        {
          id: 'reel-1',
          userId: 'user-1',
          username: 'climate_warrior',
          userAvatar: 'https://ui-avatars.com/api/?name=CW&background=random',
          videoUrl: 'https://cdn.coverr.co/videos/coverr-trees-in-forest-2371/1080p.mp4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
          caption: 'Protecting our planet starts with understanding the connection between climate and nature 🌍',
          audio: 'Original Audio - climate_warrior',
          likes: 342,
          comments: [],
          likedBy: [],
          createdAt: Date.now() - 3600000,
          mediaType: 'video'
        },
        {
          id: 'reel-2',
          userId: 'user-2',
          username: 'education_matters',
          userAvatar: 'https://ui-avatars.com/api/?name=EM&background=random',
          videoUrl: 'https://cdn.coverr.co/videos/coverr-girl-reading-a-book-1573/1080p.mp4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
          caption: 'Education is the most powerful weapon we can use to change the world 📚 #EducationForAll',
          audio: 'Inspiring Music - Popular Track',
          likes: 278,
          comments: [],
          likedBy: [],
          createdAt: Date.now() - 7200000,
          mediaType: 'video'
        },
        {
          id: 'reel-3',
          userId: 'user-3',
          username: 'equality_now',
          userAvatar: 'https://ui-avatars.com/api/?name=EN&background=random',
          videoUrl: 'https://cdn.coverr.co/videos/coverr-diverse-group-of-women-9595/1080p.mp4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1570039080451-9c6bf33a5719?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
          caption: 'Equal rights for others does not mean fewer rights for you. It\'s not pie. ⚖️',
          audio: 'Speech Excerpt - Human Rights Conference',
          likes: 523,
          comments: [],
          likedBy: [],
          createdAt: Date.now() - 10800000,
          mediaType: 'video'
        },
        {
          id: 'reel-4',
          userId: 'user-4',
          username: 'health_advocate',
          userAvatar: 'https://ui-avatars.com/api/?name=HA&background=random',
          videoUrl: 'https://cdn.coverr.co/videos/coverr-woman-meditating-410/1080p.mp4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
          caption: 'Mental health is just as important as physical health. Take care of your whole self ❤️ #SelfCare',
          audio: 'Calm Meditation - Wellness',
          likes: 198,
          comments: [],
          likedBy: [],
          createdAt: Date.now() - 14400000,
          mediaType: 'video'
        },
        {
          id: 'reel-5',
          userId: 'user-5',
          username: 'peace_builder',
          userAvatar: 'https://ui-avatars.com/api/?name=PB&background=random',
          videoUrl: 'https://cdn.coverr.co/videos/coverr-sunset-over-the-ocean-9493/1080p.mp4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
          caption: 'Peace begins with a smile. Let\'s create a world of compassion and understanding ☮️',
          audio: 'Peaceful Sounds - Nature Mix',
          likes: 412,
          comments: [],
          likedBy: [],
          createdAt: Date.now() - 18000000,
          mediaType: 'video'
        }
      ];
      localStorage.setItem('reels', JSON.stringify(sampleReels));
      return sampleReels;
    }
    return reels;
  } catch (error) {
    console.error('Error parsing reels from localStorage:', error);
    return [];
  }
};

export const saveReel = (reel: Reel): void => {
  try {
    const reels = getReels();
    reels.unshift(reel);
    localStorage.setItem('reels', JSON.stringify(reels));
  } catch (error) {
    console.error('Error saving reel to localStorage:', error);
  }
};

export const likeReel = (reelId: string, userId: string): void => {
  try {
    const reels = getReels();
    const reelIndex = reels.findIndex(r => r.id === reelId);
    
    if (reelIndex !== -1) {
      const reel = reels[reelIndex];
      
      // Initialize likedBy array if it doesn't exist
      if (!Array.isArray(reel.likedBy)) {
        reel.likedBy = [];
      }
      
      const isLiked = reel.likedBy.includes(userId);
      
      if (isLiked) {
        // Unlike
        reel.likedBy = reel.likedBy.filter(id => id !== userId);
        if (typeof reel.likes === 'number') {
          reel.likes = Math.max(0, reel.likes - 1);
        }
      } else {
        // Like
        reel.likedBy.push(userId);
        if (typeof reel.likes === 'number') {
          reel.likes += 1;
        } else {
          reel.likes = 1;
        }
      }
      
      localStorage.setItem('reels', JSON.stringify(reels));
    }
  } catch (error) {
    console.error('Error liking reel:', error);
  }
};

export const addReelComment = (reelId: string, comment: ReelComment): void => {
  try {
    const reels = getReels();
    const reelIndex = reels.findIndex(r => r.id === reelId);
    
    if (reelIndex !== -1) {
      const reel = reels[reelIndex];
      
      // Initialize comments array if it's not already an array
      if (!Array.isArray(reel.comments)) {
        reel.comments = [];
      }
      
      (reel.comments as ReelComment[]).push(comment);
      localStorage.setItem('reels', JSON.stringify(reels));
    }
  } catch (error) {
    console.error('Error adding comment to reel:', error);
  }
};

// Functions for Livestreams
export const getLiveStreams = (): LiveStream[] => {
  try {
    const streams = JSON.parse(localStorage.getItem('livestreams') || '[]');
    if (streams.length === 0) {
      // Initialize with sample data if empty
      const sampleStreams = [
        {
          id: 'stream-1',
          userId: 'user-1',
          username: 'climate_warrior',
          userAvatar: 'https://ui-avatars.com/api/?name=CW&background=random',
          title: 'Live from NYC Climate March',
          thumbnailUrl: 'https://images.unsplash.com/photo-1572204292164-b35ba943fca7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
          viewers: 342,
          isLive: true,
          startedAt: Date.now() - 1800000,
          cause: 'climate'
        },
        {
          id: 'stream-2',
          userId: 'user-2',
          username: 'education_matters',
          userAvatar: 'https://ui-avatars.com/api/?name=EM&background=random',
          title: 'Q&A: Improving Access to Education',
          thumbnailUrl: 'https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
          viewers: 127,
          isLive: true,
          startedAt: Date.now() - 3600000,
          cause: 'education'
        },
        {
          id: 'stream-3',
          userId: 'user-3',
          username: 'equality_now',
          userAvatar: 'https://ui-avatars.com/api/?name=EN&background=random',
          title: 'Discussion on Gender Equality in the Workplace',
          thumbnailUrl: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
          viewers: 215,
          isLive: true,
          startedAt: Date.now() - 5400000,
          cause: 'equality'
        }
      ];
      localStorage.setItem('livestreams', JSON.stringify(sampleStreams));
      return sampleStreams;
    }
    return streams;
  } catch (error) {
    console.error('Error parsing livestreams from localStorage:', error);
    return [];
  }
};

export const createLiveStream = (stream: LiveStream): void => {
  try {
    const streams = getLiveStreams();
    streams.unshift(stream);
    localStorage.setItem('livestreams', JSON.stringify(streams));
  } catch (error) {
    console.error('Error creating livestream:', error);
  }
};

export const endLiveStream = (streamId: string): void => {
  try {
    const streams = getLiveStreams();
    const streamIndex = streams.findIndex(s => s.id === streamId);
    
    if (streamIndex !== -1) {
      streams[streamIndex].isLive = false;
      localStorage.setItem('livestreams', JSON.stringify(streams));
    }
  } catch (error) {
    console.error('Error ending livestream:', error);
  }
};

// Message functions
export const getMessages = (userId: string): MessageConversation[] => {
  try {
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    const conversations: Record<string, { messages: Message[], user: any }> = {};
    
    // Group messages by conversation partner
    messages.forEach((msg: Message) => {
      if (msg.senderId === userId) {
        if (!conversations[msg.receiverId]) {
          conversations[msg.receiverId] = { messages: [], user: null };
        }
        conversations[msg.receiverId].messages.push(msg);
      } else if (msg.receiverId === userId) {
        if (!conversations[msg.senderId]) {
          conversations[msg.senderId] = { messages: [], user: null };
        }
        conversations[msg.senderId].messages.push(msg);
      }
    });
    
    // Get user info for each conversation
    const users = getUsers();
    Object.keys(conversations).forEach(partnerId => {
      conversations[partnerId].user = users.find(u => u.id === partnerId);
    });
    
    // Format conversations for display
    return Object.entries(conversations)
      .filter(([_, { user }]) => user !== undefined)
      .map(([partnerId, { messages, user }]) => {
        // Sort messages by timestamp
        messages.sort((a, b) => b.timestamp - a.timestamp);
        
        const lastMsg = messages[0];
        const unread = messages.filter(m => m.receiverId === userId && !m.read).length;
        
        return {
          userId: partnerId,
          username: user.username,
          name: user.name,
          avatar: user.avatar,
          lastMessage: lastMsg.content,
          lastMessageTime: formatTimeAgo(lastMsg.timestamp),
          unread
        };
      })
      .sort((a, b) => a.unread > b.unread ? -1 : 1);
  } catch (error) {
    console.error('Error getting messages:', error);
    return [];
  }
};

export const getMessagesByUsername = (userId: string, username: string): { user: any, messages: Message[] } => {
  try {
    const users = getUsers();
    const partner = users.find(u => u.username === username);
    
    if (!partner) {
      return { user: null, messages: [] };
    }
    
    const allMessages = JSON.parse(localStorage.getItem('messages') || '[]');
    
    const messages = allMessages.filter((msg: Message) => 
      (msg.senderId === userId && msg.receiverId === partner.id) ||
      (msg.senderId === partner.id && msg.receiverId === userId)
    ).sort((a: Message, b: Message) => a.timestamp - b.timestamp);
    
    return { user: partner, messages };
  } catch (error) {
    console.error('Error getting messages by username:', error);
    return { user: null, messages: [] };
  }
};

export const sendMessage = (message: Message): void => {
  try {
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    messages.push(message);
    localStorage.setItem('messages', JSON.stringify(messages));
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

// Notification functions
export const getNotifications = (userId: string): Notification[] => {
  try {
    const notifications = JSON.parse(localStorage.getItem(`notifications_${userId}`) || '[]');
    return notifications.sort((a: Notification, b: Notification) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Error getting notifications:', error);
    return [];
  }
};

export const markAsRead = (userId: string, notificationId: string): void => {
  try {
    const notifications = getNotifications(userId);
    const notificationIndex = notifications.findIndex(n => n.id === notificationId);
    
    if (notificationIndex !== -1) {
      notifications[notificationIndex].read = true;
      localStorage.setItem(`notifications_${userId}`, JSON.stringify(notifications));
    }
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
};

export const getUsers = (): any[] => {
  try {
    const usersData = localStorage.getItem('users') || '[]';
    
    // Handle empty or invalid data
    if (!usersData || usersData === 'undefined' || usersData === 'null') {
      return [];
    }
    
    return JSON.parse(usersData).map((user: any) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
};

// Function to get popular creators
export const getPopularCreators = (): User[] => {
  try {
    const users = getUsers().filter(user => user.isCreator);
    // Sort by number of subscribers
    return users.sort((a, b) => (b.subscribers?.length || 0) - (a.subscribers?.length || 0)).slice(0, 10);
  } catch (error) {
    console.error('Error getting popular creators:', error);
    return [];
  }
};

// Function to subscribe/unsubscribe to a creator
export const toggleSubscription = (userId: string, creatorId: string): boolean => {
  try {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Find the user who is subscribing
    const userIndex = users.findIndex((u: any) => u.id === userId);
    if (userIndex === -1) return false;
    
    // Find the creator being subscribed to
    const creatorIndex = users.findIndex((u: any) => u.id === creatorId);
    if (creatorIndex === -1) return false;
    
    // Update user's subscriptions
    if (!users[userIndex].subscribedTo) {
      users[userIndex].subscribedTo = [];
    }
    
    // Initialize subscribers array for creator if it doesn't exist
    if (!users[creatorIndex].subscribers) {
      users[creatorIndex].subscribers = [];
    }
    
    const isSubscribed = users[userIndex].subscribedTo.includes(creatorId);
    
    if (isSubscribed) {
      // Unsubscribe
      users[userIndex].subscribedTo = users[userIndex].subscribedTo.filter((id: string) => id !== creatorId);
      users[creatorIndex].subscribers = users[creatorIndex].subscribers.filter((id: string) => id !== userId);
    } else {
      // Subscribe
      users[userIndex].subscribedTo.push(creatorId);
      users[creatorIndex].subscribers.push(userId);
    }
    
    localStorage.setItem('users', JSON.stringify(users));
    
    // Update currentUser in localStorage if it matches
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (currentUser && currentUser.id === userId) {
      const { password, ...userWithoutPassword } = users[userIndex];
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    }
    
    return !isSubscribed; // Return new subscription status
  } catch (error) {
    console.error('Error toggling subscription:', error);
    return false;
  }
};

export const formatTimeAgo = (timestamp: number): string => {
  const now = new Date().getTime();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
};

// File utilities - convert file to data URL
export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Initialize with sample data if empty
export const initializeData = () => {
  try {
    if (!localStorage.getItem('posts')) {
      localStorage.setItem('posts', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('users')) {
      const defaultUsers = [
        {
          id: 'user-default',
          username: 'demo_user',
          name: 'Demo User',
          password: 'password',
          bio: 'This is a demo account for testing.',
          avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=random',
          followingCauses: ['climate', 'education'],
          followingUsers: [],
          subscribers: [],
          subscribedTo: [],
          interests: ['Advocacy', 'Education'],
          completedTutorial: true,
          isCreator: false
        },
        {
          id: 'creator-1',
          username: 'climate_activist',
          name: 'Climate Activist',
          password: 'password',
          bio: 'Fighting for our planet every day. Join me to make a difference!',
          avatar: 'https://ui-avatars.com/api/?name=Climate+Activist&background=random',
          followingCauses: ['climate', 'ocean_conservation', 'forest_protection'],
          followingUsers: [],
          subscribers: ['user-default'],
          subscribedTo: [],
          interests: ['Advocacy', 'Direct Action', 'Education'],
          completedTutorial: true,
          isCreator: true
        },
        {
          id: 'creator-2',
          username: 'equality_matters',
          name: 'Equality Matters',
          password: 'password',
          bio: 'Working towards a more equal world for everyone.',
          avatar: 'https://ui-avatars.com/api/?name=Equality+Matters&background=random',
          followingCauses: ['equality', 'lgbtq', 'womens_rights', 'racial_justice'],
          followingUsers: [],
          subscribers: [],
          subscribedTo: [],
          interests: ['Community Organizing', 'Policy Reform', 'Education'],
          completedTutorial: true,
          isCreator: true
        }
      ];
      
      localStorage.setItem('users', JSON.stringify(defaultUsers));
    }
    
    // Initialize reels if not already done
    getReels();
    
    // Initialize livestreams if not already done
    getLiveStreams();
    
  } catch (error) {
    console.error('Error initializing data:', error);
  }
};
