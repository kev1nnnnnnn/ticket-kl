import { Server as SocketIOServer } from "socket.io";
import type { Server as HttpServer } from "http";

let io: SocketIOServer | null = null;

export function initSocket(httpServer: HttpServer) {
  if (io) return io;

  io = new SocketIOServer(httpServer, {
    cors: {
        origin: [/localhost:\d+/], // aceita qualquer porta localhost
        methods: ["GET", "POST"],
        credentials: true,
    },
    transports: ["websocket"], // força polling inicial
    });


  io.on("connection", (socket) => {
    console.log("🔌 Cliente conectado:", socket.id);

    socket.on("disconnect", () => {
      console.log("Cliente desconectou:", socket.id);
    });
  });

  console.log("⚡ Socket.IO pronto!");
  return io;
}

export function emitNewComment(comment: any) {
  if (!io) return;
  io.emit("newComment", comment);
  console.log(" Evento newComment emitido:", comment);
}
