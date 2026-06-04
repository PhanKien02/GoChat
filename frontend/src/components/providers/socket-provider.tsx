"use client";

import { useEffect, createContext, useContext, ReactNode } from "react";
import { useAuthStore } from "@/store/authStore";
import { socketService } from "@/lib/socket";

const SocketContext = createContext<typeof socketService | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      socketService.connect();
    } else {
      socketService.disconnect();
    }

    return () => {
      // Don't disconnect on unmount, we want the socket to persist across navigation
      // socketService.disconnect();
    };
  }, [isAuthenticated, user]);

  return (
    <SocketContext.Provider value={socketService}>
      {children}
    </SocketContext.Provider>
  );
};
