import { Link } from 'react-router-dom';
import SideNav from '../components/SideNav';
import { useDialog } from '../contexts/DialogContext';

export default function RecipeDetail() {
  const { showAlert } = useDialog();

  return (
    <div className="bg-background text-on-background h-screen overflow-hidden antialiased flex">
      <SideNav />

      <div className="flex-1 flex flex-col md:ml-64 w-full h-full relative">
        <header className="md:hidden shrink-0 w-full z-50 flex justify-between items-center px-margin-mobile h-nav-height bg-surface dark:bg-surface-dim text-primary dark:text-primary-fixed-dim border-b border-outline-variant dark:border-outline">
          <Link to="/meals" className="p-2 -ml-2 rounded-full hover:bg-surface-container-high transition-colors active:opacity-80">
            <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
          </Link>
          <h1 className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed truncate">Chi tiết công thức</h1>
          <div className="flex gap-2">
            <button className="p-2 rounded-full hover:bg-surface-container-high transition-colors active:opacity-80">
              <span className="material-symbols-outlined text-on-surface-variant">favorite_border</span>
            </button>
            <button className="p-2 -mr-2 rounded-full hover:bg-surface-container-high transition-colors active:opacity-80">
              <span className="material-symbols-outlined text-on-surface-variant">share</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto w-full">
          <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 pb-[100px] md:pb-8">
          <section className="space-y-6">
            <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden shadow-sm">
              <img alt="Salad Bơ Trứng" className="object-cover w-full h-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAg2UIjsBrwjFfKrcfxQtmCp1bAfI2ve7o2YsivtGZb1LKXi08Xy4WaJUsU2wW3sk2B3tywiGRBifLNZe1YFnn9o4mfTFK3Bw9FBMPt0jgIFu7DfOkf2nK81muwckdHyx91_bCul2Xsj8Dj9ebDCmouW4Ry9cnxHYyB-YOGJGvna3y-9s5L9pyL4_H32wPzu8kZ-7Ia_fzBPK9Je2OTNWSvyDmR7I-Akfu8rLUjwr5mq91hMHFKHimBYMJQ2kV3DZEr1OMdXpmSSqa1"/>
              <div className="absolute bottom-4 left-4 flex gap-2">
                <span className="bg-surface-container-high text-on-surface px-3 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1 backdrop-blur-md bg-opacity-90">
                  <span className="material-symbols-outlined text-[16px]">eco</span> Tươi ngon
                </span>
                <span className="bg-surface-container-high text-on-surface px-3 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1 backdrop-blur-md bg-opacity-90">
                  <span className="material-symbols-outlined text-[16px]">timer</span> 15 Phút
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <h1 className="font-display-lg text-display-lg text-on-surface">Salad Bơ Trứng Dinh Dưỡng</h1>
              </div>
              <div className="flex flex-wrap gap-6 text-on-surface-variant font-body-md text-body-md">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary-container">star</span>
                  <span>4.8 (120 đánh giá)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">restaurant</span>
                  <span>Độ khó: Dễ</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">local_fire_department</span>
                  <span>320 kcal</span>
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-surface-container-low">
                <h2 className="font-headline-md text-headline-md text-on-surface mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">kitchen</span>
                  Nguyên liệu
                </h2>
                <p className="font-label-sm text-label-sm text-on-surface-variant mb-4">Khẩu phần: 2 người</p>
                <ul className="space-y-4 font-body-md text-body-md">
                  <li className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">egg</span>
                      </div>
                      <div>
                        <p className="text-on-surface">Trứng gà</p>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">2 quả</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-primary">check_circle</span>
                  </li>
                  <li className="flex items-center justify-between p-3 rounded-lg bg-error-container/20 border border-error-container">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary">
                        <span className="material-symbols-outlined">grass</span>
                      </div>
                      <div>
                        <p className="text-on-surface">Bơ sáp</p>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">1 quả</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-secondary-container">shopping_cart</span>
                  </li>
                </ul>
                <button onClick={() => showAlert('Đã thêm nguyên liệu vào danh sách đi chợ!')} className="w-full mt-6 bg-primary text-on-primary py-3 px-4 rounded-lg font-body-md text-body-md flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors">
                  <span className="material-symbols-outlined">add_shopping_cart</span>
                  Thêm nguyên liệu còn thiếu vào danh sách đi chợ
                </button>
                <button onClick={() => showAlert('Đã thêm món ăn vào lịch trình!')} className="w-full mt-3 bg-secondary-container text-on-secondary-container py-3 px-4 rounded-lg font-body-md text-body-md flex items-center justify-center gap-2 hover:bg-secondary hover:text-on-secondary transition-colors">
                  <span className="material-symbols-outlined">calendar_today</span>
                  Thêm vào lịch trình bữa ăn
                </button>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-surface-container-low">
                <h2 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">menu_book</span>
                  Các bước thực hiện
                </h2>
                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:ml-[2.25rem] md:before:translate-x-0 before:h-full before:w-0.5 before:bg-outline-variant">
                  <div className="relative flex items-start gap-4 md:gap-6">
                    <div className="relative z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-primary text-on-primary font-headline-sm rounded-full shrink-0 ring-4 ring-surface-container-lowest">1</div>
                    <div className="flex-1 bg-surface-container-low p-4 rounded-xl">
                      <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Sơ chế nguyên liệu</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant">Rửa sạch xà lách, để ráo nước và cắt khúc vừa ăn.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </main>
      </div>
    </div>
  );
}
