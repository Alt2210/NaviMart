import { Link } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import SideNav from '../components/SideNav';

export default function StatsDashboard() {
  return (
    <div className="bg-surface-bright text-on-surface font-body-lg h-screen overflow-hidden flex">
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
              <span className="font-bold text-primary text-sm">Báo cáo thống kê</span>
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
          <div className="p-margin-mobile md:p-8 w-full max-w-7xl mx-auto pb-[100px] md:pb-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-headline-md text-headline-md text-primary mb-2">Tổng quan chi tiêu</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Tháng 10, 2024</p>
          </div>
          <div className="flex bg-surface-container rounded-lg p-1 w-fit border border-outline-variant/30">
            <button className="px-5 py-2 bg-surface-container-lowest text-primary rounded shadow-sm font-label-sm text-label-sm font-bold transition-colors">Tháng này</button>
            <button className="px-5 py-2 text-on-surface-variant hover:text-on-surface rounded font-label-sm text-label-sm transition-colors hover:bg-surface-container-highest/50">Tuần này</button>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-surface-variant relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-primary-container text-[18px]">savings</span>
                </div>
                <h3 className="font-body-md text-body-md">Tiết kiệm được</h3>
              </div>
            </div>
            <p className="font-display-lg text-display-lg text-primary">450.000₫</p>
            <div className="mt-3 flex items-center gap-1 font-label-sm text-label-sm text-tertiary bg-tertiary-container/20 w-fit px-2 py-1 rounded">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              <span>+12% so với tháng trước</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-surface-variant relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <div className="w-8 h-8 rounded-full bg-secondary-container/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary text-[18px]">shopping_bag</span>
                </div>
                <h3 className="font-body-md text-body-md">Tổng số món đã mua</h3>
              </div>
            </div>
            <p className="font-display-lg text-display-lg text-on-surface">124 <span className="font-body-lg text-body-lg text-on-surface-variant">món</span></p>
            <div className="mt-3 flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-[14px]">local_mall</span>
              <span>Từ 5 chuyến đi chợ</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-surface-variant relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <div className="w-8 h-8 rounded-full bg-error-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-error text-[18px]">delete_sweep</span>
                </div>
                <h3 className="font-body-md text-body-md">Tỷ lệ lãng phí</h3>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="font-display-lg text-display-lg text-error">4.2%</p>
              <p className="font-label-sm text-label-sm text-on-surface-variant">~ 85.000₫</p>
            </div>
            <div className="mt-3 flex items-center gap-1 font-label-sm text-label-sm text-tertiary bg-tertiary-container/20 w-fit px-2 py-1 rounded">
              <span className="material-symbols-outlined text-[14px]">trending_down</span>
              <span>-2% tốt hơn tuần trước</span>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-surface-variant flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Chi tiêu đi chợ theo tuần</h3>
              <button className="text-primary hover:bg-surface-container p-2 rounded-full transition-colors">
                <span className="material-symbols-outlined">more_horiz</span>
              </button>
            </div>
            <div className="flex-1 flex flex-col justify-end pt-4 relative min-h-[250px]">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 text-on-surface-variant font-label-sm text-label-sm">
                <div className="flex items-center w-full border-b border-surface-container-highest h-0"><span className="bg-surface-container-lowest pr-2 -translate-y-1/2">2M</span></div>
                <div className="flex items-center w-full border-b border-surface-container-highest h-0"><span className="bg-surface-container-lowest pr-2 -translate-y-1/2">1.5M</span></div>
                <div className="flex items-center w-full border-b border-surface-container-highest h-0"><span className="bg-surface-container-lowest pr-2 -translate-y-1/2">1M</span></div>
                <div className="flex items-center w-full border-b border-surface-container-highest h-0"><span className="bg-surface-container-lowest pr-2 -translate-y-1/2">500k</span></div>
                <div className="flex items-center w-full border-b border-outline-variant h-0"><span className="bg-surface-container-lowest pr-2 -translate-y-1/2">0</span></div>
              </div>
              <div className="flex items-end justify-around w-full h-full pb-8 pl-10 z-10 relative">
                <div className="w-12 md:w-16 h-[40%] bg-surface-container hover:bg-primary-container rounded-t-md transition-colors relative group cursor-pointer"></div>
                <div className="w-12 md:w-16 h-[65%] bg-surface-container hover:bg-primary-container rounded-t-md transition-colors relative group cursor-pointer"></div>
                <div className="w-12 md:w-16 h-[85%] bg-primary hover:bg-tertiary rounded-t-md transition-colors relative group cursor-pointer shadow-sm"></div>
                <div className="w-12 md:w-16 h-[30%] bg-surface-container hover:bg-primary-container rounded-t-md transition-colors relative group cursor-pointer"></div>
              </div>
              <div className="absolute bottom-0 w-full pl-10 flex justify-around font-label-sm text-label-sm text-on-surface-variant pt-2">
                <span>Tuần 1</span>
                <span>Tuần 2</span>
                <span className="text-primary font-bold">Tuần 3</span>
                <span>Tuần 4</span>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-surface-variant flex flex-col">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-6">Tỷ lệ nhóm thực phẩm</h3>
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="relative w-48 h-48 rounded-full shadow-inner" style={{ background: "conic-gradient(var(--tw-colors-primary) 0% 55%, var(--tw-colors-secondary) 55% 85%, var(--tw-colors-secondary-container) 85% 100%)" }}>
                <div className="absolute inset-0 m-auto w-32 h-32 bg-surface-container-lowest rounded-full flex flex-col items-center justify-center shadow-inner">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Tổng chi</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold">4.5M₫</span>
                </div>
              </div>
              <div className="mt-8 w-full flex flex-col gap-3 font-body-md text-body-md">
                <div className="flex items-center justify-between p-2 rounded hover:bg-surface-container-lowest transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-4 h-4 rounded bg-primary shadow-sm"></span>
                    <span className="text-on-surface">Rau củ & Trái cây</span>
                  </div>
                  <span className="font-bold text-on-surface-variant">55%</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded hover:bg-surface-container-lowest transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-4 h-4 rounded bg-secondary shadow-sm"></span>
                    <span className="text-on-surface">Thịt cá & Hải sản</span>
                  </div>
                  <span className="font-bold text-on-surface-variant">30%</span>
                </div>
              </div>
            </div>
          </div>
        </section>
          </div>
        </main>
      </div>
      
      <BottomNav />
    </div>
  );
}
