import { Conversation } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Info,
  Phone,
  Video,
  MessageSquare,
  Check,
  CheckCheck,
  Headphones,
  FileText,
  Music,
  Download,
} from "lucide-react";
import { MessageComposer } from "./message-composer";
import { format } from "date-fns";
import { useChatStore } from "@/store/chatStore";
import { useAuthStore } from "@/store/authStore";
import { MusicSessionBanner } from "@/components/chat/music-session-banner";
import Image from "next/image";

interface ChatAreaProps {
  conversation?: Conversation;
}

export function ChatArea({ conversation }: ChatAreaProps) {
  const {
    messages: allMessages,
    isRightSidebarOpen,
    toggleRightSidebar,
    setVideoCallOpen,
    openMusicSearchModal,
  } = useChatStore();
  const currentUser = useAuthStore((state) => state.user);

  if (!conversation || !currentUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-background text-muted-foreground h-full">
        <div className="w-16 h-16 rounded-full bg-sidebar flex items-center justify-center mb-4">
          <MessageSquare size={32} />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          No conversation selected
        </h2>
        <p>Choose a chat from the sidebar or start a new one.</p>
      </div>
    );
  }

  const otherUser =
    conversation.participants.find((p) => p._id !== currentUser._id) ||
    conversation.participants[0];
  const isGroup = conversation.type === "group";
  const title = isGroup
    ? conversation.participants.map((p) => p.username).join(", ")
    : otherUser.username;

  const messages = allMessages[conversation._id] || [];

  return (
    <div className="flex-1 flex flex-col bg-background h-full overflow-hidden relative">
      {/* Header */}
      <header className="h-16 min-h-16 border-b border-border flex items-center justify-between px-6 bg-background/95 backdrop-blur z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <Avatar className="h-10 w-10">
            {isGroup ? (
              <AvatarFallback>G</AvatarFallback>
            ) : (
              <>
                <AvatarImage src={otherUser.avatar} />
                <AvatarFallback>{title.substring(0, 2)}</AvatarFallback>
              </>
            )}
          </Avatar>
          <div>
            <h2 className="font-semibold text-foreground leading-tight">
              {title}
            </h2>
            {!isGroup && (
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                <span
                  className={`w-2 h-2 rounded-full ${otherUser.online ? "bg-green-500" : "bg-muted"}`}
                ></span>
                {otherUser.online ? "Online" : "Offline"}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          <button className="p-2 hover:bg-muted/50 hover:text-foreground transition-colors rounded-xl">
            <Phone size={18} />
          </button>
          <button
            onClick={() => setVideoCallOpen(true)}
            className="p-2 hover:bg-muted/50 hover:text-foreground transition-colors rounded-xl"
          >
            <Video size={18} />
          </button>
          <button
            onClick={() => openMusicSearchModal(conversation._id)}
            className="p-2 hover:bg-muted/50 hover:text-foreground transition-colors rounded-xl"
          >
            <Headphones size={18} />
          </button>
          <div className="w-px h-6 bg-border mx-1"></div>
          <button
            onClick={toggleRightSidebar}
            className={`p-2 transition-colors rounded-xl ${isRightSidebarOpen ? "bg-primary/15 text-primary" : "hover:bg-muted/50 hover:text-foreground"}`}
          >
            <Info size={18} />
          </button>
        </div>
      </header>

      <MusicSessionBanner conversationId={conversation._id} />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
        <div className="text-center my-6">
          <span className="text-[11px] font-medium text-muted-foreground bg-sidebar border border-border px-3 py-1 rounded-full tracking-wide uppercase">
            Today
          </span>
        </div>

        <div className="flex flex-col gap-4">
          {messages.map((msg, idx) => {
            const isMe = msg.sender._id === currentUser._id;
            const showAvatar =
              !isMe &&
              (idx === 0 || messages[idx - 1].sender._id !== msg.sender._id);

            return (
              <div
                key={msg._id}
                className={`flex gap-3 max-w-[80%] ${isMe ? "self-end flex-row-reverse" : "self-start"}`}
              >
                {!isMe ? (
                  <div className="w-8 shrink-0">
                    {showAvatar && (
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={msg.sender.avatar} />
                        <AvatarFallback>
                          {msg.sender.username.substring(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ) : null}

                <div
                  className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                >
                  {!isMe && showAvatar && (
                    <span className="text-xs text-muted-foreground mb-1 ml-1">
                      {msg.sender.username}
                    </span>
                  )}

                  {/* Attachments */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div
                      className={`flex flex-col gap-2 mb-1.5 w-full max-w-sm ${isMe ? "items-end" : "items-start"}`}
                    >
                      {msg.attachments.map((att) => {
                        if (att.type === "image") {
                          return (
                            <Image
                              key={att._id}
                              src={att.url}
                              alt="attachment"
                              width={48}
                              height={48}
                              className="rounded-xl max-w-full max-h-64 object-cover shadow-sm border border-border"
                            />
                          );
                        }
                        if (att.type === "video") {
                          return (
                            <video
                              key={att._id}
                              src={att.url}
                              controls
                              className="rounded-xl max-w-full max-h-64 object-cover shadow-sm border border-border"
                            />
                          );
                        }
                        if (att.type === "audio") {
                          return (
                            <div
                              key={att._id}
                              className={`flex items-center gap-3 p-3 rounded-xl border shadow-sm w-full ${isMe ? "bg-primary/20 border-primary/30" : "bg-sidebar border-border"}`}
                            >
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <Music
                                  size={18}
                                  className={
                                    isMe
                                      ? "text-primary"
                                      : "text-muted-foreground"
                                  }
                                />
                              </div>
                              <audio
                                src={att.url}
                                controls
                                className="h-8 w-full max-w-[200px]"
                              />
                            </div>
                          );
                        }
                        return (
                          <div
                            key={att._id}
                            className={`flex items-center gap-3 p-3 rounded-xl border shadow-sm w-full ${isMe ? "bg-primary text-primary-foreground border-primary" : "bg-sidebar text-foreground border-border"}`}
                          >
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isMe ? "bg-black/20" : "bg-muted"}`}
                            >
                              <FileText size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold truncate">
                                {att.filename}
                              </p>
                              <p className="text-xs opacity-80">
                                {att.size
                                  ? (att.size / 1024).toFixed(1) + " KB"
                                  : "File"}
                              </p>
                            </div>
                            <button
                              className={`p-2 shrink-0 rounded-full transition-colors ${isMe ? "hover:bg-black/20" : "hover:bg-muted"}`}
                            >
                              <Download size={18} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {msg.content && (
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                        isMe
                          ? "bg-primary text-primary-foreground rounded-tr-sm"
                          : "bg-sidebar border border-border text-foreground rounded-tl-sm"
                      }`}
                    >
                      {/* Basic Markdown handling for code blocks can be added here, for now simple text */}
                      {msg.content.includes("\n```") ? (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: msg.content.replace(
                              /```tsx\n([\s\S]*?)```/g,
                              '<pre class="bg-black/20 p-2 rounded mt-2 text-sm overflow-x-auto border border-white/10"><code>$1</code></pre>',
                            ),
                          }}
                        />
                      ) : (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      )}
                    </div>
                  )}

                  <div
                    className={`flex items-center gap-1 mt-1 text-[11px] text-muted-foreground ${isMe ? "mr-1" : "ml-1"}`}
                  >
                    <span>{format(msg.createdAt, "HH:mm")}</span>
                    {isMe &&
                      (msg.status === "read" ? (
                        <CheckCheck size={14} className="text-blue-500" />
                      ) : (
                        <Check size={14} />
                      ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Composer */}
      <MessageComposer />
    </div>
  );
}
