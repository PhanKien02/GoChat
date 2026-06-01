"use client"

import { useEffect } from "react";
import { Sidebar } from "@/components/chat/sidebar";
import { ChatArea } from "@/components/chat/chat-area";
import { RightSidebar } from "@/components/chat/right-sidebar";
import { UserSettingsModal } from "@/components/chat/user-settings-modal";
import { VideoCall } from "@/components/chat/video-call";
import { NewChatModal } from "@/components/chat/new-chat-modal";
import { MusicSearchModal } from "@/components/chat/music-search-modal";
import { useChatStore } from "@/store/chatStore";
import { useAuthStore } from "@/store/authStore";
import { User } from "@/lib/types";

export function ChatApp({ initialUser }: { initialUser: User }) {
  useEffect(() => {
    useAuthStore.getState().setUser(initialUser);
  }, [initialUser]);

  const { conversations, activeConversationId } = useChatStore();
  const activeConversation = conversations.find(c => c.id === activeConversationId);

  return (
    <main className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <Sidebar />
      <ChatArea conversation={activeConversation} />
      <RightSidebar conversation={activeConversation} />
      <UserSettingsModal />
      <VideoCall />
      <NewChatModal />
      <MusicSearchModal />
    </main>
  );
}
