
export interface Alumni {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  graduationYear: string;
  degree: 'MSc' | 'PhD' | '';
  program: string;
  currentPosition: string;
  company: string;
  location: string;
  salary: string;
  linkedin: string;
  achievements: string[];
  isActive: boolean;
  lastLogin: string;
  joinDate: string;
  skills: string[];
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

export type ModalType = 'view' | 'add' | 'edit';

export type Page = 'dashboard' | 'alumni' | 'analytics' | 'community' | 'messages';

export type ViewMode = 'grid' | 'list';

export type SortBy = 'firstName' | 'graduationYear' | 'company' | 'salary';

export type SortOrder = 'asc' | 'desc';

export interface Comment {
  id: number;
  authorId: number;
  content: string;
  timestamp: string;
}

export interface Post {
  id: number;
  authorId: number;
  content: string;
  timestamp: string;
  likes: number[];
  comments: Comment[];
}

export interface Message {
  id: number;
  authorId: number;
  content: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'voice';
  duration?: string; // e.g., "0:15"
}

export interface Conversation {
  id: number;
  participantIds: number[];
  messages: Message[];
}