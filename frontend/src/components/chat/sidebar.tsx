import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  PlusCircle,
  Settings,
  MessageSquare,
  UserPlus,
  Loader2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useChatStore } from "@/store/chatStore";
import { useAuthStore } from "@/store/authStore";
import { User } from "@/lib/types";
import { useDebounce } from "@/hooks/useDebounce";
import api from "@/lib/api";
import Image from "next/image";

export function Sidebar() {
  const {
    conversations,
    activeConversationId,
    setActiveConversation: onSelect,
    toggleUserSettings,
    toggleNewChatModal,
    createConversation,
  } = useChatStore();
  const currentUser = useAuthStore((state) => state.user);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);

  // Fetch users from API when debounced value changes
  useEffect(() => {
    if (!currentUser?._id || !debouncedSearchQuery.trim()) {
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await api.get(
          `/users/?searchKeyword=${encodeURIComponent(debouncedSearchQuery)}&page=1&limit=10`,
        );
        if (response.data && response.data.isSuccess) {
          const apiUsers = response.data.data || [];
          // Filter out the current user and map backend UserInfo id to _id
          const mappedUsers = apiUsers
            .filter(
              (u: User & { id?: string }) =>
                (u.id || u._id) !== currentUser._id,
            )
            .map((u: User & { id?: string }) => ({
              ...u,
              _id: u.id || u._id || "",
            }));
          setFilteredUsers(mappedUsers);
        }
      } catch (error) {
        console.error("Failed to fetch users from API:", error);
      } finally {
        setIsSearchingUsers(false);
      }
    };

    fetchUsers();
  }, [debouncedSearchQuery, currentUser?._id]);

  if (!currentUser) return null;

  // Filter conversations locally
  const filteredConversations = conversations.filter((conv) => {
    const isGroup = conv.type === "group";
    if (isGroup) {
      return conv.participants.some((p) =>
        p.username.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    } else {
      const otherUser =
        conv.participants.find((p) => p._id !== currentUser._id) ||
        conv.participants[0];
      return otherUser.username
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    }
  });

  const handleSelectUser = (user: User) => {
    // Check if conversation already exists with this user
    const existingConv = conversations.find(
      (c) =>
        c.type === "private" && c.participants.some((p) => p._id === user._id),
    );
    if (existingConv) {
      onSelect(existingConv._id);
    } else {
      createConversation([user]);
    }
    setSearchQuery("");
    setFilteredUsers([]);
    setIsSearchingUsers(false);
  };

  return (
    <aside className="w-80 border-r border-sidebar-border bg-sidebar flex flex-col h-full">
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
            <MessageSquare size={18} aria-hidden="true" />
          </div>
          <span className="font-semibold tracking-tight">GoChat</span>
        </div>
        <button
          onClick={() => toggleNewChatModal(true)}
          className="text-muted-foreground hover:text-foreground transition-colors focus-visible:ring-1 focus-visible:ring-ring rounded-md p-0.5"
          aria-label="New chat"
        >
          <PlusCircle size={20} />
        </button>
      </div>

      <div className="p-3">
        <div className="relative">
          {isSearchingUsers ? (
            <Loader2
              className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground animate-spin"
              aria-hidden="true"
            />
          ) : (
            <Search
              className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
          )}
          <Input
            value={searchQuery}
            onChange={(e) => {
              const val = e.target.value;
              setSearchQuery(val);
              if (val.trim()) {
                setIsSearchingUsers(true);
              } else {
                setIsSearchingUsers(false);
                setFilteredUsers([]);
              }
            }}
            placeholder="Search people or chats…"
            className="pl-9 bg-background border-none focus-visible:ring-1 focus-visible:ring-ring"
            spellCheck={false}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-4">
        {/* Active Conversations Section */}
        {filteredConversations.length > 0 && (
          <div className="space-y-1">
            {searchQuery && (
              <p className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                Active Chats
              </p>
            )}
            {filteredConversations.map((conv) => {
              const otherUser =
                conv.participants.find((p) => p._id !== currentUser._id) ||
                conv.participants[0];
              const isGroup = conv.type === "group";
              const name = isGroup
                ? conv.participants.map((p) => p.username).join(", ")
                : otherUser.username;
              const isActive = conv._id === activeConversationId;

              return (
                <button
                  key={conv._id}
                  onClick={() => {
                    onSelect(conv._id);
                    setSearchQuery("");
                  }}
                  className={`w-full text-left p-3 rounded-xl flex gap-3 items-center transition-all ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "hover:bg-sidebar-accent/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10 border border-background/10">
                      {isGroup ? (
                        <AvatarFallback>G</AvatarFallback>
                      ) : (
                        <>
                          <AvatarImage src={otherUser.avatar} />
                          <AvatarFallback>
                            {name.substring(0, 2)}
                          </AvatarFallback>
                        </>
                      )}
                    </Avatar>
                    {!isGroup && otherUser.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 border-2 border-sidebar bg-green-500 rounded-full"></span>
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <span
                        className={`font-medium truncate ${isActive ? "text-foreground" : "text-foreground/90"}`}
                      >
                        {name}
                      </span>
                      {conv.lastMessage && (
                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                          {formatDistanceToNow(conv.updatedAt, {
                            addSuffix: false,
                          })}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm truncate opacity-80">
                        {conv.lastMessage?.content || "No messages yet"}
                      </span>
                      {conv.unreadCount ? (
                        <Badge
                          variant="default"
                          className="ml-2 h-5 min-w-5 flex items-center justify-center rounded-full px-1.5 py-0 text-[10px]"
                        >
                          {conv.unreadCount}
                        </Badge>
                      ) : null}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Other People Section */}
        {filteredUsers.length > 0 && (
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
              People
            </p>
            {filteredUsers.map((user) => (
              <button
                key={user._id}
                onClick={() => handleSelectUser(user)}
                className="w-full text-left p-3 rounded-xl flex gap-3 items-center hover:bg-sidebar-accent/50 text-muted-foreground hover:text-foreground transition-all"
              >
                <div className="relative">
                  <Avatar className="h-10 w-10 border border-background/10">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>
                      {user.username.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  {user.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 border-2 border-sidebar bg-green-500 rounded-full"></span>
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="font-medium text-foreground truncate">
                    {user.username}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email || "Offline"}
                  </p>
                </div>
                <UserPlus
                  size={16}
                  className="text-muted-foreground group-hover:text-foreground shrink-0"
                />
              </button>
            ))}
          </div>
        )}

        {/* Empty Search State */}
        {searchQuery &&
          filteredConversations.length === 0 &&
          filteredUsers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">
                No results found for &ldquo;{searchQuery}&rdquo;
              </p>
            </div>
          )}
      </div>

      {currentUser.spotify?.connected && currentUser.spotify.isPlaying && (
        <div className="px-3 pb-3 mt-auto">
          <div className="bg-[#1DB954]/10 border border-[#1DB954]/20 rounded-xl p-3 flex gap-3 items-center group relative overflow-hidden">
            <div className="absolute top-1 right-1 p-2 text-[#1DB954]/30 group-hover:text-[#1DB954]/50 transition-colors">
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18V5l12-2v13"></path>
                <circle cx="6" cy="18" r="3"></circle>
                <circle cx="18" cy="16" r="3"></circle>
              </svg>
            </div>

            <div className="relative shrink-0">
              <Image
                src={currentUser.spotify.albumArt || ""}
                alt="Album Art"
                width={40}
                height={40}
                className="w-10 h-10 rounded-md object-cover shadow-sm z-10 relative"
              />
              <div className="absolute inset-0 bg-[#1DB954] rounded-md animate-pulse blur-md z-0 opacity-40"></div>
            </div>

            <div className="flex-1 overflow-hidden z-10 pr-6">
              <p className="text-[10px] font-semibold text-[#1DB954] uppercase tracking-wider mb-0.5 flex items-center gap-1">
                Listening to Spotify
              </p>
              <p className="text-xs font-bold text-foreground truncate">
                {currentUser.spotify.songTitle}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">
                {currentUser.spotify.artist}
              </p>
            </div>
          </div>
        </div>
      )}

      <div
        className={`p-4 border-t border-sidebar-border ${!currentUser.spotify?.connected ? "mt-auto" : ""} flex items-center gap-3 bg-sidebar/50`}
      >
        <Avatar className="h-9 w-9">
          <AvatarImage src={currentUser.avatar} />
          <AvatarFallback>Me</AvatarFallback>
        </Avatar>
        <div className="flex-1 overflow-hidden">
          <p className="text-sm font-medium text-foreground truncate">
            {currentUser.username}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {currentUser.email}
          </p>
        </div>
        <button
          onClick={() => toggleUserSettings(true)}
          className="text-muted-foreground hover:text-foreground"
        >
          <Settings size={18} />
        </button>
      </div>
    </aside>
  );
}
