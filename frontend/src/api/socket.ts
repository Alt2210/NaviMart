import { io, Socket } from 'socket.io-client';
import { getStoredTokens } from './client';
import type { AppNotification, ShoppingList } from './types';

const SOCKET_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/api\/?$/, '') ??
  'http://localhost:3000';

export type ServerEvents = {
  'shoppingList:updated': (list: ShoppingList) => void;
  'shoppingList:removed': (payload: { id: string }) => void;
  'notification:new': (notification: AppNotification & { createdAt?: string }) => void;
};

let socket: Socket | null = null;

export function connectSocket(): Socket | null {
  const tokens = getStoredTokens();
  if (!tokens?.accessToken) return null;

  if (socket) {
    socket.auth = { token: tokens.accessToken };
    if (!socket.connected) socket.connect();
    return socket;
  }

  socket = io(SOCKET_URL, {
    auth: { token: tokens.accessToken },
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 2000,
    transports: ['websocket'],
  });

  // Re-read the (possibly refreshed) access token on every reconnect attempt.
  socket.io.on('reconnect_attempt', () => {
    const current = getStoredTokens();
    if (socket && current?.accessToken) {
      socket.auth = { token: current.accessToken };
    }
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function onSocketEvent<E extends keyof ServerEvents>(
  event: E,
  handler: ServerEvents[E],
): () => void {
  const active = connectSocket();
  if (!active) return () => undefined;
  active.on(event as string, handler as (...args: unknown[]) => void);
  return () => {
    active.off(event as string, handler as (...args: unknown[]) => void);
  };
}
