import { Link, useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import SideNav from '../components/SideNav';
import { useDialog } from '../contexts/DialogContext';

export default function Profile() {
  const navigate = useNavigate();
  const { showConfirm, showAlert } = useDialog();

  const handleLogout = () => {
    showConfirm('Bạn có chắc chắn muốn đăng xuất không?', () => {
      showAlert('Đã đăng xuất!');
      navigate('/login');
    });
  };

  return (
    <div className="bg-background text-on-background font-body-lg h-screen overflow-hidden flex">
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
              <Link to="/notifications" className="text-on-surface-variant font-medium hover:bg-surface-container-high dark:hover:bg-surface-container transition-colors p-2 rounded-full flex items-center justify-center active:opacity-80 active:scale-95 duration-150">
                <span className="material-symbols-outlined">notifications</span>
              </Link>
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
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary-container shrink-0">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyl8yaRsuYJ42CVzel8-hugkAllxoAD37iFPM_sRGu7rM6F_D1wlMdaVeMM99txYq6cFtErP4pbvEPn6KW8axA-TfBoSgYTfnQSsLJl6era0guCk8IcZrVFE6yen0zae41Ph2W9RZ9RnBTgKxWWQBOhIhxVwimrf-ggYb9GteJ_gdV_tK4vPmYzdZ6qm6Dk5o5nlN-n73JZ2JhhkfqsOuLT9xNb_A5BZ_ZtspMF99qeDfe_SVZwxL3ZRLdnHJtcFKceu-JFgnmoQTB" alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="font-display-sm text-display-sm font-bold text-on-surface">Nguyễn Thu</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">m.thu.nguyen@email.com • 0901234567</p>
            <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="px-3 py-1 bg-primary-container text-on-primary-container text-label-sm rounded-full font-medium">Người nội trợ chính</span>
              <span className="px-3 py-1 bg-surface-container-high text-on-surface text-label-sm rounded-full">Gia đình "Bếp Ấm Áp"</span>
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
