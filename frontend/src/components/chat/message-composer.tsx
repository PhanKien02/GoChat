import { useState, useRef, useEffect } from "react";
import { Paperclip, Send, Smile, Mic, Square, X, FileText, Video as VideoIcon, Music } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useChatStore } from "@/store/chatStore";
import { Attachment } from "@/lib/types";
import Image from "next/image";

const EMOJIS = ["😀", "😂", "🥺", "😍", "😎", "🤔", "😭", "🥰", "👍", "🔥", "✨", "🎉", "❤️", "💯", "👀", "🙌", "🚀", "💡", "🎶", "🎵"];

export function MessageComposer() {
  const [content, setContent] = useState("");
  const [stagedAttachments, setStagedAttachments] = useState<Attachment[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { sendMessage, activeConversationId } = useChatStore();

  useEffect(() => {
    if (!isRecording) return;
    const interval = setInterval(() => setRecordingDuration(p => p + 1), 1000);
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleSend = () => {
    if ((content.trim() || stagedAttachments.length > 0) && activeConversationId) {
      sendMessage(content.trim(), activeConversationId, stagedAttachments.length > 0 ? stagedAttachments : undefined);
      setContent("");
      setStagedAttachments([]);
      setShowEmojiPicker(false);
      setIsRecording(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newAttachments: Attachment[] = Array.from(e.target.files).map(file => {
        const typeStr = file.type;
        let type: Attachment["type"] = "file";
        if (typeStr.startsWith("image/")) type = "image";
        else if (typeStr.startsWith("video/")) type = "video";
        else if (typeStr.startsWith("audio/")) type = "audio";
        else if (typeStr.includes("pdf") || typeStr.includes("document")) type = "document";

        return {
          id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          messageId: "",
          url: URL.createObjectURL(file),
          type,
          filename: file.name,
          size: file.size
        };
      });
      setStagedAttachments(prev => [...prev, ...newAttachments]);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveAttachment = (id: string) => {
    setStagedAttachments(prev => prev.filter(a => a.id !== id));
  };

  const toggleRecording = () => {
    if (isRecording) {
      const mockAudio: Attachment = {
        id: `att_${Date.now()}`,
        messageId: "",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        type: "audio",
        filename: `Voice Note (${recordingDuration}s).mp3`
      };
      setStagedAttachments(prev => [...prev, mockAudio]);
      setIsRecording(false);
    } else {
      setRecordingDuration(0);
      setIsRecording(true);
    }
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const onEmojiClick = (emoji: string) => {
    setContent(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="p-4 bg-background border-t border-border/50 relative z-10 shadow-[0_-4px_24px_rgba(0,0,0,0.02)] flex flex-col gap-2">

      {/* Staged Attachments Preview */}
      {stagedAttachments.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-2">
          {stagedAttachments.map((att) => (
            <div key={att.id} className="relative group shrink-0 w-16 h-16 rounded-xl border border-border bg-muted/50 overflow-hidden flex items-center justify-center">
              {att.type === "image" ? (
                <Image
                  src={att.url}
                  alt={att.filename || ""}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : att.type === "video" ? (
                <VideoIcon size={24} className="text-blue-500" />
              ) : att.type === "audio" ? (
                <Music size={24} className="text-purple-500" />
              ) : (
                <FileText size={24} className="text-muted-foreground" />
              )}
              <button
                onClick={() => handleRemoveAttachment(att.id)}
                className="absolute -top-1 -right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Emoji Picker Popover */}
      {showEmojiPicker && (
        <div className="absolute bottom-full right-4 mb-2 bg-popover border border-border rounded-xl p-3 shadow-xl z-50 w-64 animate-in slide-in-from-bottom-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Emojis</span>
            <button onClick={() => setShowEmojiPicker(false)} className="text-muted-foreground hover:text-foreground"><X size={14} /></button>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {EMOJIS.map(emoji => (
              <button
                key={emoji}
                onClick={() => onEmojiClick(emoji)}
                className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded-lg text-xl transition-transform hover:scale-110"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-end gap-2 bg-sidebar rounded-2xl border border-border p-2 focus-within:ring-1 focus-within:ring-ring focus-within:border-ring transition-shadow shadow-sm relative">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-colors shrink-0"
        >
          <Paperclip size={20} />
        </button>
        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
        />

        {isRecording ? (
          <div className="flex-1 min-h-[40px] flex items-center gap-3 px-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-sm font-medium text-red-500">Recording Audio...</span>
            <span className="text-sm font-mono text-muted-foreground ml-auto">{formatDuration(recordingDuration)}</span>
          </div>
        ) : (
          <Textarea
            placeholder="Type a message..."
            className="min-h-[40px] max-h-[160px] bg-transparent border-none focus-visible:ring-0 resize-none py-2.5 px-0 flex-1 shadow-none text-[15px]"
            rows={1}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        )}

        <div className="flex items-center gap-1 pb-1 shrink-0">
          {!isRecording && (
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`p-2 rounded-xl transition-colors ${showEmojiPicker ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
            >
              <Smile size={20} />
            </button>
          )}

          <button
            onClick={toggleRecording}
            className={`p-2 rounded-xl transition-all shadow-sm transform active:scale-95 ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-muted/50 text-foreground hover:bg-muted'}`}
          >
            {isRecording ? <Square size={18} fill="currentColor" /> : <Mic size={18} />}
          </button>

          <button
            onClick={handleSend}
            disabled={!(content.trim() || stagedAttachments.length > 0)}
            className="p-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-sm transform active:scale-95"
          >
            <Send size={18} className="ml-0.5" />
          </button>
        </div>
      </div>
      <div className="text-center mt-0.5 opacity-70">
        <p className="text-[10px] text-muted-foreground"><strong>Return</strong> to send, <strong>Shift + Return</strong> for new line</p>
      </div>
    </div>
  );
}
