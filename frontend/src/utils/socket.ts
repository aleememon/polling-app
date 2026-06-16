import { io } from "socket.io-client";

// Natively falls back to localhost if the VITE_API_URL environment variable isn't configured yet
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export const socket = io(BACKEND_URL, {
  autoConnect: true,        // Automatically establish the handshake connection
  reconnectionAttempts: 5,  // Try reconnecting 5 times if Hugging Face drops the connection
});