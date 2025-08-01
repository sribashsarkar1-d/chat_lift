export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'audio';
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  replyTo?: string;
}

export interface MessageState {
  messages: Record<string, Message[]>;
  loading: boolean;
  error: string | null;
}
