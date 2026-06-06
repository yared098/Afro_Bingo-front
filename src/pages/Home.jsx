import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // persistent socket

export default function Home() {
  const [rooms, setRooms] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Socket events
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    // Listen for room updates
    socket.on("roomStateUpdate", (room) => {
      setRooms((prev) => {
        const idx = prev.findIndex((r) => r.id === room.id);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = { ...copy[idx], ...room };
          return copy;
        } else {
          return [...prev, room];
        }
      });
    });

    socket.on("roomDeleted", (roomId) => {
      setRooms((prev) => prev.filter((r) => r.id !== roomId));
    });

    // request initial rooms
    // optional if server emits on create
    // socket.emit("getAllRooms");

    // DON'T disconnect socket here
    // return () => socket.disconnect();

  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-2">🎯 Fish Bingo Rooms</h1>
      <p className={`text-center mb-6 ${connected ? 'text-green-600' : 'text-red-600'}`}>
        {connected ? "🟢 Connected to server" : "🔴 Not connected"}
      </p>

      {rooms.length === 0 && <p className="text-center text-gray-500">No active rooms yet...</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div key={room.id} className={`p-6 rounded-lg shadow-lg bg-white transition ${room.isStarted ? "border-2 border-red-500" : "border"}`}>
            <h2 className="text-xl font-semibold mb-2">{room.id}</h2>
            <p>Players: {room.playerCount}</p>
            <p>Room Price: ${room.roomPrice}</p>
            <p>Status: {room.isStarted ? "Game Started 🔴" : "Waiting 🟢"}</p>
            <button
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              onClick={() => alert(`Join room: ${room.id}`)}
              disabled={room.isStarted}
            >
              {room.isStarted ? "Game in Progress" : "Join Room"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
