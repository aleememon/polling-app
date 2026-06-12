import http from "http";
import app from "./app";
import "dotenv/config";
import { Server } from "socket.io";

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ["GET", "POST", "PATCH", "DELETE"],
  },
});

async function main() {
  io.on("connection", (socket) => {
    console.log(`WebSocket Client Connected ${socket.id}`);

    socket.on("join_poll_room", (pollId: string) => {
        socket.join(pollId);
        console.log(`Socket ${socket.id} joined room: ${pollId}`);
    });

    socket.on('disconnect', () => {
        console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });

  server.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.log(`Error`, err);
});
