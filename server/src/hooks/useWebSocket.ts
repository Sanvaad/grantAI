// src/hooks/useWebSocket.ts
import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./useAuth"; // Your auth hook

interface UseWebSocketOptions {
  proposalId?: string;
  onUserJoined?: (data: any) => void;
  onUserLeft?: (data: any) => void;
  onSectionUpdated?: (data: any) => void;
  onCursorMoved?: (data: any) => void;
  onCommentAdded?: (data: any) => void;
}

export const useWebSocket = (options: UseWebSocketOptions) => {
  const socketRef = useRef<Socket>();
  const { token } = useAuth();

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(process.env.REACT_APP_WS_URL!, {
      auth: { token },
      autoConnect: false,
    });

    // Connect to socket
    socketRef.current.connect();

    // Set up event listeners
    if (options.proposalId) {
      socketRef.current.emit("join-proposal", options.proposalId);
    }

    socketRef.current.on("user-joined", options.onUserJoined);
    socketRef.current.on("user-left", options.onUserLeft);
    socketRef.current.on("section-updated", options.onSectionUpdated);
    socketRef.current.on("cursor-moved", options.onCursorMoved);
    socketRef.current.on("comment-added", options.onCommentAdded);

    // Cleanup
    return () => {
      if (options.proposalId) {
        socketRef.current?.emit("leave-proposal", options.proposalId);
      }
      socketRef.current?.disconnect();
    };
  }, [options.proposalId, token]);

  // Emit methods
  const updateSection = useCallback(
    (sectionName: string, content: string) => {
      socketRef.current?.emit("section-update", {
        proposalId: options.proposalId,
        sectionName,
        content,
      });
    },
    [options.proposalId]
  );

  const updateCursor = useCallback(
    (sectionName: string, position: { line: number; ch: number }) => {
      socketRef.current?.emit("cursor-move", {
        proposalId: options.proposalId,
        sectionName,
        position,
      });
    },
    [options.proposalId]
  );

  const addComment = useCallback(
    (
      sectionName: string,
      comment: string,
      range?: { from: number; to: number }
    ) => {
      socketRef.current?.emit("add-comment", {
        proposalId: options.proposalId,
        sectionName,
        comment,
        range,
      });
    },
    [options.proposalId]
  );

  return {
    updateSection,
    updateCursor,
    addComment,
  };
};
