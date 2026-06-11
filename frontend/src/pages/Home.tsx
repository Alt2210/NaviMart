import { useState } from 'react';
import { Link } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import SideNav from '../components/SideNav';

export default function Home() {
  const [shoppingList, setShoppingList] = useState([
    { id: 1, name: 'Thịt bò (500g)', checked: false },
    { id: 2, name: 'Rau muống (1 bó)', checked: false },
    { id: 3, name: 'Cà chua (3 quả)', checked: false },
  ]);

  const toggleItem = (id: number) => {
    setShoppingList(shoppingList.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  return (
    <div className="bg-background text-on-background h-screen overflow-hidden flex">
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
              <span className="font-bold text-primary text-sm">Trang chủ</span>
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

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto w-full relative">
          <div className="flex flex-col max-w-7xl mx-auto w-full px-margin-mobile py-stack-md gap-stack-md pb-[100px] md:pb-8">
            <section className="py-4 flex justify-between items-center">
              <div>
                <h1 className="font-headline-md text-headline-md text-primary mb-2">Chào buổi sáng, Mai!</h1>
                <p className="font-body-md text-body-md text-on-surface-variant">Hôm nay bạn muốn nấu món gì?</p>
              </div>
              <Link to="/add-item" className="hidden md:flex items-center gap-2 bg-primary-container text-on-primary-container px-4 py-2 rounded-lg font-body-md shadow-sm hover:opacity-90 transition-opacity">
                <span className="material-symbols-outlined">add</span>
                Thêm thực phẩm
              </Link>
            </section>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-stack-md">
            {/* Section 1: Thực phẩm sắp hết hạn */}
            <section className="md:col-span-8 bg-surface-container-low rounded-xl p-4 border border-outline-variant shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                  Sắp hết hạn
                </h2>
                <Link to="/pantry" className="font-label-sm text-label-sm text-primary underline">Xem tất cả</Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Item Card 1 */}
                <div className="bg-surface rounded-lg p-3 shadow-sm border border-error-container relative overflow-hidden group">
                  <div className="absolute top-0 right-0 bg-error text-on-error font-label-sm text-xs px-2 py-1 rounded-bl-lg z-10">2 ngày</div>
                  <img alt="Sữa tươi" className="w-full h-24 object-cover rounded mb-2 transition-transform duration-300 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_m4HFVEfHWu22-gXXODkbghMrhDkevYcCqxnPHZ7c73cklCbS8P6jKEWuucTpazjPtab5mnPLpFRI42OrwQwjtxlrMOjXyKvd9XmaMTlijr1wfNKstHN1YlVHvV-Y_8VHkHn6yHPTMEO8zkIWPcEw-YuXdVZSIwKXwrH6nTXWzLqPiDkrLZHVzw60ac76xVM6YzaWH9gt5FsDR3sdiZ9gewtqe_M4bMwuFpbEQFv80nLrfNQoFjNy6FlcWKV4A0980zUIpvvju4vG"/>
                  <h3 className="font-body-md text-body-md text-on-surface mb-1">Sữa tươi TH True Milk</h3>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Còn 1 lít</p>
                </div>
                {/* Item Card 2 */}
                <div className="bg-surface rounded-lg p-3 shadow-sm border border-secondary-container relative overflow-hidden group">
                  <div className="absolute top-0 right-0 bg-secondary-container text-on-secondary-container font-label-sm text-xs px-2 py-1 rounded-bl-lg z-10">3 ngày</div>
                  <img alt="Chuối" className="w-full h-24 object-cover rounded mb-2 transition-transform duration-300 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuARAZ3NY4OWIQCxdAbAvIw2p5UUWnFDY30OI_EGlEosDtn_OzGh-FpgGHh4CL_iD0TkYzpklnOycT9CHk54d7S61pEVCGL-VRV5-Pk3I1oGpl-m_elyKYFBHbMQWR8s3YwchIT8ypWBsYxf716mTQ8L6vM4aG1cnxME2Z-7Pe5DwRTaO7JoXkR350UKgKySwZE5jfvyEvqJrW4usEZ_bHZWPeIR0AZeDsNQPdig-dIGbkxzG5hTjfOjIAl3ARXBip2vfMEqIrv23sYv"/>
                  <h3 className="font-body-md text-body-md text-on-surface mb-1">Chuối già Nam Mỹ</h3>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Còn 4 quả</p>
                </div>
                {/* Empty Slot */}
                <Link to="/add-item" className="bg-surface-container rounded-lg p-3 border border-dashed border-outline-variant flex flex-col items-center justify-center text-center opacity-70 hover:opacity-100 transition-opacity bg-primary/5 hover:bg-primary/10">
                  <span className="material-symbols-outlined text-primary mb-2 text-3xl">add_circle</span>
                  <p className="font-label-sm text-label-sm text-primary font-medium">Thêm thực phẩm</p>
                </Link>
              </div>
            </section>

            {/* Section 2: Danh sách đi chợ */}
            <section className="md:col-span-4 bg-surface-container rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Cần mua hôm nay</h2>
                <span className="bg-primary-container text-on-primary-container font-label-sm text-label-sm px-2 py-1 rounded-full">3 món</span>
              </div>
              <div className="space-y-3">
                {shoppingList.map((item) => (
                  <label key={item.id} className="flex items-center gap-3 p-2 bg-surface rounded-lg cursor-pointer hover:bg-surface-container-high transition-colors">
                    <input 
                      className="w-5 h-5 text-primary border-outline-variant rounded focus:ring-primary" 
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleItem(item.id)}
                    />
                    <span className={`font-body-md text-body-md text-on-surface flex-grow ${item.checked ? 'line-through text-on-surface-variant opacity-70' : ''}`}>
                      {item.name}
                    </span>
                  </label>
                ))}
              </div>
              <Link to="/add-item" className="w-full mt-4 bg-surface text-primary border border-outline-variant font-body-md text-body-md py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined">add</span> Thêm món
              </Link>
            </section>

            {/* Section 3: Gợi ý bữa ăn */}
            <section className="md:col-span-12">
              <h2 className="font-headline-sm text-headline-sm text-on-surface mb-4">Gợi ý hôm nay</h2>
              <div className="relative rounded-xl overflow-hidden shadow-sm group cursor-pointer h-64 md:h-80">
                <img alt="Thịt bò xào & Canh rau muống" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBA-fcY--KODDAuj7NqV8_5dBbCxeiI0xuqy0wk3-vICq0gHxMisijYhikVQ_0deJzSVmUIamIHBNrGKHfeQfm3vQpqSPtnWiy2pQvdnavcMhGCCVkrsM8K8Kyc9LWBX3hVsyqhJIac9l1ODG7_dSgXHzmg5KiGBIS5qlDN7Ez3ixFsIgC_5VloYZxPTin-Qd4E90XdZJgk3GCL72t0mioXRcemppoKzB7FDZaxTLfUY71hWl_u7LLrhbuPwtyPuburqybsggquk392"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6">
                  <div className="flex gap-2 mb-2">
                    <span className="bg-tertiary-container text-on-tertiary-container font-label-sm px-3 py-1 rounded-full backdrop-blur-sm bg-opacity-90">Tận dụng đồ ăn</span>
                    <span className="bg-surface/20 text-on-primary font-label-sm px-3 py-1 rounded-full backdrop-blur-sm border border-surface/30">30 phút</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-primary mb-1">Thịt bò xào & Canh rau muống</h3>
                  <p className="font-body-md text-body-md text-surface-variant opacity-90">Bữa tối nhanh gọn, dinh dưỡng cho cả gia đình.</p>
                  <Link to="/recipe-detail" className="mt-4 self-start bg-primary text-on-primary font-body-md text-body-md px-6 py-2 rounded-lg shadow-md hover:bg-surface-tint transition-colors text-center">
                    Xem công thức
                  </Link>
                </div>
              </div>
            </section>
          </div>
          </div>

          {/* AI Chef FAB */}
          <Link to="/ai-chef" className="fixed bottom-[calc(69px+env(safe-area-inset-bottom)+16px)] right-4 md:right-8 md:bottom-8 w-14 h-14 bg-tertiary text-on-tertiary rounded-2xl shadow-[0_4px_16px_rgba(var(--color-tertiary-rgb),0.4)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40 animate-bounce" style={{ animationDuration: '3s' }}>
            <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>robot_2</span>
          </Link>

          {/* Footer */}
          <footer className="hidden md:block bg-surface-container-lowest dark:bg-inverse-surface border-t border-outline-variant w-full mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center w-full py-8 px-margin-mobile max-w-7xl mx-auto gap-stack-md">
              <img src="/src/assets/logo-1-primary.png" alt="NaviMart" className="h-6 object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all" />
              <nav className="flex gap-6">
                <Link to="#" className="text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-colors font-body-md text-body-md">Về chúng tôi</Link>
                <Link to="#" className="text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-colors font-body-md text-body-md">Chính sách</Link>
                <Link to="#" className="text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-colors font-body-md text-body-md">Hướng dẫn</Link>
              </nav>
              <div className="font-label-sm text-label-sm text-on-surface-variant dark:text-surface-variant">© 2024 NaviMart. All rights reserved.</div>
            </div>
          </footer>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
