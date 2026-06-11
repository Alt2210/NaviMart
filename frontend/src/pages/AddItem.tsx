import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDialog } from '../contexts/DialogContext';

export default function AddItem() {
  const navigate = useNavigate();
  const { showAlert } = useDialog();
  const [location, setLocation] = useState('Tủ đông');
  const [itemName, setItemName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showAlert('Đã thêm thực phẩm thành công!');
    navigate('/pantry');
  };

  return (
    <div className="bg-background text-on-background font-body-md antialiased h-screen flex flex-col">
      <header className="shrink-0 bg-surface dark:bg-surface-dim border-b border-outline-variant z-40 px-margin-mobile h-nav-height flex items-center justify-between shadow-sm">
        <Link to="/pantry" className="p-2 -ml-2 rounded-full hover:bg-surface-container-high transition-colors active:opacity-80">
          <span className="material-symbols-outlined text-on-surface-variant">close</span>
        </Link>
        <h1 className="font-headline-sm text-headline-sm font-bold text-on-surface">Thêm thực phẩm</h1>
        <div className="w-10 h-10"></div>
      </header>

      <main className="flex-1 overflow-y-auto w-full max-w-2xl mx-auto px-margin-mobile py-stack-md pb-[90px] hide-scrollbar">
        <div className="mb-6 flex flex-col items-center justify-center bg-surface-container-low border-2 border-dashed border-outline-variant rounded-xl p-6 cursor-pointer hover:bg-surface-container transition-colors group">
          <div className="w-16 h-16 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-3xl">add_a_photo</span>
          </div>
          <span className="font-body-md text-body-md font-medium text-primary">Chụp hoặc tải ảnh lên</span>
        </div>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label className="font-body-md text-body-md font-bold text-on-surface" htmlFor="itemName">Tên thực phẩm *</label>
            <input 
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" id="itemName" placeholder="VD: Sữa tươi TH True Milk, Thịt bò..." type="text"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-body-md text-body-md font-bold text-on-surface" htmlFor="quantity">Số lượng</label>
              <div className="flex bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all">
                <input className="w-full px-4 py-3 bg-transparent outline-none" id="quantity" placeholder="0" type="number"/>
                <select className="bg-surface-container border-none outline-none px-2 font-body-md text-body-md cursor-pointer border-l border-outline-variant">
                  <option value="item">Cái/Hộp</option>
                  <option value="kg">Kg</option>
                  <option value="g">Gram</option>
                  <option value="l">Lít</option>
                  <option value="ml">ml</option>
                </select>
              </div>
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="font-body-md text-body-md font-bold text-on-surface" htmlFor="expiryDate">Hạn sử dụng</label>
              <input className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" id="expiryDate" type="date"/>
            </div>
          </div>

          <div className="flex flex-col gap-stack-sm">
            <label className="font-body-md text-body-md font-bold text-on-surface">Vị trí lưu trữ</label>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => setLocation('Tủ đông')} className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all shadow-sm ${location === 'Tủ đông' ? 'border border-primary bg-primary-container text-on-primary-container' : 'border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high'}`} type="button">
                <span className="material-symbols-outlined mb-1">ac_unit</span>
                <span className="font-label-sm text-label-sm font-medium">Tủ đông</span>
              </button>
              <button onClick={() => setLocation('Tủ mát')} className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all shadow-sm ${location === 'Tủ mát' ? 'border border-primary bg-primary-container text-on-primary-container' : 'border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high'}`} type="button">
                <span className="material-symbols-outlined mb-1">kitchen</span>
                <span className="font-label-sm text-label-sm font-medium">Tủ mát</span>
              </button>
              <button onClick={() => setLocation('Kệ đồ khô')} className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all shadow-sm ${location === 'Kệ đồ khô' ? 'border border-primary bg-primary-container text-on-primary-container' : 'border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high'}`} type="button">
                <span className="material-symbols-outlined mb-1">shelves</span>
                <span className="font-label-sm text-label-sm font-medium">Kệ đồ khô</span>
              </button>
            </div>
          </div>
        </form>
      </main>

      <div className="fixed bottom-0 left-0 w-full bg-surface-container-lowest border-t border-outline-variant p-margin-mobile z-50 pb-safe shadow-[0_-4px_16px_rgba(0,0,0,0.05)]">
        <div className="max-w-2xl mx-auto w-full">
          <button 
            onClick={handleSubmit} 
            disabled={!itemName.trim()}
            className={`w-full h-14 rounded-lg font-headline-sm text-headline-sm flex items-center justify-center gap-2 transition-all shadow-sm ${itemName.trim() ? 'bg-primary text-white hover:opacity-90 active:scale-[0.98]' : 'bg-surface-container-high text-on-surface-variant opacity-50 cursor-not-allowed'}`}
          >
            <span className="material-symbols-outlined">save</span>
            Lưu thực phẩm
          </button>
        </div>
      </div>
    </div>
  );
}
