// SocketContext.js
import React, { createContext, useEffect, useRef } from "react";
import io from "socket.io-client";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io("http://localhost:5000"); // Ensure this URL is correct

    socketRef.current.on("connect", () => {
      console.log("Connected to server"); // Debug log
    });

    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from server"); // Debug log
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};
