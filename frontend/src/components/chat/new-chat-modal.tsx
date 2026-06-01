import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useChatStore } from "@/store/chatStore";
import { useAuthStore } from "@/store/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Check, X } from "lucide-react";
import { users } from "@/lib/data";
import { User } from "@/lib/types";

export function NewChatModal() {
  const { isNewChatModalOpen, toggleNewChatModal, createConversation } = useChatStore();
  const currentUser = useAuthStore(state => state.user);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  if (!isNewChatModalOpen || !currentUser) return null;

  // Filter out the current user and search query
  const availableUsers = users.filter(u =>
    u._id !== currentUser._id &&
    u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleUserSelection = (user: User) => {
    setSelectedUsers(prev =>
      prev.some(u => u._id === user._id)
        ? prev.filter(u => u._id !== user._id)
        : [...prev, user]
    );
  };

  const handleCreate = () => {
    if (selectedUsers.length > 0) {
      createConversation(selectedUsers);
      setSelectedUsers([]); // reset state
      setSearchQuery("");
    }
  };

  const handleClose = () => {
    toggleNewChatModal(false);
    setSelectedUsers([]);
    setSearchQuery("");
  }

  return (
    <Dialog open={isNewChatModalOpen} onOpenChange={handleClose}>
      <DialogContent showCloseButton={false} className="sm:max-w-[460px] p-0 overflow-hidden bg-card rounded-2xl shadow-2xl border border-border">

        {/* Header */}
        <div className="p-4 border-b border-border flex justify-between items-center bg-muted/20">
          <h2 className="font-semibold text-lg">New Message</h2>
          <button onClick={handleClose} className="p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Selected Users Chips */}
        {selectedUsers.length > 0 && (
          <div className="p-3 border-b border-border flex flex-wrap gap-2 max-h-[104px] overflow-y-auto">
            {selectedUsers.map(u => (
              <div key={u._id} className="flex items-center gap-1.5 bg-primary/10 text-primary px-2.5 py-1 rounded-full text-sm font-medium animate-in zoom-in-95 duration-200">
                <Avatar className="h-4 w-4">
                  <AvatarImage src={u.avatar} />
                </Avatar>
                {u.username.split(' ')[0]}
                <button onClick={() => toggleUserSelection(u)} className="hover:bg-primary/20 rounded-full p-0.5 ml-1 transition-colors">
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Search */}
        <div className="p-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search people..."
              className="pl-9 bg-muted/50 border-transparent focus-visible:ring-1 focus-visible:ring-primary shadow-none h-9"
              autoFocus
            />
          </div>
        </div>

        {/* User List */}
        <div className="h-[280px] overflow-y-auto p-2 scrollbar-hide">
          {availableUsers.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
              <p className="text-sm">No users found</p>
            </div>
          ) : (
            availableUsers.map(user => {
              const isSelected = selectedUsers.some(u => u._id === user._id);
              return (
                <button
                  key={user._id}
                  onClick={() => toggleUserSelection(user)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all mb-1 ${isSelected ? "bg-muted/50" : "hover:bg-muted/30"}`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.username[0]}</AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground">{user.username}</p>
                      <p className="text-xs text-muted-foreground">{user.email || "Offline"}</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${isSelected ? "bg-primary border-primary text-primary-foreground" : "border-border text-transparent"}`}>
                    <Check size={12} strokeWidth={3} />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/10 flex justify-end">
          <Button
            onClick={handleCreate}
            disabled={selectedUsers.length === 0}
            className="w-full sm:w-auto px-8"
          >
            Start Chat
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
