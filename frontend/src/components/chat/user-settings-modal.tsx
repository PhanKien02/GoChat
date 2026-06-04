import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useChatStore } from "@/store/chatStore";
import { useAuthStore } from "@/store/authStore";
import { useProfileStore } from "@/store/profileStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Settings, User, Key, Moon, Sun, Monitor, Link2, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { removeCookie } from "@/lib/cookies";
import { useRouter } from "next/navigation";

export function UserSettingsModal() {
  const router = useRouter()
  const { isUserSettingsOpen, toggleUserSettings } = useChatStore();
  const currentUser = useAuthStore(state => state.user);
  const { updateProfile, toggleSpotify } = useProfileStore();
  const [activeTab, setActiveTab] = useState("account");
  const { theme, setTheme } = useTheme();

  // Local state for forms
  const [username, setUsername] = useState(currentUser?.username || "");
  const [bio, setBio] = useState(currentUser?.bio || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSaveProfile = () => {
    updateProfile({ username, bio });
  };

  const handleSavePassword = () => {
    toggleUserSettings(false)
    setCurrentPassword("");
    setNewPassword("");
  };

  const handleLogout = () => {
    removeCookie("accessToken")
    removeCookie("user")
    router.replace("/login")
  }
  // Re-sync local state when modal opens
  if (!isUserSettingsOpen || !currentUser) return null;

  return (
    <Dialog open={isUserSettingsOpen} onOpenChange={toggleUserSettings}>
      <DialogContent showCloseButton={false} className="sm:max-w-[750px] p-0 overflow-hidden flex h-[550px] gap-0 rounded-2xl">
        {/* Sidebar Navigation */}
        <div className="w-[240px] bg-sidebar border-r border-border p-4 flex flex-col gap-1.5 shrink-0">
          <h3 className="font-semibold text-[11px] uppercase tracking-wider text-muted-foreground mb-3 px-3 pt-2">User Settings</h3>

          <button
            onClick={() => setActiveTab("account")}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === "account" ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted text-foreground/80 hover:text-foreground"}`}
          >
            <User size={16} /> My Account
          </button>

          <button
            onClick={() => setActiveTab("password")}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === "password" ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted text-foreground/80 hover:text-foreground"}`}
          >
            <Key size={16} /> Password & Security
          </button>

          <button
            onClick={() => setActiveTab("appearance")}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === "appearance" ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted text-foreground/80 hover:text-foreground"}`}
          >
            <Settings size={16} /> Appearance
          </button>

          <button
            onClick={() => setActiveTab("connections")}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === "connections" ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted text-foreground/80 hover:text-foreground"}`}
          >
            <Link2 size={16} /> Connections
          </button>

          <div className="mt-auto pt-4 mb-2">
            <button
              type="submit"
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all w-full text-red-500 hover:bg-red-500/10 hover:text-red-600"
            >
              <LogOut size={16} /> Log Out
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-card overflow-y-auto p-8 relative">
          <button
            onClick={() => toggleUserSettings(false)}
            className="absolute top-4 right-4 p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors"
          >
            <span className="sr-only">Close</span>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
              <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.21841C3.80708 2.99386 3.44301 2.99386 3.21846 3.21841C2.99391 3.44297 2.99391 3.80703 3.21846 4.03159L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
            </svg>
          </button>

          {activeTab === "account" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-6">My Account</h2>
                <div className="flex items-center gap-5 p-5 rounded-2xl border border-border bg-muted/20">
                  <Avatar className="h-24 w-24 ring-4 ring-background shadow-md">
                    <AvatarImage src={currentUser.avatar} />
                    <AvatarFallback className="text-3xl font-medium bg-primary/10 text-primary">{currentUser.username[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{currentUser.username}</h3>
                    <p className="text-sm text-muted-foreground">{currentUser.email || "No email"}</p>
                    <div className="mt-3">
                      <Button size="sm" variant="outline" className="h-8">Change Avatar</Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Display Name</label>
                  <Input
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="bg-background max-w-sm h-11"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Bio</label>
                  <Textarea
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="resize-none bg-background min-h-[100px]"
                  />
                  <p className="text-[11px] text-muted-foreground">Any details such as age, occupation or city. Example: 23 y.o. designer from San Francisco</p>
                </div>
                <div className="pt-2">
                  <Button onClick={handleSaveProfile} className="h-10 px-6">Save Changes</Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "password" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-2">Change Password</h2>
                <p className="text-sm text-muted-foreground">Update your password to keep your account secure.</p>
              </div>

              <div className="space-y-5 max-w-sm">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Current Password</label>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    className="bg-background h-11"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">New Password</label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="bg-background h-11"
                  />
                </div>
                <div className="pt-4 border-t border-border mt-6">
                  <Button
                    onClick={handleSavePassword}
                    disabled={!currentPassword || !newPassword}
                    className="h-10 px-6"
                  >
                    Update Password
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-2">Appearance</h2>
                <p className="text-sm text-muted-foreground">Customize the look and feel of the application.</p>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-semibold text-foreground block">Theme</label>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => setTheme("light")}
                    className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all hover:scale-[1.02] active:scale-[0.98] ${theme === "light" ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/30 bg-card text-muted-foreground"}`}
                  >
                    <Sun size={28} />
                    <span className="text-sm font-medium">Light</span>
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all hover:scale-[1.02] active:scale-[0.98] ${theme === "dark" ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/30 bg-card text-muted-foreground"}`}
                  >
                    <Moon size={28} />
                    <span className="text-sm font-medium">Dark</span>
                  </button>
                  <button
                    onClick={() => setTheme("system")}
                    className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all hover:scale-[1.02] active:scale-[0.98] ${theme === "system" ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/30 bg-card text-muted-foreground"}`}
                  >
                    <Monitor size={28} />
                    <span className="text-sm font-medium">System</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "connections" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-2">Connections</h2>
                <p className="text-sm text-muted-foreground">Connect your accounts to unlock special integrations.</p>
              </div>

              <div className="space-y-4 max-w-lg">
                <div className="flex items-center justify-between p-5 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#1DB954]/10 flex items-center justify-center text-[#1DB954]">
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-base text-foreground">Spotify</h3>
                      <p className="text-xs text-muted-foreground">{currentUser.spotify?.connected ? `Connected as ${currentUser.username}` : "Show what you're listening to"}</p>
                    </div>
                  </div>
                  {currentUser.spotify?.connected ? (
                    <Button variant="outline" className="text-red-500 border-red-500/20 hover:bg-red-500/10 hover:text-red-500" onClick={() => toggleSpotify(false)}>Disconnect</Button>
                  ) : (
                    <Button className="bg-[#1DB954] hover:bg-[#1ed760] text-black font-semibold" onClick={() => toggleSpotify(true)}>Connect</Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
