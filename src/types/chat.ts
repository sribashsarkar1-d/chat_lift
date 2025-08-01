import { Message } from './message';

export interface Chat {
  id: string;
  participants: string[];
  lastMessage: Message;
  unreadCount: number;
  updatedAt: Date;
  type: 'private' | 'group';
  name?: string;
  avatar?: string;
}

export interface ChatState {
  chats: Chat[];
  activeChat: Chat | null;
  loading: boolean;
  error: string | null;
}
