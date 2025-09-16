/* eslint-disable @typescript-eslint/no-explicit-any */
import { WebSocketServer, WebSocket } from 'ws';

export interface Client {
  name: string;
  ws: WebSocket;
}

interface IncomingMessage {
  type: 'register' | 'message' | 'private' | 'file';
  to?: string;
  from?: string;
  text?: string;
  filename?: string;
  file?: string;
}

const clients: Record<string, WebSocket> = {};

const wss = new WebSocketServer({ port: 5000 });
console.log('✅ Servidor WebSocket escuchando en ws://localhost:5000');

/**
 * Returns the current time as a string formatted with two-digit hour and minute.
 *
 * @returns {string} The current time in "HH:MM" format based on the user's locale.
 */
function getTime() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

wss.on('connection', (ws) => {
  let username = '';

  ws.on('message', async (raw) => {
    const msg = JSON.parse(raw.toString()) as IncomingMessage;

    if (msg.type === 'register' && msg.from) {
      if (clients[msg.from]) {
        ws.send(JSON.stringify({ type: 'error', text: 'Nombre en uso' }));
        ws.close();
        return;
      }
      username = msg.from;
      clients[username] = ws;
      console.log(`[+] ${username} conectado`);
      broadcast(
        {
          type: 'message',
          text: `🔔 ${username} se ha unido al chat`,
          time: getTime(),
        },
        username,
      );
      broadcastUsers();
      return;
    }

    if (msg.type === 'message' && msg.text) {
      broadcast({ type: 'message', text: msg.text, from: username, time: getTime() }, username);
      return;
    }

    if (msg.type === 'private' && msg.to && msg.text) {
      sendTo(msg.to, {
        type: 'private',
        from: username,
        text: msg.text,
        time: getTime(),
      });
      return;
    }

    if (msg.type === 'file' && msg.filename && msg.file) {
      const payload = {
        type: msg.to ? 'file-private' : 'file',
        from: username,
        filename: msg.filename,
        file: msg.file,
        time: getTime(),
        to: msg.to,
      };
      if (msg.to) {
        sendTo(msg.to, payload);
        sendTo(username, payload);
        console.log(`📂 Archivo privado ${msg.filename} enviado por ${username} a ${msg.to}`);
      } else {
        broadcast(payload, username);
        console.log(`📂 Archivo ${msg.filename} enviado por ${username}`);
      }
      return;
    }
  });

  ws.on('close', () => {
    if (username) {
      console.log(`[-] ${username} desconectado`);
      delete clients[username];
      broadcast({
        type: 'message',
        text: `🔕 ${username} ha salido del chat`,
        time: getTime(),
      });
      broadcastUsers();
    }
  });
});

function broadcast(msg: any, exclude?: string) {
  const data = JSON.stringify(msg);
  for (const [name, client] of Object.entries(clients)) {
    if (name !== exclude) client.send(data);
  }
}

function sendTo(to: string, msg: any) {
  if (clients[to]) clients[to].send(JSON.stringify(msg));
}

function listUsers(): string[] {
  return Object.keys(clients);
}

function broadcastUsers() {
  broadcast({ type: 'users', users: listUsers() });
}
