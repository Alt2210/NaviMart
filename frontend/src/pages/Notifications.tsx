import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Notifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'warning',
      title: 'Sắp hết hạn',
      message: 'Sữa tươi TH True Milk trong tủ lạnh sẽ hết hạn vào ngày mai.',
      time: '1 giờ trước',
      read: false,
      icon: 'warning',
      actionUrl: '/pantry'
    },
    {
      id: 2,
      type: 'info',
      title: 'Gợi ý món ăn',
      message: 'Dựa trên thực phẩm bạn đang có, hôm nay bạn có thể nấu Salad Bơ Trứng.',
      time: '3 giờ trước',
      read: false,
      icon: 'restaurant',
      actionUrl: '/recipe-detail'
    },
    {
      id: 3,
      type: 'success',
      title: 'Gia đình',
      message: 'Nguyễn Thu đã thêm "Thịt bò" vào danh sách đi chợ.',
      time: 'Hôm qua',
      read: true,
      icon: 'group',
      actionUrl: '/lists'
    }
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'warning': return 'text-error';
      case 'success': return 'text-primary';
      case 'info': return 'text-secondary';
      default: return 'text-on-surface-variant';
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
              {notifications.some(n => !n.read) && (
                <button 
                  onClick={markAllAsRead}
                  className="text-primary hover:bg-primary-container/50 px-3 py-1.5 rounded-lg font-label-sm text-label-sm transition-colors"
                >
                  Đánh dấu đã đọc
                </button>
              )}
            </div>

            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
              {notifications.map((notification, index) => (
                <Link 
                  key={notification.id} 
                  to={notification.actionUrl}
                  className={`flex items-start justify-between p-4 hover:bg-surface-container-low transition-colors cursor-pointer ${
                    index !== notifications.length - 1 ? 'border-b border-outline-variant/30' : ''
                  } ${notification.read ? 'opacity-70 bg-surface' : ''}`}
                >
                  <div className="flex items-start gap-4 flex-1">
                    <span className={`material-symbols-outlined mt-0.5 ${getIconColor(notification.type)}`}>
                      {notification.icon}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-body-md text-on-surface font-bold">{notification.title}</span>
                          {!notification.read && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                        </div>
                        <span className="font-label-sm text-outline shrink-0 ml-2">{notification.time}</span>
                      </div>
                      <p className="font-body-md text-on-surface-variant mt-1 pr-4">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant self-center ml-2">chevron_right</span>
                </Link>
              ))}

              {notifications.length === 0 && (
                <div className="text-center py-12">
                  <span className="material-symbols-outlined text-6xl text-surface-variant mb-4">notifications_off</span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Bạn chưa có thông báo nào</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">Hãy trở lại sau nhé.</p>
                </div>
              )}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
