export interface User {
  id: string;
  username: string;
  email?: string;
  password?: string;
  avatar?: string;
  online: boolean;
  bio?: string;
  spotify?: {
    connected: boolean;
    isPlaying: boolean;
    songTitle?: string;
    artist?: string;
    albumArt?: string;
  };
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
}

export interface Attachment {
  id: string;
  messageId: string;
  type: "image" | "file" | "video" | "document" | "audio" | "other";
  url: string;
  filename?: string;
  size?: number;
}

export interface Message {
  id: string;
  conversationId: string;
  sender: User;
  attachments?: Attachment[];
  content: string; // markdown
  createdAt: number; // timestamp
  readBy?: string[];
  status?: "sent" | "delivered" | "read";
}

export interface Conversation {
  id: string;
  type: "private" | "group";
  participants: User[];
  lastMessage?: Message;
  unreadCount?: number;
  updatedAt: number; // timestamp
  musicSession?: {
    songTitle: string;
    artist: string;
    albumArt: string;
    isPlaying: boolean;
    listeners: string[]; // User IDs
  };
}

export interface IResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
