import { Link, useLocation } from 'react-router-dom';
import { logoIconTransparentUrl } from '../assets/logos';

const navItems = [
  { path: '/home', icon: 'home', label: 'Trang chủ' },
  { path: '/pantry', icon: 'kitchen', label: 'Kho' },
  { path: '/lists', icon: 'shopping_cart', label: 'Danh sách' },
  { path: '/meals', icon: 'restaurant', label: 'Bữa ăn' },
  { path: '/recipe-suggestion', icon: 'skillet', label: 'Gợi ý món' },
  { path: '/ai-chef', icon: 'robot_2', label: 'NaviChef AI' },
  { path: '/reports', icon: 'assessment', label: 'Báo cáo' },
  { path: '/family', icon: 'group', label: 'Gia đình' },
  { path: '/profile', icon: 'person', label: 'Hồ sơ' },
];

export default function SideNav() {
  const location = useLocation();

  return (
    <nav className="hidden md:flex flex-col bg-surface-container-low border-r border-outline-variant fixed left-0 top-0 h-full w-64 py-6 px-4 z-40">
      <div className="mb-8 px-2 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-sm shrink-0">
          <img src={logoIconTransparentUrl} alt="NaviMart Icon" className="w-6 h-6 object-contain" />
        </div>
        <span className="font-headline-sm text-headline-sm font-bold text-primary">NaviMart</span>
      </div>
      <ul className="flex flex-col gap-2 font-label-sm text-label-sm w-full">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 transition-all duration-150 rounded-xl ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container font-bold scale-100'
                    : 'text-on-surface-variant hover:bg-surface-container-highest scale-95 hover:scale-100'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {item.icon}
                </span>
                <span className="font-body-lg text-body-lg">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
