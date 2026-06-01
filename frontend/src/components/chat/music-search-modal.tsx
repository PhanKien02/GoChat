import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useChatStore } from "@/store/chatStore";
import { Input } from "@/components/ui/input";
import { Search, Play, X } from "lucide-react";
import { mockTracks } from "@/lib/data";
import Image from "next/image";

export function MusicSearchModal() {
  const { isMusicSearchModalOpen, closeMusicSearchModal, startMusicSession, activeMusicConversationId } = useChatStore();
  const [searchQuery, setSearchQuery] = useState("");

  if (!isMusicSearchModalOpen || !activeMusicConversationId) return null;

  const filteredTracks = mockTracks.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectTrack = (track: typeof mockTracks[0]) => {
    startMusicSession(activeMusicConversationId, track);
  };

  const handleClose = () => {
    closeMusicSearchModal();
    setSearchQuery("");
  };

  return (
    <Dialog open={isMusicSearchModalOpen} onOpenChange={handleClose}>
      <DialogContent showCloseButton={false} className="sm:max-w-[460px] p-0 overflow-hidden bg-card rounded-2xl shadow-2xl border border-border">

        {/* Header */}
        <div className="p-4 border-b border-border flex justify-between items-center bg-muted/20">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
            Choose a Song
          </h2>
          <button onClick={handleClose} className="p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by song or artist..."
              className="pl-9 bg-muted/50 border-transparent focus-visible:ring-1 focus-visible:ring-purple-500 shadow-none h-10 rounded-xl"
              autoFocus
            />
          </div>
        </div>

        {/* Track List */}
        <div className="h-[340px] overflow-y-auto p-2 scrollbar-hide">
          {filteredTracks.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
              <p className="text-sm">No songs found</p>
            </div>
          ) : (
            filteredTracks.map(track => (
              <button
                key={track.id}
                onClick={() => handleSelectTrack(track)}
                className="w-full flex items-center gap-4 p-3 rounded-xl transition-all hover:bg-muted/50 group mb-1 text-left"
              >
                <div className="relative w-12 h-12 shrink-0 rounded-md overflow-hidden shadow-sm">
                  <Image
                    src={track.albumArt} alt={track.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play size={18} fill="currentColor" className="text-white ml-0.5" />
                  </div>
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-semibold text-foreground truncate">{track.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
