import { create } from "zustand";
import { Conversation, Message, User, Track, Attachment } from "@/lib/types";
import {
  conversations as mockConversations,
  initialMessages,
} from "@/lib/data";
import api from "@/lib/api";
import { useAuthStore } from "./authStore";

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string;
  messages: Record<string, Message[]>;
  isRightSidebarOpen: boolean;
  isUserSettingsOpen: boolean;
  isVideoCallOpen: boolean;
  isNewChatModalOpen: boolean;
  isLoading: boolean;
  error: string | null;

  setActiveConversation: (id: string) => void;
  sendMessage: (
    content: string,
    conversationId: string,
    attachments?: Attachment[],
  ) => void;
  toggleRightSidebar: () => void;
  toggleUserSettings: (open?: boolean) => void;
  setVideoCallOpen: (open: boolean) => void;
  toggleNewChatModal: (open?: boolean) => void;
  createConversation: (selectedUsers: User[]) => void;

  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessageApi: (
    content: string,
    conversationId: string,
    attachments?: Attachment[],
  ) => Promise<void>;
  clearStore: () => void;

  isMusicSearchModalOpen: boolean;
  activeMusicConversationId: string | null;
  openMusicSearchModal: (conversationId: string) => void;
  closeMusicSearchModal: () => void;
  startMusicSession: (conversationId: string, track: Track) => void;
  toggleMusicPlay: (conversationId: string) => void;
  endMusicSession: (conversationId: string) => void;
}

// Prepare initial messages dictionary from mock data
const initialMessagesDict: Record<string, Message[]> = {
  c1: initialMessages,
  c2: mockConversations.find((c) => c._id === "c2")?.lastMessage
    ? [mockConversations.find((c) => c._id === "c2")!.lastMessage!]
    : [],
  c3: mockConversations.find((c) => c._id === "c3")?.lastMessage
    ? [mockConversations.find((c) => c._id === "c3")!.lastMessage!]
    : [],
};

export const useChatStore = create<ChatState>((set) => ({
  conversations: mockConversations,
  activeConversationId: "c1",
  messages: initialMessagesDict,
  isRightSidebarOpen: false,
  isUserSettingsOpen: false,
  isVideoCallOpen: false,
  isNewChatModalOpen: false,
  isLoading: false,
  error: null,
  isMusicSearchModalOpen: false,
  activeMusicConversationId: null,

  setActiveConversation: (id: string) => set({ activeConversationId: id }),
  toggleRightSidebar: () =>
    set((state) => ({ isRightSidebarOpen: !state.isRightSidebarOpen })),
  toggleUserSettings: (open?: boolean) =>
    set((state) => ({
      isUserSettingsOpen: open !== undefined ? open : !state.isUserSettingsOpen,
    })),
  setVideoCallOpen: (open) => set({ isVideoCallOpen: open }),
  toggleNewChatModal: (open?: boolean) =>
    set((state) => ({
      isNewChatModalOpen: open !== undefined ? open : !state.isNewChatModalOpen,
    })),

  createConversation: (selectedUsers: User[]) =>
    set((state) => {
      const currentUser = useAuthStore.getState().user;
      if (!currentUser) return state;

      const newConversation: Conversation = {
        _id: `c${Date.now()}`,
        participants: [currentUser, ...selectedUsers],
        type: selectedUsers.length > 1 ? "group" : "private",
        unreadCount: 0,
        updatedAt: Date.now(),
      };
      return {
        conversations: [newConversation, ...state.conversations],
        activeConversationId: newConversation._id,
        isNewChatModalOpen: false,
        messages: { ...state.messages, [newConversation._id]: [] },
      };
    }),

  openMusicSearchModal: (conversationId: string) =>
    set({
      isMusicSearchModalOpen: true,
      activeMusicConversationId: conversationId,
    }),

  closeMusicSearchModal: () =>
    set({
      isMusicSearchModalOpen: false,
      activeMusicConversationId: null,
    }),

  startMusicSession: (conversationId: string, track: Track) =>
    set((state) => {
      const currentUser = useAuthStore.getState().user;
      if (!currentUser) return state;

      return {
        conversations: state.conversations.map((c) =>
          c._id === conversationId
            ? {
                ...c,
                musicSession: {
                  songTitle: track.title,
                  artist: track.artist,
                  albumArt: track.albumArt,
                  isPlaying: true,
                  listeners: [currentUser._id],
                },
              }
            : c,
        ),
        isMusicSearchModalOpen: false,
        activeMusicConversationId: null,
      };
    }),

  toggleMusicPlay: (conversationId: string) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c._id === conversationId && c.musicSession
          ? {
              ...c,
              musicSession: {
                ...c.musicSession,
                isPlaying: !c.musicSession.isPlaying,
              },
            }
          : c,
      ),
    })),

  endMusicSession: (conversationId: string) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c._id === conversationId
          ? {
              ...c,
              musicSession: undefined,
            }
          : c,
      ),
    })),

  sendMessage: (
    content: string,
    conversationId: string,
    attachments?: Attachment[],
  ) =>
    set((state) => {
      const currentUser = useAuthStore.getState().user;
      if (!currentUser) return state;

      const newMessage: Message = {
        _id: `m${Date.now()}`,
        conversationId,
        sender: currentUser,
        content,
        attachments,
        createdAt: Date.now(),
        status: "sent",
      };

      const updatedMessages = {
        ...state.messages,
        [conversationId]: [
          ...(state.messages[conversationId] || []),
          newMessage,
        ],
      };

      const updatedConversations = state.conversations.map((conv) => {
        if (conv._id === conversationId) {
          return {
            ...conv,
            lastMessage: newMessage,
            updatedAt: newMessage.createdAt,
          };
        }
        return conv;
      });

      // Sort conversations by updatedAt descending to bubble active chats to top
      updatedConversations.sort((a, b) => b.updatedAt - a.updatedAt);

      return {
        messages: updatedMessages,
        conversations: updatedConversations,
      };
    }),

  fetchConversations: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get("/conversations");
      set({ conversations: response.data, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch conversations",
        isLoading: false,
      });
    }
  },

  fetchMessages: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/conversations/${id}/messages`);
      set((state) => ({
        messages: {
          ...state.messages,
          [id]: response.data,
        },
        isLoading: false,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch messages",
        isLoading: false,
      });
    }
  },

  sendMessageApi: async (
    content: string,
    conversationId: string,
    attachments?: Attachment[],
  ) => {
    try {
      const payload = { content, conversationId, attachments };
      const response = await api.post(`/messages`, payload);
      const newMessage = response.data;

      set((state) => {
        const updatedMessages = {
          ...state.messages,
          [conversationId]: [
            ...(state.messages[conversationId] || []),
            newMessage,
          ],
        };

        const updatedConversations = state.conversations.map((conv) => {
          if (conv._id === conversationId) {
            return {
              ...conv,
              lastMessage: newMessage,
              updatedAt: newMessage.createdAt,
            };
          }
          return conv;
        });

        updatedConversations.sort((a, b) => b.updatedAt - a.updatedAt);

        return {
          messages: updatedMessages,
          conversations: updatedConversations,
        };
      });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to send message",
      });
    }
  },

  clearStore: () => {
    set({
      conversations: [],
      messages: {},
      activeConversationId: "",
      error: null,
    });
  },
}));
