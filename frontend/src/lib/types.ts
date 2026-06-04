export interface User {
  _id: string;
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
  _id: string;
  title: string;
  artist: string;
  albumArt: string;
}

export interface Attachment {
  _id: string;
  messageId: string;
  type: "image" | "file" | "video" | "document" | "audio" | "other";
  url: string;
  filename?: string;
  size?: number;
}

export interface Message {
  _id: string;
  conversationId: string;
  sender: User;
  attachments?: Attachment[];
  content: string; // markdown
  createdAt: number; // timestamp
  readBy?: string[];
  status?: "sent" | "delivered" | "read";
}

export interface Conversation {
  _id: string;
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

export interface ILoginRequest {
  login: string;
  password: string;
}

export interface ILoginResponse {
  user: User;
  accessToken: string;
}

export interface IRegisterRequest {
  username: string;
  email: string;
  password: string;
}
export interface IResponse<T> {
  isSuccess: boolean;
  message: string;
  code: number,
  data: T;
}
