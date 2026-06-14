import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import NotificationDropdown from '../components/NotificationDropdown';
import SideNav from '../components/SideNav';
import { useDialog } from '../contexts/DialogContext';
import { useAuth } from '../contexts/AuthContext';
import { familyApi } from '../api';

const ROLE_LABELS: Record<string, string> = {
  admin: 'Quản trị viên',
  housewife: 'Người nội trợ chính',
  member: 'Thành viên',
};

export default function Profile() {
  const navigate = useNavigate();
  const { showConfirm } = useDialog();
  const { user, logout } = useAuth();
  const [familyName, setFamilyName] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    familyApi
      .current()
      .then((family) => {
        if (!cancelled) setFamilyName(family.name);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = () => {
    showConfirm('Bạn có chắc chắn muốn đăng xuất không?', async () => {
      await logout();
      navigate('/login');
    });
  };

  const contact = [user?.email, user?.phone].filter(Boolean).join(' • ');

  return (
    <div className="bg-background text-on-background font-body-md h-screen overflow-hidden flex">
      <SideNav />

      <div className="flex-1 flex flex-col md:ml-64 w-full h-full relative">
        {/* TopNavBar (Web) */}
        <header className="hidden md:flex bg-surface dark:bg-surface-dim border-b border-outline-variant w-full shrink-0 z-30">
          <div className="flex justify-between items-center w-full h-nav-height px-margin-mobile max-w-7xl mx-auto">
            <div className="flex items-center gap-2 text-on-surface-variant">
              <Link to="/home" className="hover:text-primary transition-colors flex items-center">
                <span className="material-symbols-outlined text-[20px]">home</span>
              </Link>
              <span className="text-sm">/</span>
              <span className="font-bold text-primary text-sm">Hồ sơ cá nhân</span>
            </div>
            <div className="flex gap-4">
              <NotificationDropdown />
              <Link to="/profile" className="text-on-surface-variant font-medium hover:bg-surface-container-high dark:hover:bg-surface-container transition-colors p-2 rounded-full flex items-center justify-center active:opacity-80 active:scale-95 duration-150">
                <span className="material-symbols-outlined">account_circle</span>
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto w-full">
          <div className="p-margin-mobile md:p-8 w-full max-w-4xl mx-auto pb-[100px] md:pb-8">
            <header className="flex items-center justify-between mb-8">
          <h1 className="font-headline-md text-headline-md text-primary mb-2">Hồ sơ cá nhân</h1>
          <Link to="/edit-profile" className="bg-surface-container-high hover:bg-surface-container-highest text-on-surface p-2 rounded-full transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined">edit</span>
          </Link>
        </header>

        <section className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary-container shrink-0 bg-primary-container flex items-center justify-center">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="font-display-sm text-display-sm font-bold text-on-primary-container">
                {(user?.displayName ?? '?').charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="font-display-sm text-display-sm font-bold text-on-surface">{user?.displayName ?? 'Người dùng'}</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">{contact || 'Chưa cập nhật liên hệ'}</p>
            <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="px-3 py-1 bg-primary-container text-on-primary-container text-label-sm rounded-full font-medium">{ROLE_LABELS[user?.role ?? 'member']}</span>
              {familyName && (
                <span className="px-3 py-1 bg-surface-container-high text-on-surface text-label-sm rounded-full">Gia đình "{familyName}"</span>
              )}
            </div>
          </div>
        </section>

        <section className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden mb-6">
          <h3 className="px-6 py-4 border-b border-outline-variant/30 font-headline-sm text-headline-sm font-semibold text-on-surface">Cài đặt chung</h3>
          <div className="flex flex-col">
            <Link to="/settings" className="flex items-center justify-between px-6 py-4 hover:bg-surface-container-low transition-colors cursor-pointer border-b border-outline-variant/30">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant">settings</span>
                <span className="font-body-md text-body-md text-on-surface">Tùy chọn ứng dụng</span>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
            </Link>
            <Link to="/notifications" className="flex items-center justify-between px-6 py-4 hover:bg-surface-container-low transition-colors cursor-pointer border-b border-outline-variant/30">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
                <span className="font-body-md text-body-md text-on-surface">Thông báo</span>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
            </Link>
            <div className="flex items-center justify-between px-6 py-4 hover:bg-surface-container-low transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant">security</span>
                <span className="font-body-md text-body-md text-on-surface">Quyền riêng tư & Bảo mật</span>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
            </div>
            {user?.role === 'admin' && (
              <Link to="/admin" className="flex items-center justify-between px-6 py-4 hover:bg-surface-container-low transition-colors cursor-pointer border-t border-outline-variant/30">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-on-surface-variant">admin_panel_settings</span>
                  <span className="font-body-md text-body-md text-on-surface">Trang quản trị</span>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
              </Link>
            )}
          </div>
        </section>
        
        <button onClick={handleLogout} className="w-full py-4 text-error font-body-lg text-body-lg font-bold bg-error-container/20 hover:bg-error-container/40 rounded-xl transition-colors border border-error/20 flex items-center justify-center gap-2">
          <span className="material-symbols-outlined">logout</span>
          Đăng xuất
        </button>
          </div>
        </main>
      </div>
      
      <BottomNav />
    </div>
  );
}
