import React, { createContext, useContext, useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getSession } from "helper/authHelper";
import { useLocation, useNavigate } from "react-router-dom";

// Create WebSocket Context
const WebSocketContext = createContext();
import uniqid from "uniqid";
export const WebSocketProvider = ({ children }) => {
  const notificationSocketRef = useRef(null);
  const chatSocketRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [notificationMessages, setNotificationMessages] = useState([]);
  const [timeUp, setTimeUp] = useState(false);
  const { pathname } = useLocation();
  const userInfo = getSession();
  const userId = userInfo?.user_info?.id;
  const token = userInfo?.access_token;
  const reconnectAttempts = useRef(0);
  const navigate = useNavigate();
  const getIdFromUrl = () => {
    const segments = pathname?.split("/");
    return segments[2];
  };

  const chatId = getIdFromUrl();

  const isSocketOpen = (socketRef) => {
    return socketRef.current && socketRef.current.readyState === WebSocket.OPEN;
  };

  const openChatSocket = () => {
    if (!chatId || !userInfo || !pathname?.startsWith("/chatbot") || timeUp) return;

    if (chatSocketRef.current) {
      chatSocketRef.current.close(); // Close the existing socket
    }

    const url = `${process.env.REACT_APP_SOCKET_API_URL}/bots/ws/chat/${userInfo?.role}/${chatId}${
      userInfo?.role === "care_home" ? `?care_home_id=${userId}` : ""
    }`;
    chatSocketRef.current = new WebSocket(url);

    chatSocketRef.current.onopen = () => {
      reconnectAttempts.current = 0; // Reset reconnection attempts on successful connection
    };

    chatSocketRef.current.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      newMessage.id = uniqid();
      if (newMessage?.socket || newMessage.message == "You session is expired") {
        chatSocketRef.current.close(); // Trigger reconnect
        navigate("/dashboard");
      } else if (newMessage.message == "Our chat time is up.") {
        setTimeUp(true);
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    };

    chatSocketRef.current.onclose = (event) => {};

    chatSocketRef.current.onerror = (error) => {};
  };

  const reconnectChatSocket = () => {
    setTimeout(() => {
      openChatSocket();
    }, 1000); // Exponential backoff
  };

  useEffect(() => {
    if (token && !isSocketOpen(notificationSocketRef)) {
      if (notificationSocketRef.current) {
        notificationSocketRef.current.close();
      }

      notificationSocketRef.current = new WebSocket(
        `${process.env.REACT_APP_SOCKET_API_URL}/ws/notifications?token=${token}`
      );

      notificationSocketRef.current.onopen = () => {};

      notificationSocketRef.current.onmessage = (event) => {
        try {
          const newMessage = JSON.parse(event.data);
          setNotificationMessages([newMessage]);
        } catch (error) {
          console.error("Error parsing notification message", error);
        }
      };

      notificationSocketRef.current.onclose = (event) => {};

      notificationSocketRef.current.onerror = (error) => {
        console.error("Notification WebSocket error", error);
      };
    }

    return () => {
      if (notificationSocketRef.current) {
        notificationSocketRef.current.close();
      }
    };
  }, [token]);

  useEffect(() => {
    openChatSocket();

    return () => {
      if (chatSocketRef.current) {
        chatSocketRef.current.close();
      }
    };
  }, [chatId, userInfo?.role, pathname]);

  const sendReadAllEvent = () => {
    if (isSocketOpen(notificationSocketRef)) {
      const message = JSON.stringify({ event: "read_all" });
      notificationSocketRef.current.send(message);
    }
  };

  const clearAllNotification = () => {
    if (isSocketOpen(notificationSocketRef)) {
      const message = JSON.stringify({ event: "clear_all" });
      notificationSocketRef.current.send(message);
    }
  };

  const sendMessage = (message) => {
    if (isSocketOpen(chatSocketRef) && !timeUp) {
      chatSocketRef.current.send(message);
    } else {
      console.warn("Chat socket is not open. Unable to send message.");
    }
  };

  return (
    <WebSocketContext.Provider
      value={{
        notificationSocketRef,
        chatSocketRef,
        messages,
        sendMessage,
        notificationMessages,
        sendReadAllEvent,
        clearAllNotification,
        timeUp,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

WebSocketProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useWebSocketContext = () => useContext(WebSocketContext);
