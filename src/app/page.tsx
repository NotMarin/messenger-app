/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';

interface Message {
  type: string;
  text?: string;
  from?: string;
  filename?: string;
  file?: string;
  self?: boolean;
  time?: string;
}

export default function ChatClient() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:5000');

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data) as Message;
      const incomingMsg = {
        ...msg,
        self: msg.from === username,
        time:
          msg.time ||
          new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
      };
      setMessages((prev) => [...prev, incomingMsg]);
    };

    socket.onopen = () => console.log('Conectado al servidor');
    setWs(socket);

    return () => socket.close();
  }, [username]);

  const getTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const register = () => {
    if (!username.trim() || !ws) return;
    ws.send(JSON.stringify({ type: 'register', from: username }));
    setConnected(true);
  };

  const sendMessage = () => {
    if (!input.trim() || !ws) return;
    const newMsg: Message = {
      type: 'message',
      text: input,
      self: true,
      time: getTime(),
    };
    setMessages((prev) => [...prev, newMsg]);
    ws.send(JSON.stringify({ type: 'message', text: input }));
    setInput('');
  };

  const sendFile = (file: File) => {
    if (!ws) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      const newMsg: Message = {
        type: 'file',
        filename: file.name,
        file: base64,
        self: true,
        time: getTime(),
      };
      setMessages((prev) => [...prev, newMsg]);
      ws.send(
        JSON.stringify({
          type: 'file',
          filename: file.name,
          file: base64,
        }),
      );
    };
    reader.readAsDataURL(file);
  };

  if (!connected) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4 text-black">
        <input
          placeholder="Tu nombre"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-4 w-64 rounded-lg border p-2 text-center"
        />
        <button
          onClick={register}
          className="rounded-lg bg-blue-500 px-6 py-2 text-white shadow-md transition hover:bg-blue-600"
        >
          Entrar al chat
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 p-4 text-black">
      <div className="flex flex-1 flex-col space-y-2 overflow-y-auto rounded-lg border bg-white p-3">
        {messages.map((msg, idx) => {
          const isImage = msg.filename?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
          return (
            <div key={idx} className={`flex ${msg.self ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`relative max-w-xs rounded-2xl px-3 py-2 text-sm shadow ${
                  msg.self
                    ? 'rounded-br-none bg-green-200 text-right'
                    : 'rounded-bl-none bg-gray-200 text-left'
                }`}
              >
                {/* Texto */}
                {msg.text && <p>{msg.text}</p>}

                {/* Imagen */}
                {msg.file && isImage && (
                  <img
                    src={`data:image/*;base64,${msg.file}`}
                    alt={msg.filename}
                    className="mt-1 max-w-full rounded-lg"
                  />
                )}

                {/* Archivo */}
                {msg.file && !isImage && (
                  <a
                    href={`data:application/octet-stream;base64,${msg.file}`}
                    download={msg.filename}
                    className="text-blue-500 underline"
                  >
                    📎 {msg.filename}
                  </a>
                )}

                {/* Hora */}
                <div className="mt-1 text-right text-[10px] text-gray-500">{msg.time}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex space-x-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 rounded-full border p-2 focus:outline-none"
          placeholder="Escribe un mensaje..."
        />
        <button
          onClick={sendMessage}
          className="rounded-full bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
        >
          ➤
        </button>
        <input
          type="file"
          onChange={(e) => e.target.files && sendFile(e.target.files[0])}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer rounded-full bg-gray-200 p-2 transition hover:bg-gray-300"
        >
          📎
        </label>
      </div>
    </div>
  );
}
