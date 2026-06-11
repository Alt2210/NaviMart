import { useState } from 'react';
import { Link } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import SideNav from '../components/SideNav';

export default function RecipeSuggestion() {
  const [activeFilter, setActiveFilter] = useState('Tất cả');

  return (
    <div className="bg-surface text-on-surface h-screen overflow-hidden flex flex-col md:flex-row">
      <SideNav />

      <main className="flex-1 overflow-y-auto md:ml-64 w-full bg-surface relative">
        <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-surface-container-low to-transparent pointer-events-none -z-10"></div>
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 mt-4 md:mt-0 pb-[100px] md:pb-10">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-headline-md text-headline-md text-primary mb-2">Gợi ý món ăn thông minh</h1>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6">Dựa trên nguyên liệu sắp hết hạn của bạn.</p>
            </div>
            <div className="w-full md:w-[400px]">
              <label className="font-body-md text-body-md text-on-surface mb-stack-sm block font-medium">Tìm kiếm món ăn</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">search</span>
                <input className="w-full pl-12 pr-4 py-3 border border-[#C1C1C1] rounded-none bg-surface-container-lowest font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow placeholder:text-outline" placeholder="Nhập tên món hoặc nguyên liệu..." type="text"/>
                <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-surface-container-high rounded-full p-1 hover:bg-surface-container-highest transition-colors flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px] text-on-surface-variant">tune</span>
                </button>
              </div>
            </div>
          </header>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-error-container flex items-center justify-center text-error">
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Giải cứu nguyên liệu sắp hết hạn</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Link to="/recipe-detail" className="lg:col-span-2 bg-surface-container-lowest rounded-lg border border-outline-variant shadow-sm overflow-hidden flex flex-col sm:flex-row group cursor-pointer hover:shadow-md transition-all">
                <div className="relative sm:w-1/2 h-56 sm:h-auto overflow-hidden">
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKaNpg41Npm2EialKKJPtfNdQ5C22RhoMHq5huapojrTZ3uSC8kJRNDFmiq3Fgj_zfZr2gJYqJTMSTkoxUAe98M_GUvkff6kFIvg8ikmlsrXXg6kTNTjvUaOPuu4bLRGq3UMZIyIWvY-6MbkKwx8j3tvrbRvFxdamAgECSImHWkl5DOXS8zcEdfXy0Z7EgvMGzk-W5cM1q4HZUXJdEqCEB1MJTPaxV6O1ZX3i5cw5qCXFQ-BA4jamQXTYbir1q0IzM91NWjF00qNDi" alt="Salad"/>
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-error text-on-error font-label-sm text-label-sm px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm font-medium">
                      <span className="material-symbols-outlined text-[16px]">priority_high</span> Ưu tiên
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm px-3 py-1 rounded-full">Salad</span>
                      <span className="bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm px-3 py-1 rounded-full">Tốt cho sức khỏe</span>
                    </div>
                    <h4 className="font-headline-sm text-headline-sm text-on-surface mb-2 group-hover:text-primary transition-colors">Salad Ức Gà Xốt Mè Rang</h4>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-4 line-clamp-2">Sử dụng ngay xà lách và cà chua bi sắp héo để tạo ra một bữa ăn thanh mát, giàu protein.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-on-surface-variant font-body-md text-body-md">
                      <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[20px]">schedule</span> 15 phút</span>
                      <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[20px]">local_fire_department</span> 250 kcal</span>
                    </div>
                    <div className="bg-surface-container-low p-3 rounded border border-surface-container-highest">
                      <div className="flex justify-between items-end mb-2">
                        <span className="font-label-sm text-label-sm text-on-surface-variant">Nguyên liệu sẵn có trong tủ</span>
                        <span className="font-body-md text-body-md font-bold text-primary">90%</span>
                      </div>
                      <div className="w-full bg-surface-container-highest rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '90%' }}></div>
                      </div>
                      <p className="font-label-sm text-label-sm text-secondary mt-2 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">info</span> Cần mua thêm: Sốt mè rang
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
              
              <Link to="/recipe-detail" className="bg-surface-container-lowest rounded-lg border border-outline-variant shadow-sm overflow-hidden flex flex-col group cursor-pointer hover:shadow-md transition-all">
                <div className="relative h-48 overflow-hidden">
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAwd0xcItKWw1eVUEjjMBH82uh9JNum_Y2oTWHEVkU8DrEtmbhw9-uITP7l--YSSNS0SKs5ewXKAXcCRX-OX8XAXJnoh3pYK-FK2ZFTYmW1JUx2HeLPJ_x6RrmABKyzd4o3z8uKKwXY_7vWFo7MWgr32OxjCgGgdZwauR0InMm3gqihO6c-sauinFXHBy9n4H3x5eiAhaFJShmm2byOhQU8Bt8vIXlHjUaV9-54nw6IsOC7UWet4_EZWc-fnAtUx87fgiRTTREdsp_" alt="Mì Xào"/>
                  <div className="absolute top-4 left-4">
                    <span className="bg-secondary-container text-on-secondary-container font-label-sm text-label-sm px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm font-medium">
                      <span className="material-symbols-outlined text-[16px]">event_busy</span> Sắp hết hạn
                    </span>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h4 className="font-headline-sm text-headline-sm text-on-surface mb-2">Mì Xào Bò Rau Cải</h4>
                  <div className="flex items-center gap-4 text-on-surface-variant font-body-md text-body-md mb-4">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">schedule</span> 20 phút</span>
                  </div>
                  <div className="mt-auto">
                    <div className="flex justify-between items-end mb-1">
                      <span className="font-label-sm text-label-sm text-on-surface-variant">Tận dụng</span>
                      <span className="font-body-md text-body-md font-bold text-primary">85%</span>
                    </div>
                    <div className="w-full bg-surface-container-highest rounded-full h-1.5">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <p className="font-label-sm text-label-sm text-on-surface-variant mt-2">Thịt bò (hôm nay), Cải ngọt (mai)</p>
                  </div>
                </div>
              </Link>
            </div>
          </section>

          <hr className="border-t border-outline-variant opacity-50"/>

          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Đề xuất khác cho bạn</h3>
              <div className="hidden md:flex gap-2">
                {['Tất cả', 'Bữa chính', 'Đồ ăn vặt'].map(filter => (
                  <button 
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`font-label-sm text-label-sm px-4 py-2 rounded-full border transition-colors ${activeFilter === filter ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest border-transparent'}`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <Link to="/recipe-detail" className="bg-surface-container-lowest rounded-lg border border-outline-variant shadow-sm overflow-hidden flex flex-col group cursor-pointer hover:shadow-md transition-all">
                <div className="relative h-40 overflow-hidden">
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxLmjbbPFQHTwvJfV3r_myDF4070EhXZ5S_7TtLdzPOhzGPeuQBOzq8ES1vLJvj_YtvyxEbpZm878HmFbAAfdtBc3_1SADUdTAhB_WmJG-OwHy76VPPffqJPqRCi7X-kfCohlaoVxZ9fMJQtbqyBVtW8iSzPc1_lYGiPO7AfqLV0g-8xG6kwhLr00G8b4Ewm_4Qbuj24BoEyoYGHJYDnt6jsYDASjeYv38NWY6YSVN6Hn8X3DlAFO4GEQBOTXysG5Xj9EV-kLr0N6H" alt="Phở"/>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h4 className="font-headline-sm text-headline-sm text-on-surface mb-1">Phở Bò Tái Lăn</h4>
                  <div className="flex items-center gap-3 text-on-surface-variant font-body-md text-body-md mb-4">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">schedule</span> 45 phút</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">signal_cellular_alt</span> Khó</span>
                  </div>
                  <div className="mt-auto bg-surface-container-low p-2 rounded border border-outline-variant/50">
                    <div className="flex justify-between items-end mb-1">
                      <span className="font-label-sm text-label-sm text-on-surface-variant">Nguyên liệu có sẵn</span>
                      <span className="font-body-md text-body-md font-bold text-primary">70%</span>
                    </div>
                    <div className="w-full bg-surface-container-highest rounded-full h-1.5">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
}
