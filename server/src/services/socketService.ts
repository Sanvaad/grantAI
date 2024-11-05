// src/services/socketService.ts
import { Server as SocketServer } from "socket.io";
import { Server as HTTPServer } from "http";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

export class SocketService {
  private io: SocketServer;
  private userSockets: Map<string, string> = new Map(); // userId -> socketId
  private proposalRooms: Map<string, Set<string>> = new Map(); // proposalId -> Set of userIds

  constructor(server: HTTPServer) {
    this.io = new SocketServer(server, {
      cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware() {
    // Authenticate socket connections
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error("Authentication failed"));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
          id: string;
        };
        const user = await User.findById(decoded.id);

        if (!user) {
          return next(new Error("User not found"));
        }

        socket.data.userId = user.id;
        socket.data.user = {
          id: user.id,
          name: user.name,
          email: user.email,
        };

        next();
      } catch (error) {
        next(new Error("Authentication failed"));
      }
    });
  }

  private setupEventHandlers() {
    this.io.on("connection", (socket) => {
      const userId = socket.data.userId;
      this.userSockets.set(userId, socket.id);

      // Join proposal room
      socket.on("join-proposal", async (proposalId: string) => {
        socket.join(`proposal:${proposalId}`);

        if (!this.proposalRooms.has(proposalId)) {
          this.proposalRooms.set(proposalId, new Set());
        }
        this.proposalRooms.get(proposalId)!.add(userId);

        // Notify others about new user
        this.io.to(`proposal:${proposalId}`).emit("user-joined", {
          user: socket.data.user,
          activeUsers: Array.from(this.proposalRooms.get(proposalId)!),
        });
      });

      // Leave proposal room
      socket.on("leave-proposal", (proposalId: string) => {
        socket.leave(`proposal:${proposalId}`);
        this.proposalRooms.get(proposalId)?.delete(userId);

        this.io.to(`proposal:${proposalId}`).emit("user-left", {
          userId,
          activeUsers: Array.from(this.proposalRooms.get(proposalId) || []),
        });
      });

      // Handle section content updates
      socket.on(
        "section-update",
        async (data: {
          proposalId: string;
          sectionName: string;
          content: string;
          cursorPosition?: { line: number; ch: number };
        }) => {
          socket.to(`proposal:${data.proposalId}`).emit("section-updated", {
            userId,
            user: socket.data.user,
            ...data,
          });
        }
      );

      // Handle cursor position updates
      socket.on(
        "cursor-move",
        (data: {
          proposalId: string;
          sectionName: string;
          position: { line: number; ch: number };
        }) => {
          socket.to(`proposal:${data.proposalId}`).emit("cursor-moved", {
            userId,
            user: socket.data.user,
            ...data,
          });
        }
      );

      // Handle comments
      socket.on(
        "add-comment",
        (data: {
          proposalId: string;
          sectionName: string;
          comment: string;
          range?: { from: number; to: number };
        }) => {
          this.io.to(`proposal:${data.proposalId}`).emit("comment-added", {
            userId,
            user: socket.data.user,
            timestamp: new Date(),
            ...data,
          });
        }
      );

      // Handle disconnection
      socket.on("disconnect", () => {
        this.userSockets.delete(userId);

        // Remove user from all proposal rooms
        this.proposalRooms.forEach((users, proposalId) => {
          if (users.has(userId)) {
            users.delete(userId);
            this.io.to(`proposal:${proposalId}`).emit("user-left", {
              userId,
              activeUsers: Array.from(users),
            });
          }
        });
      });
    });
  }

  // Public methods for external use
  public notifyProposalUpdated(proposalId: string, data: any) {
    this.io.to(`proposal:${proposalId}`).emit("proposal-updated", data);
  }

  public notifyCollaboratorAdded(proposalId: string, user: any) {
    this.io.to(`proposal:${proposalId}`).emit("collaborator-added", user);
  }
}
