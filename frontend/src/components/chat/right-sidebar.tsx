import { Conversation } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, Search, Bell, Image as ImageIcon, FileText, Link as LinkIcon, ChevronRight } from "lucide-react";
import { useChatStore } from "@/store/chatStore";
import { useAuthStore } from "@/store/authStore";

export function RightSidebar({ conversation }: { conversation?: Conversation }) {
  const { isRightSidebarOpen, toggleRightSidebar } = useChatStore();
  const currentUser = useAuthStore(state => state.user);

  if (!isRightSidebarOpen || !conversation || !currentUser) return null;

  const otherUser = conversation.participants.find(p => p._id !== currentUser._id) || conversation.participants[0];
  const isGroup = conversation.type === "group";
  const title = isGroup ? conversation.participants.map(p => p.username).join(", ") : otherUser.username;

  return (
    <aside className="w-[320px] shrink-0 border-l border-border bg-background/50 flex flex-col h-full animate-in slide-in-from-right-4 duration-300 ease-out z-20">
      {/* Header */}
      <div className="h-16 min-h-16 border-b border-border flex items-center justify-between px-4">
        <h3 className="font-semibold text-foreground">Details</h3>
        <button onClick={toggleRightSidebar} className="p-2 text-muted-foreground hover:text-foreground rounded-xl transition-colors hover:bg-muted/50">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-6 scrollbar-hide">
        {/* Profile Info */}
        <div className="flex flex-col items-center text-center space-y-3 pt-4">
          <Avatar className="h-28 w-28 ring-4 ring-background shadow-xl">
            {isGroup ? (
              <AvatarFallback className="text-3xl font-medium bg-primary text-primary-foreground">G</AvatarFallback>
            ) : (
              <>
                <AvatarImage src={otherUser.avatar} />
                <AvatarFallback className="text-3xl font-medium bg-primary/10 text-primary">{title.substring(0, 2).toUpperCase()}</AvatarFallback>
              </>
            )}
          </Avatar>
          <div className="mt-4">
            <h2 className="text-xl font-bold text-foreground">{title}</h2>
            {!isGroup && (
              <p className="text-sm text-muted-foreground mt-1.5 flex items-center justify-center gap-1.5">
                <span className={`w-2 h-2 rounded-full shadow-sm ${otherUser.online ? "bg-green-500 shadow-green-500/20" : "bg-muted"}`}></span>
                {otherUser.online ? "Active Now" : "Offline"}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-6 py-2 border-b border-border/50 pb-8">
          <button className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group">
            <div className="w-10 h-10 rounded-full bg-muted/40 group-hover:bg-muted flex items-center justify-center transition-colors"><Search size={18} /></div>
            <span className="text-[11px] font-medium">Search</span>
          </button>
          <button className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group">
            <div className="w-10 h-10 rounded-full bg-muted/40 group-hover:bg-muted flex items-center justify-center transition-colors"><Bell size={18} /></div>
            <span className="text-[11px] font-medium">Mute</span>
          </button>
        </div>

        {/* Participants (If Group) */}
        {isGroup && (
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-2">Members ({conversation.participants.length})</h4>
            <div className="space-y-1">
              {conversation.participants.map(p => (
                <div key={p._id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/40 transition-colors cursor-pointer">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={p.avatar} />
                    <AvatarFallback>{p.username[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <span className="text-sm font-medium block">{p.username}</span>
                    <span className="text-[11px] text-muted-foreground block truncate">{p.email || "No email"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Accordion Sections */}
        <div className="space-y-1 pt-2">
          <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors group">
            <div className="flex items-center gap-3 text-sm font-medium text-foreground">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <ImageIcon size={16} />
              </div>
              Shared Media
            </div>
            <ChevronRight size={16} className="text-muted-foreground" />
          </button>
          <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors group">
            <div className="flex items-center gap-3 text-sm font-medium text-foreground">
              <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                <FileText size={16} />
              </div>
              Files
            </div>
            <ChevronRight size={16} className="text-muted-foreground" />
          </button>
          <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors group">
            <div className="flex items-center gap-3 text-sm font-medium text-foreground">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                <LinkIcon size={16} />
              </div>
              Links
            </div>
            <ChevronRight size={16} className="text-muted-foreground" />
          </button>
        </div>
      </div>
    </aside>
  );
}
