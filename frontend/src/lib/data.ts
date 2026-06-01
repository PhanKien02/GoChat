import { User, Conversation, Message, Track } from "./types";

export const currentUser: User = {
  id: "u1",
  username: "Alex Designer",
  email: "alex@example.com",
  password: "123456",
  avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  online: true,
};

export const users: User[] = [
  currentUser,
  {
    id: "u2",
    username: "Sarah Engineer",
    email: "sarah@example.com",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    online: true,
  },
  {
    id: "u3",
    username: "Product Team",
    email: "product@example.com",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    online: false,
  },
  {
    id: "u4",
    username: "Design System Bot",
    email: "bot@example.com",
    avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
    online: true,
  }
];

export const initialMessages: Message[] = [
  {
    id: "m1",
    conversationId: "c1",
    sender: users[1],
    content: "Hey Alex! Have you seen the latest design system updates?",
    createdAt: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    status: "read",
  },
  {
    id: "m2",
    conversationId: "c1",
    sender: currentUser,
    content: "Yes! The new Tailwind configuration looks super clean. I especially love the updated `globals.css` variables.",
    createdAt: Date.now() - 1000 * 60 * 60 * 1.5,
    status: "read",
  },
  {
    id: "m3",
    conversationId: "c1",
    sender: currentUser,
    content: "I'll start integrating it into the chat interface today.",
    createdAt: Date.now() - 1000 * 60 * 60 * 1.4,
    status: "read",
  },
  {
    id: "m4",
    conversationId: "c1",
    sender: users[1],
    content: "Awesome. Let me know if you need any help with the Next.js setup. \n\nHere is a snippet to get you started with the `TooltipProvider`:\n```tsx\n<TooltipProvider>\n  {children}\n</TooltipProvider>\n```",
    createdAt: Date.now() - 1000 * 60 * 30, // 30 mins ago
    status: "read",
  },
];

export const conversations: Conversation[] = [
  {
    id: "c1",
    type: "private",
    participants: [currentUser, users[1]],
    lastMessage: initialMessages[initialMessages.length - 1],
    unreadCount: 0,
    updatedAt: initialMessages[initialMessages.length - 1].createdAt,
  },
  {
    id: "c2",
    type: "group",
    participants: [currentUser, users[1], users[2]],
    lastMessage: {
      id: "m_c2_1",
      conversationId: "c2",
      sender: users[2],
      content: "Can we review the sprint goals tomorrow?",
      createdAt: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
      status: "delivered",
    },
    unreadCount: 2,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24,
  },
  {
    id: "c3",
    type: "private",
    participants: [currentUser, users[3]],
    lastMessage: {
      id: "m_c3_1",
      conversationId: "c3",
      sender: users[3],
      content: "Your UI component has been successfully deployed.",
      createdAt: Date.now() - 1000 * 60 * 60 * 48,
      status: "read",
    },
    unreadCount: 0,
    updatedAt: Date.now() - 1000 * 60 * 60 * 48,
  }
];

export const mockTracks: Track[] = [
  {
    id: "t1",
    title: "Blinding Lights",
    artist: "The Weeknd",
    albumArt: "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36"
  },
  {
    id: "t2",
    title: "Shape of You",
    artist: "Ed Sheeran",
    albumArt: "https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96"
  },
  {
    id: "t3",
    title: "Levitating",
    artist: "Dua Lipa",
    albumArt: "https://i.scdn.co/image/ab67616d0000b273bd26ede1ae69327010d49946"
  },
  {
    id: "t4",
    title: "As It Was",
    artist: "Harry Styles",
    albumArt: "https://i.scdn.co/image/ab67616d0000b273b46f74097655d7f353caab14"
  },
  {
    id: "t5",
    title: "Cruel Summer",
    artist: "Taylor Swift",
    albumArt: "https://i.scdn.co/image/ab67616d0000b273e787cffec20aa2a396a61647"
  }
];
