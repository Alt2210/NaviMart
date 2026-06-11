import { useState } from 'react';
import { Link } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import SideNav from '../components/SideNav';

export default function PantryDashboard() {
  const [activeFilter, setActiveFilter] = useState('Tất cả');
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [pantryItems, setPantryItems] = useState([
    {
      id: 1,
      name: 'Súp lơ xanh',
      category: 'Tủ mát',
      quantity: '2 bắp',
      expiryDate: 'HSD: 5 ngày',
      status: 'An toàn',
      statusColor: 'tertiary',
      borderColor: 'border-outline-variant/50',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdXPABjf2kmB_xB54DOqq7BXqF-Oi1j6t9BnvDKKLrnCnjc1BAArhUHS9vxSUAZRuo5KTcMaIzUmiAn1HL_nrzCEVAdXnheKpSS0Zh7Kgs_ZmALrKE60hwaRNx17YpoA5p20gZvOSB95Dj_5pDqaEVaRXsX-Pr_JitM651gopO0e6OcSZhmm1oAOMqeVRbZ240Gmtv5c-IljjyXsVMsoy_ehehKNcuPbcdzZV18elMwMxAgoFUnPkX_MxvVj2H0zGFyiFScgxZllBD'
    },
    {
      id: 2,
      name: 'Sữa tươi TH True Milk',
      category: 'Tủ mát',
      quantity: '1 lít',
      expiryDate: 'HSD: 20/10',
      status: 'Còn 2 ngày',
      statusColor: 'secondary',
      borderColor: 'border-secondary/30',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBC_itWmEYsRGuPRcpxCekaFb68VPoTUDeXEE3uyRxoHDjrI1l-4qsal2YhArifRMDBHyXlC5mkdtLE0AtdYNJyai8jvkUkDxSD4qelwfeFpNkZhdemcQu1QmkSBNL9NIuau0d36Z3j_nMOGmjqp-ZFRm_LHq6EEgc-WTeSpCsg9uc9ah6f9ssfLC7KyCqSaCrgLUFWxC0CCBEbtPWItWtm07JN3xBrPmcOF6Xdi_Oaet3oWihpPb4sUztPLlqqToHowMVZzbpCk_ga'
    }
  ]);

  const [editingItem, setEditingItem] = useState<{id: number, name: string, quantity: string} | null>(null);
  const [editQuantityInput, setEditQuantityInput] = useState('');
  
  const [deletedItem, setDeletedItem] = useState<any | null>(null);
  const [showUndo, setShowUndo] = useState(false);

  const handleDelete = (id: number) => {
    const itemToDelete = pantryItems.find(item => item.id === id);
    if (itemToDelete) {
      setDeletedItem(itemToDelete);
      setPantryItems(pantryItems.filter(item => item.id !== id));
      setShowUndo(true);
      
      // Auto hide undo after 4 seconds
      setTimeout(() => {
        setShowUndo(false);
      }, 4000);
    }
    setActiveMenu(null);
  };

  const handleUndo = () => {
    if (deletedItem) {
      setPantryItems([...pantryItems, deletedItem]);
      setDeletedItem(null);
      setShowUndo(false);
    }
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setEditQuantityInput(item.quantity);
    setActiveMenu(null);
  };

  const handleSaveEdit = () => {
    if (editingItem && editQuantityInput.trim()) {
      setPantryItems(pantryItems.map(item => 
        item.id === editingItem.id ? { ...item, quantity: editQuantityInput.trim() } : item
      ));
      setEditingItem(null);
    }
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
              <span className="font-bold text-primary text-sm">Kho thực phẩm</span>
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
        <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full px-margin-mobile py-stack-md md:py-8 pb-[100px] md:pb-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="font-headline-md text-headline-md text-primary mb-2">Tổng quan tủ lạnh</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Quản lý thực phẩm gia đình tươi ngon mỗi ngày.</p>
          </div>
          <Link to="/add-item" className="hidden md:flex items-center gap-2 bg-primary text-on-primary font-body-md px-4 py-2 rounded-lg shadow-sm hover:opacity-90 transition-opacity">
            <span className="material-symbols-outlined">add</span>
            Thêm thực phẩm
          </Link>
        </div>

        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide -mx-margin-mobile px-margin-mobile md:mx-0 md:px-0">
          {['Tất cả', 'Tủ đông', 'Tủ mát', 'Đồ khô'].map(filter => (
            <button 
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full font-body-md transition-colors ${activeFilter === filter ? 'bg-primary-container text-on-primary-container shadow-sm' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'}`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
          <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/30 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>kitchen</span>
              <span className="font-label-sm text-label-sm font-semibold">Tổng thực phẩm</span>
            </div>
            <div className="mt-2 font-headline-md text-headline-md text-on-surface">42 <span className="text-body-md text-on-surface-variant font-normal">món</span></div>
          </div>
          <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/30 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-tertiary">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span className="font-label-sm text-label-sm font-semibold">An toàn</span>
            </div>
            <div className="mt-2 font-headline-md text-headline-md text-on-surface">35 <span className="text-body-md text-on-surface-variant font-normal">món</span></div>
          </div>
          <div className="bg-secondary-container/20 rounded-xl p-4 border border-secondary-container/30 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-secondary">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
              <span className="font-label-sm text-label-sm font-semibold">Sắp hết hạn</span>
            </div>
            <div className="mt-2 font-headline-md text-headline-md text-on-surface">5 <span className="text-body-md text-on-surface-variant font-normal">món</span></div>
          </div>
          <div className="bg-error-container/30 rounded-xl p-4 border border-error/20 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-error">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
              <span className="font-label-sm text-label-sm font-semibold">Đã hết hạn</span>
            </div>
            <div className="mt-2 font-headline-md text-headline-md text-on-surface">2 <span className="text-body-md text-on-surface-variant font-normal">món</span></div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter-mobile md:gap-4">
          {pantryItems.length > 0 ? (
            pantryItems.map(item => (
              <div key={item.id} className={`bg-surface-container-lowest rounded-lg shadow-sm border ${item.borderColor} overflow-visible flex flex-col relative`}>
                <div className="relative h-32 md:h-40 bg-surface-container rounded-t-lg overflow-hidden">
                  <img alt={item.name} className="w-full h-full object-cover" src={item.image}/>
                  <div className={`absolute top-2 right-2 bg-surface/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm border border-${item.statusColor}/20`}>
                    <span className={`w-2 h-2 rounded-full bg-${item.statusColor}`}></span>
                    <span className={`font-label-sm text-label-sm text-${item.statusColor} font-semibold`}>{item.status}</span>
                  </div>
                </div>
                <div className="p-3 flex-1 flex flex-col">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-headline-sm text-[16px] leading-[24px] text-on-surface font-semibold line-clamp-1">{item.name}</h3>
                    <button 
                      onClick={() => setActiveMenu(activeMenu === item.id ? null : item.id)}
                      className="text-on-surface-variant hover:text-primary transition-colors p-1 -mr-1 -mt-1 rounded-full hover:bg-surface-container-high"
                    >
                      <span className="material-symbols-outlined text-lg">more_vert</span>
                    </button>
                    {activeMenu === item.id && (
                      <div className="absolute top-10 right-2 w-48 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg z-50 overflow-hidden">
                        <button onClick={() => openEditModal(item)} className="w-full text-left px-4 py-3 hover:bg-surface-container-low transition-colors font-body-md text-on-surface flex items-center gap-2">
                          <span className="material-symbols-outlined text-lg">edit</span> Chỉnh sửa
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="w-full text-left px-4 py-3 hover:bg-error-container/50 transition-colors font-body-md text-error flex items-center gap-2">
                          <span className="material-symbols-outlined text-lg">delete</span> Đã dùng hết (Xoá)
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1">{item.category}</p>
                  <div className="mt-auto pt-3 flex justify-between items-center border-t border-outline-variant/30">
                    <span className="font-body-md text-body-md font-bold text-on-surface">{item.quantity}</span>
                    <span className={`font-label-sm text-label-sm text-${item.statusColor} font-medium`}>{item.expiryDate}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 md:col-span-3 lg:col-span-4 py-12 flex flex-col items-center justify-center text-center">
              <span className="material-symbols-outlined text-6xl text-surface-variant mb-4">kitchen</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Tủ lạnh đang trống</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6">Hãy thêm thực phẩm để bắt đầu quản lý nhé.</p>
              <Link to="/add-item" className="bg-primary text-on-primary px-6 py-2 rounded-lg font-body-md flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm">
                <span className="material-symbols-outlined">add</span>
                Thêm thực phẩm ngay
              </Link>
            </div>
          )}
        </div>
        </div>
      </main>

      <Link to="/add-item" className="md:hidden fixed bottom-[calc(69px+env(safe-area-inset-bottom)+16px)] right-4 w-14 h-14 bg-primary text-on-primary rounded-xl shadow-md flex items-center justify-center hover:bg-primary/90 transition-colors z-40">
        <span className="material-symbols-outlined text-[28px]">add</span>
      </Link>
      </div>

      <BottomNav />

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-2xl p-6 w-full max-w-sm shadow-xl flex flex-col gap-4 animate-slide-up">
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">Cập nhật số lượng</h2>
            <p className="font-body-md text-on-surface-variant mb-2">Đang chỉnh sửa: <span className="font-semibold text-on-surface">{editingItem.name}</span></p>
            
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-label-sm font-medium text-on-surface">Số lượng còn lại</label>
              <input 
                autoFocus
                className="w-full px-4 py-3 bg-surface-container border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-md text-on-surface"
                placeholder="VD: 1 lít, 2 quả..."
                value={editQuantityInput}
                onChange={(e) => setEditQuantityInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSaveEdit(); }}
              />
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setEditingItem(null)} className="px-4 py-2 font-label-md text-primary hover:bg-primary/10 rounded-full transition-colors">Hủy</button>
              <button 
                onClick={handleSaveEdit} 
                disabled={!editQuantityInput.trim()}
                className={`px-4 py-2 font-label-md rounded-full transition-colors ${editQuantityInput.trim() ? 'bg-primary text-on-primary hover:bg-primary/90' : 'bg-surface-container-high text-on-surface-variant opacity-50'}`}
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Undo Snackbar */}
      {showUndo && deletedItem && (
        <div className="fixed bottom-[100px] left-1/2 -translate-x-1/2 md:left-auto md:right-8 md:bottom-8 md:translate-x-0 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-lg z-50 flex items-center gap-4 animate-slide-up whitespace-nowrap min-w-[300px] max-w-[90vw]">
          <span className="font-body-md text-body-md flex-1 overflow-hidden text-ellipsis">Đã xóa {deletedItem.name}</span>
          <button onClick={handleUndo} className="font-label-md text-primary font-bold hover:bg-primary/10 px-2 py-1 rounded transition-colors uppercase">
            Hoàn tác
          </button>
        </div>
      )}
    </div>
  );
}
