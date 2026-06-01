import { useState, useEffect } from "react";
import { useChatStore } from "@/store/chatStore";
import { useAuthStore } from "@/store/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mic, MicOff, Video as VideoIcon, VideoOff, MonitorUp, PhoneOff, Maximize, Minimize } from "lucide-react";

export function VideoCall() {
  const { isVideoCallOpen, setVideoCallOpen, conversations, activeConversationId } = useChatStore();
  const currentUser = useAuthStore(state => state.user);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const activeConversation = conversations.find(c => c._id === activeConversationId);
  const otherUser = activeConversation?.participants.find(p => p._id !== currentUser?._id) || currentUser;

  // Reset timer when call opens
  useEffect(() => {
    if (isVideoCallOpen) {
      const timeout = setTimeout(() => setCallDuration(0), 0);
      return () => clearTimeout(timeout);
    }
  }, [isVideoCallOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isVideoCallOpen) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isVideoCallOpen]);

  if (!isVideoCallOpen || !activeConversation || !currentUser || !otherUser) return null;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-3xl transition-all duration-500 ${isFullscreen ? "p-0" : "p-4 md:p-12"}`}>
      <div className={`relative w-full h-full flex flex-col bg-zinc-950 overflow-hidden shadow-2xl transition-all duration-500 ${isFullscreen ? "rounded-none" : "rounded-[2rem] border border-white/10"}`}>

        {/* Top Bar */}
        <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-center z-20 bg-linear-to-b from-black/80 to-transparent">
          <div className="flex items-center gap-4">
            <h2 className="text-white text-lg font-semibold tracking-wide">
              {activeConversation.type === "group" ? "Group Call" : otherUser.username}
            </h2>
            <div className="px-3 py-1 bg-red-500/20 text-red-500 rounded-full text-sm font-medium flex items-center gap-2 border border-red-500/20">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              {formatTime(callDuration)}
            </div>
          </div>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2.5 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors bg-black/20 backdrop-blur-md"
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        </div>

        {/* Main Video Area (Remote) */}
        <div className="flex-1 relative bg-linear-to-br from-zinc-800 to-zinc-950 flex items-center justify-center">
          {/* Animated background blob for visual interest */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
            <div className="w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-primary/20 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '4s' }}></div>
          </div>

          <div className="z-10 flex flex-col items-center gap-6 animate-in zoom-in-95 duration-500">
            <Avatar className="h-32 w-32 md:h-48 md:w-48 ring-8 ring-white/5 shadow-2xl">
              <AvatarImage src={otherUser.avatar} />
              <AvatarFallback className="text-5xl">{otherUser.username[0]}</AvatarFallback>
            </Avatar>
            <p className="text-white/50 font-medium px-4 py-2 bg-black/20 rounded-full backdrop-blur-sm">Video paused</p>
          </div>
        </div>

        {/* Picture-in-Picture (Local) */}
        <div className={`absolute bottom-32 right-6 md:bottom-10 md:right-10 w-32 h-48 md:w-56 md:h-80 bg-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-20 transition-all duration-300 hover:scale-105 border-2 border-white/10 ${isVideoOff ? "flex items-center justify-center" : ""}`}>
          {isVideoOff ? (
            <Avatar className="h-16 w-16 opacity-50">
              <AvatarImage src={currentUser.avatar} />
              <AvatarFallback>{currentUser.username[0]}</AvatarFallback>
            </Avatar>
          ) : (
            <div className="w-full h-full bg-linear-to-t from-zinc-900 to-zinc-700 flex items-center justify-center relative">
              <Avatar className="h-full w-full rounded-none opacity-90">
                <AvatarImage src={currentUser.avatar} className="object-cover" />
              </Avatar>
            </div>
          )}
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-xs font-semibold text-white tracking-wide border border-white/10">
            You
          </div>
        </div>

        {/* Controls Dock */}
        <div className="absolute bottom-8 inset-x-0 flex justify-center z-30 animate-in slide-in-from-bottom-10 duration-500">
          <div className="flex items-center gap-3 sm:gap-5 bg-zinc-950/80 backdrop-blur-2xl border border-white/10 px-6 py-4 rounded-full shadow-2xl">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-4 rounded-full transition-all hover:scale-110 active:scale-95 ${isMuted ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/20"}`}
            >
              {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
            </button>
            <button
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`p-4 rounded-full transition-all hover:scale-110 active:scale-95 ${isVideoOff ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/20"}`}
            >
              {isVideoOff ? <VideoOff size={22} /> : <VideoIcon size={22} />}
            </button>
            <button className="p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all hover:scale-110 active:scale-95 hidden sm:block">
              <MonitorUp size={22} />
            </button>
            <div className="w-px h-8 bg-white/10 mx-1 sm:mx-2"></div>
            <button
              onClick={() => setVideoCallOpen(false)}
              className="p-4 px-8 rounded-full bg-red-500 hover:bg-red-400 text-white shadow-lg shadow-red-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
            >
              <PhoneOff size={22} />
              <span className="font-semibold tracking-wide hidden sm:block">End Call</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
