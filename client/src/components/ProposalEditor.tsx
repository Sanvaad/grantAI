// src/components/ProposalEditor.tsx
import React, { useState, useEffect } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import { User } from "../types";

interface Props {
  proposalId: string;
  sectionName: string;
  initialContent: string;
}

interface CursorPosition {
  userId: string;
  user: User;
  position: { line: number; ch: number };
}

export const ProposalEditor: React.FC<Props> = ({
  proposalId,
  sectionName,
  initialContent,
}) => {
  const [content, setContent] = useState(initialContent);
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [cursors, setCursors] = useState<CursorPosition[]>([]);
  const [comments, setComments] = useState<any[]>([]);

  const { updateSection, updateCursor, addComment } = useWebSocket({
    proposalId,
    onUserJoined: (data) => {
      setActiveUsers(data.activeUsers);
    },
    onUserLeft: (data) => {
      setActiveUsers(data.activeUsers);
      setCursors((prev) => prev.filter((c) => c.userId !== data.userId));
    },
    onSectionUpdated: (data) => {
      setContent(data.content);
    },
    onCursorMoved: (data) => {
      setCursors((prev) => {
        const filtered = prev.filter((c) => c.userId !== data.userId);
        return [
          ...filtered,
          {
            userId: data.userId,
            user: data.user,
            position: data.position,
          },
        ];
      });
    },
    onCommentAdded: (data) => {
      setComments((prev) => [...prev, data]);
    },
  });

  // Handle local content changes
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    updateSection(sectionName, newContent);
  };

  // Handle cursor movement
  const handleCursorMove = (position: { line: number; ch: number }) => {
    updateCursor(sectionName, position);
  };

  // Handle comment addition
  const handleAddComment = (
    comment: string,
    range?: { from: number; to: number }
  ) => {
    addComment(sectionName, comment, range);
  };

  return (
    <div className="relative">
      {/* Active Users Display */}
      <div className="absolute top-0 right-0 flex space-x-2 p-2">
        {activeUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center bg-blue-100 rounded-full px-3 py-1"
          >
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
            <span>{user.name}</span>
          </div>
        ))}
      </div>

      {/* Editor */}
      <div className="border rounded-lg p-4 mt-10">
        <textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          className="w-full min-h-[200px] p-2"
          placeholder="Start writing..."
        />
      </div>

      {/* Remote Cursors */}
      {cursors.map((cursor) => (
        <div
          key={cursor.userId}
          className="absolute"
          style={{
            top: `${cursor.position.line * 20}px`,
            left: `${cursor.position.ch * 8}px`,
          }}
        >
          <div className="relative">
            <div
              className="w-1 h-5 bg-blue-500"
              style={{
                backgroundColor: `hsl(${hashString(cursor.userId) % 360}, 70%, 50%)`,
              }}
            />
            <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              {cursor.user.name}
            </div>
          </div>
        </div>
      ))}

      {/* Comments */}
      <div className="mt-4 space-y-2">
        {comments.map((comment, index) => (
          <div key={index} className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="font-medium">{comment.user.name}</span>
              <span className="text-gray-500 text-sm">
                {new Date(comment.timestamp).toLocaleString()}
              </span>
            </div>
            <p className="mt-1">{comment.comment}</p>
          </div>
        ))}
      </div>

      {/* Add Comment Button */}
      <button
        onClick={() => {
          const comment = prompt("Enter your comment:");
          if (comment) handleAddComment(comment);
        }}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add Comment
      </button>
    </div>
  );
};

// Utility function to generate consistent colors for users
const hashString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};
