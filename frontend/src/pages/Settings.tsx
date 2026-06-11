import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Settings() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="bg-background text-on-background h-screen overflow-hidden font-body-md flex flex-col">
      <header className="shrink-0 h-16 bg-surface flex items-center px-4 border-b border-outline-variant z-40">
        <Link to="/profile" className="text-on-surface p-2 -ml-2 mr-2 rounded-full hover:bg-surface-container-high transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h1 className="font-headline-sm text-headline-sm font-bold text-on-surface">Cài đặt</h1>
      </header>

      <main className="flex-1 overflow-y-auto w-full">
        <div className="pt-4 px-4 md:px-8 max-w-2xl mx-auto w-full pb-[100px] md:pb-8">
        <section className="mb-8">
          <h2 className="font-headline-sm text-headline-sm text-primary mb-4">Giao diện</h2>
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-outline-variant/30">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant">dark_mode</span>
                <span className="font-body-md text-on-surface">Chế độ tối</span>
              </div>
              <div className="relative">
                <input 
                  className="sr-only peer" 
                  type="checkbox" 
                  id="darkModeToggle" 
                  checked={isDarkMode}
                  onChange={toggleDarkMode}
                />
                <label htmlFor="darkModeToggle" className="w-11 h-6 bg-surface-variant rounded-full peer peer-checked:bg-primary opacity-70 peer-checked:opacity-100 block cursor-pointer transition-colors relative after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></label>
              </div>
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant">language</span>
                <span className="font-body-md text-on-surface">Ngôn ngữ</span>
              </div>
              <span className="font-body-md text-on-surface-variant flex items-center gap-1 cursor-pointer">
                Tiếng Việt <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </span>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="font-headline-sm text-headline-sm text-primary mb-4">Dữ liệu</h2>
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-outline-variant/30 cursor-pointer hover:bg-surface-container-low transition-colors">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant">sync</span>
                <span className="font-body-md text-on-surface">Đồng bộ hóa dữ liệu</span>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
            </div>
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-surface-container-low transition-colors text-error">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-error">delete_forever</span>
                <span className="font-body-md font-bold">Xóa tài khoản</span>
              </div>
            </div>
          </div>
        </section>
        </div>
      </main>
    </div>
  );
}
