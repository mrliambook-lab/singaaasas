export interface Book {
  id: string;
  title: string;
  author: string;
  rating: number;
  description: string;
  genre: string;
  publishYear: number;
  pages: number;
  progress: number; // 0 to 100%
  coverUrl: string;
  coverColor: string; // Gradient or background backup color
  isFavorite: boolean;
  isInLibrary: boolean;
  isTrending: boolean;
  isRecommended: boolean;
  readSampleAvailable: boolean;
  aiQuotes?: string[];
  aiThemes?: string[];
  aiSummary?: string;
  aiReview?: string;
  characters?: string[];
}

export interface Review {
  id: string;
  bookId: string;
  username: string;
  rating: number;
  text: string;
  date: string;
}

export interface Category {
  id: string;
  name: string;
  iconName: string;
  gradientClass: string;
  bookCount: number;
}

export type MobileScreen = 
  | 'splash' 
  | 'home' 
  | 'categories' 
  | 'details' 
  | 'reading' 
  | 'library' 
  | 'profile';

export interface UserStats {
  minutesReadToday: number;
  minutesReadThisWeek: number;
  booksFinished: number;
  dailyStreak: number;
  pagesReadTotal: number;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  membership: 'Free' | 'BookVerse Pro' | 'Elite Reader';
  joinedDate: string;
  stats: UserStats;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'character' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
}
