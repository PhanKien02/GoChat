import { create } from 'zustand';
import { User } from '@/lib/types';
import api from '@/lib/api';
import { useAuthStore } from './authStore';

interface ProfileState {
  isLoading: boolean;
  error: string | null;

  updateProfile: (data: Partial<User>) => Promise<void>;
  toggleSpotify: (connected: boolean) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set) => ({
  isLoading: false,
  error: null,

  updateProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put('/users/profile', data);
      
      // Update the user in authStore with the new profile data
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        useAuthStore.getState().setUser({ ...currentUser, ...response.data.user });
      }

      set({ isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update profile', 
        isLoading: false 
      });
    }
  },

  toggleSpotify: async (connected) => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, you would likely redirect to Spotify auth if connected === true
      // or call an API endpoint to disconnect. For now, updating local user state simulating API.
      await api.put('/users/spotify', { connected });
      
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        useAuthStore.getState().setUser({ 
          ...currentUser, 
          spotify: connected ? {
            connected: true,
            isPlaying: true,
            songTitle: "Starboy",
            artist: "The Weeknd, Daft Punk",
            albumArt: "https://i.scdn.co/image/ab67616d0000b2734718e2b124f79258be7bc452"
          } : {
            connected: false,
            isPlaying: false
          }
        });
      }

      set({ isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to toggle Spotify', 
        isLoading: false 
      });
    }
  }
}));
