import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/home', icon: 'home', label: 'Trang chủ' },
  { path: '/pantry', icon: 'kitchen', label: 'Kho' },
  { path: '/lists', icon: 'shopping_cart', label: 'Danh sách' },
  { path: '/meals', icon: 'restaurant', label: 'Bữa ăn' },
  { path: '/reports', icon: 'assessment', label: 'Báo cáo' },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="md:hidden bg-surface dark:bg-surface-dim border-t border-outline-variant shadow-md fixed bottom-0 left-0 w-full z-50 h-[69px] flex justify-around items-center px-2 pb-safe">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center rounded-lg p-2 transition-all active:scale-90 duration-200 ${
              isActive
                ? 'bg-secondary-container dark:bg-on-secondary-fixed-variant text-on-secondary-container dark:text-secondary-fixed rounded-full px-4 py-1'
                : 'text-on-surface-variant dark:text-outline hover:bg-surface-container-highest'
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {item.icon}
            </span>
            <span className="font-label-sm text-label-sm mt-1">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
