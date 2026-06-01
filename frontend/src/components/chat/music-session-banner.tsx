import { useState, useEffect } from "react";
import { useChatStore } from "@/store/chatStore";
import { Play, Pause, X, Headphones } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { users } from "@/lib/data";

export function MusicSessionBanner({ conversationId }: { conversationId: string }) {
  const { conversations, toggleMusicPlay, endMusicSession } = useChatStore();
  const conversation = conversations.find(c => c.id === conversationId);
  const musicSession = conversation?.musicSession;
  
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (musicSession?.isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) return 0; // loop
          return prev + 0.5;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [musicSession?.isPlaying]);

  if (!musicSession) return null;

  // Mock listeners avatars
  const listeningUsers = users.filter(u => musicSession.listeners.includes(u.id));

  return (
    <div className="mx-4 mt-4 bg-linear-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-4 shadow-sm relative overflow-hidden group animate-in slide-in-from-top-4 duration-500">
      {/* Background glow */}
      <div className="absolute inset-0 bg-linear-to-r from-indigo-500/5 to-pink-500/5 backdrop-blur-md -z-10"></div>
      
      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-black/5 dark:bg-white/10 w-full">
        <div 
          className="h-full bg-linear-to-r from-indigo-500 to-pink-500 transition-all duration-1000 ease-linear" 
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center gap-4 relative z-10">
        {/* Album Art with Equalizer */}
        <div className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-all">
          <img src={musicSession.albumArt} alt={musicSession.songTitle} className="w-full h-full object-cover" />
          {musicSession.isPlaying && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center gap-0.5">
              <div className="w-1 bg-white rounded-full animate-[music-bar_1s_ease-in-out_infinite_alternate] h-3"></div>
              <div className="w-1 bg-white rounded-full animate-[music-bar_0.8s_ease-in-out_infinite_alternate-reverse] h-5"></div>
              <div className="w-1 bg-white rounded-full animate-[music-bar_1.2s_ease-in-out_infinite_alternate] h-2"></div>
              <div className="w-1 bg-white rounded-full animate-[music-bar_0.9s_ease-in-out_infinite_alternate-reverse] h-4"></div>
            </div>
          )}
        </div>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <Headphones size={14} className="text-purple-500" />
            <span className="text-xs font-semibold text-purple-500 uppercase tracking-wider">Listening Together</span>
          </div>
          <h3 className="font-bold text-base truncate text-foreground leading-tight">{musicSession.songTitle}</h3>
          <p className="text-sm text-muted-foreground truncate">{musicSession.artist}</p>
        </div>

        {/* Listeners Avatars */}
        <div className="hidden sm:flex items-center -space-x-2 mr-4">
          {listeningUsers.map((user, i) => (
            <Avatar key={user.id} className="h-8 w-8 border-2 border-background shadow-sm" style={{ zIndex: 10 - i }}>
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.username[0]}</AvatarFallback>
            </Avatar>
          ))}
          <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium z-0 shadow-sm">
            +{musicSession.listeners.length}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={() => toggleMusicPlay(conversationId)}
            className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all"
          >
            {musicSession.isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
          </button>
          <button 
            onClick={() => endMusicSession(conversationId)}
            className="w-10 h-10 rounded-full bg-muted/50 text-muted-foreground flex items-center justify-center hover:bg-red-500/10 hover:text-red-500 transition-all"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes music-bar {
          0% { transform: scaleY(0.3); }
          100% { transform: scaleY(1); }
        }
      `}} />
    </div>
  );
}
