import { getCookie } from "./cookies";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8080";

class SocketService {
  private socket: WebSocket | null = null;

  connect() {
    if (typeof window === "undefined") return null;

    if (!this.socket) {
      const token = getCookie<string>("accessToken");
      if (!token) {
        console.warn("Cannot connect to WebSocket: No access token found");
        return null;
      }

      // Convert http/https to ws/wss protocols
      const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      // Parse base URL for WebSocket
      let cleanSocketUrl = SOCKET_URL.replace(/^(http|https):/, "");
      if (!cleanSocketUrl.startsWith("//")) {
        cleanSocketUrl = "//" + cleanSocketUrl;
      }
      
      const socketUrl = `${wsProtocol}${cleanSocketUrl}/ws`;

      console.log("Connecting to raw WebSocket server:", socketUrl);
      this.socket = new WebSocket(socketUrl);

      this.socket.onopen = () => {
        console.log("Connected to WebSocket server successfully");
      };

      this.socket.onclose = (event) => {
        console.log("Disconnected from WebSocket server:", event.reason);
        this.socket = null;
      };

      this.socket.onerror = (err) => {
        console.error("WebSocket connection error:", err);
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Received WebSocket event:", data);
        } catch {
          console.log("Received raw WebSocket message:", event.data);
        }
      };
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  getSocket(): WebSocket | null {
    return this.socket;
  }
}

export const socketService = new SocketService();
