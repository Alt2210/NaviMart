import { useEffect } from 'react';
import { onSocketEvent } from '../api/socket';
import { logoIconTransparentUrl } from '../assets/logos';
import { useAuth } from '../contexts/AuthContext';

// Listens for server-pushed notifications and surfaces them as native browser notifications.
export default function RealtimeNotifications() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => undefined);
    }

    const unsubscribe = onSocketEvent('notification:new', (notification) => {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.body,
          icon: logoIconTransparentUrl,
          tag: notification.id,
        });
      }
    });

    return unsubscribe;
  }, [isAuthenticated]);

  return null;
}
