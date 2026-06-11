import { useCallback, useEffect, useState } from 'react';
import { notificationsApi } from '../api';
import type { AppNotification } from '../api';
import { ListRowsSkeleton } from '../components/Skeleton';
import { useDialog } from '../contexts/DialogContext';

function relativeTime(value?: string) {
  if (!value) return '';
  const diffMs = Date.now() - new Date(value).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'Vừa xong';
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Hôm qua';
  return `${days} ngày trước`;
}

function iconFor(type: string) {
  if (type.includes('expir')) return { icon: 'warning', color: 'text-error' };
  if (type.includes('recipe') || type.includes('meal')) return { icon: 'restaurant', color: 'text-secondary' };
  if (type.includes('family')) return { icon: 'group', color: 'text-primary' };
  if (type.includes('shopping') || type.includes('list')) return { icon: 'shopping_cart', color: 'text-primary' };
  return { icon: 'notifications', color: 'text-on-surface-variant' };
}

export default function Notifications() {
  const { showAlert } = useDialog();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const handleError = useCallback(
    (err: unknown, fallback: string) => {
      showAlert(err instanceof Error ? err.message : fallback);
    },
    [showAlert],
  );

  useEffect(() => {
    let cancelled = false;
    notificationsApi
      .list({ limit: 50 })
      .then((data) => {
        if (!cancelled) setNotifications(data);
      })
      .catch((err) => handleError(err, 'Không tải được thông báo.'))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [handleError]);

  const markAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      const now = new Date().toISOString();
      setNotifications((items) => items.map((n) => ({ ...n, readAt: n.readAt ?? now })));
    } catch (err) {
      handleError(err, 'Không đánh dấu được thông báo.');
    }
  };

  const markAsRead = async (notification: AppNotification) => {
    if (notification.readAt) return;
    try {
      const updated = await notificationsApi.markAsRead(notification.id);
      setNotifications((items) => items.map((n) => (n.id === notification.id ? updated : n)));
    } catch {
      // non-blocking
    }
  };

  return (
    <div className="bg-background text-on-background h-screen overflow-hidden font-body-md flex flex-col">
      <header className="shrink-0 h-16 bg-surface flex items-center px-4 border-b border-outline-variant z-40">
        <button onClick={() => window.history.back()} className="text-on-surface p-2 -ml-2 mr-2 rounded-full hover:bg-surface-container-high transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="font-headline-sm text-headline-sm font-bold text-on-surface">Thông báo</h1>
      </header>

      <main className="flex-1 overflow-y-auto w-full">
        <div className="pt-4 px-4 md:px-8 max-w-2xl mx-auto w-full pb-[100px] md:pb-8">

          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-headline-sm text-headline-sm text-primary">Tất cả thông báo</h2>
              {notifications.some(n => !n.readAt) && (
                <button
                  onClick={markAllAsRead}
                  className="text-primary hover:bg-primary-container/50 px-3 py-1.5 rounded-lg font-label-sm text-label-sm transition-colors"
                >
                  Đánh dấu đã đọc
                </button>
              )}
            </div>

            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
              {loading ? (
                <div className="p-4">
                  <ListRowsSkeleton count={5} />
                </div>
              ) : (
                <>
                  {notifications.map((notification, index) => {
                    const { icon, color } = iconFor(notification.type);
                    const createdAt = (notification as AppNotification & { createdAt?: string }).createdAt;
                    return (
                      <button
                        key={notification.id}
                        onClick={() => markAsRead(notification)}
                        className={`w-full text-left flex items-start justify-between p-4 hover:bg-surface-container-low transition-colors cursor-pointer ${
                          index !== notifications.length - 1 ? 'border-b border-outline-variant/30' : ''
                        } ${notification.readAt ? 'opacity-70 bg-surface' : ''}`}
                      >
                        <div className="flex items-start gap-4 flex-1">
                          <span className={`material-symbols-outlined mt-0.5 ${color}`}>
                            {icon}
                          </span>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-body-md text-on-surface font-bold">{notification.title}</span>
                                {!notification.readAt && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                              </div>
                              <span className="font-label-sm text-outline shrink-0 ml-2">{relativeTime(createdAt)}</span>
                            </div>
                            <p className="font-body-md text-on-surface-variant mt-1 pr-4">
                              {notification.body}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}

                  {notifications.length === 0 && (
                    <div className="text-center py-12">
                      <span className="material-symbols-outlined text-6xl text-surface-variant mb-4">notifications_off</span>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Bạn chưa có thông báo nào</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant">Hãy trở lại sau nhé.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
