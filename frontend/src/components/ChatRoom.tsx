// src/components/ChatRoom.tsx
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  useGetAllMessagesQuery,
  useGetAllUsersQuery,
  useLogOuttMutation,
  useSendMessageMutation,
} from "../toolkit/apiSlice";
import { useAppDispatch, useAppSelector } from "../toolkit/hooks";
import { setLoading, setToken, setUser } from "../toolkit/user.reducer";
import { OnlineBadge } from "./OnlineBadge";

interface Message {
  senderId: string;
  content: string;
}

export default function ChatRoom() {
  const currentUserId = useAppSelector((state) => state?.user?.user?.id);

  const [messages] = useState<{
    [key: string]: Message[];
  }>({});

  const [input, setInput] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  const [logout, { isLoading }] = useLogOuttMutation();
  const { data, isLoading: isLoadingData } = useGetAllUsersQuery(null);

  const users = data?.data?.getAllUsers;

  const [sendMsg] = useSendMessageMutation();
  const [activeUserId, setActiveUserId] = useState(users?.[0]);
  const activeUser =
    users?.find((u: any) => u.id === activeUserId) || users?.[0];
  const onlineUsers = useAppSelector((state) => state.chat.onlineUsers);
  const isOnline = useCallback(
    (userId: string) => onlineUsers.includes(userId),
    [onlineUsers],
  );

  const { data: allMessages } = useGetAllMessagesQuery(activeUser?.id, {
    skip: !activeUser?.id,
  });
  const dbMessages = useMemo(
    () => allMessages?.data?.getAllMessages || [],
    [allMessages],
  );

  const displayMessages = useMemo(() => {
    const currentLocal = messages[activeUserId || ""] || [];
    return [...dbMessages, ...currentLocal];
  }, [dbMessages, messages, activeUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeUser]);

  const sendMessage = async () => {
    if (!input.trim() || !activeUser) return;
    // setMessages((prev) => ({
    //   ...prev,
    //   [activeUser.id]: [
    //     ...(prev[activeUser.id] || []),
    //     { senderId: currentUserId, content: input },
    //   ],
    // }));
    const credentials = {
      receiverId: activeUser?.id,
      senderId: currentUserId,
      content: input,
    };
    await sendMsg(credentials);

    setInput("");
  };

  const handleLogout = useCallback(() => {
    logout();
    dispatch(setUser(null));
    dispatch(setToken(null));
    dispatch(setLoading(true));
  }, [logout, dispatch]);

  return (
    <div
      style={{
        width: 850,
        height: 520,
        margin: "40px auto",
        display: "flex",
        borderRadius: 16,
        overflow: "hidden",
        fontFamily: "Segoe UI",
        boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
        background: "#fff",
      }}
    >
      {/* SIDEBAR */}
      <div
        style={{
          width: 240,
          borderRight: "1px solid #eee",
          background: "#f8faf9",
        }}
      >
        <div
          style={{
            padding: 14,
            fontWeight: "600",
            background: "#128C7E",
            color: "#fff",
            letterSpacing: 0.5,
          }}
        >
          Chats
        </div>

        {isLoadingData ? (
          <div>Loading...</div>
        ) : (
          users?.map((u: { id: string; username: string }) => (
            <div
              key={u.id}
              onClick={() => setActiveUserId(u.id)}
              style={{
                padding: 14,
                cursor: "pointer",
                transition: "all 0.2s ease",
                background: activeUser?.id === u.id ? "#50a397" : "#1f7568",
                borderBottom: "1px solid #0d0707",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#2b4946")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  activeUser?.id === u.id ? "#50a397" : "#1f7568")
              }
            >
              <span style={{ marginRight: "10px" }}>{u.username}</span>
              <span>
                {isOnline(u.id) ? (
                  <OnlineBadge isOnline={isOnline(u.id)} />
                ) : (
                  ""
                )}
              </span>
            </div>
          ))
        )}
      </div>

      {/* CHAT AREA */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div
          style={{
            padding: "14px 18px",
            backgroundColor: "#128C7E",
            color: "#fff",
            fontWeight: "600",
            letterSpacing: 0.3,
          }}
        >
          {activeUser?.username || "Select User"}
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            padding: 18,
            overflowY: "auto",
            background: "#f4f7f6",
          }}
        >
          {displayMessages?.map((msg: any, idx: any) => (
            <div
              key={idx}
              style={{
                display: "flex",
                justifyContent:
                  msg.senderId === currentUserId ? "flex-end" : "flex-start",
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  color: msg.senderId === currentUserId ? "white" : "black",
                  background:
                    msg.senderId === currentUserId ? "#0f7a6d" : "#ffffff",
                  padding: "10px 14px",
                  borderRadius: 18,
                  maxWidth: "65%",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                  fontSize: 14,
                  lineHeight: 1.4,
                }}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div
          style={{
            display: "flex",
            padding: 12,
            borderTop: "1px solid #eee",
            background: "#fff",
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: 25,
              border: "1px solid #ddd",
              outline: "none",
              background: "#f7f7f7",
              fontSize: 14,
              color: "black",
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              marginLeft: 10,
              padding: "10px 18px",
              borderRadius: 25,
              background: "#128C7E",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontWeight: 500,
              transition: "0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#0f7a6d")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#128C7E")}
          >
            Send
          </button>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            padding: 10,
            border: "none",
            background: "#fafafa",
            borderTop: "1px solid #eee",
            cursor: "pointer",
          }}
        >
          {isLoading ? "LoggingOut..." : "Logout"}
        </button>
      </div>
    </div>
  );
}
