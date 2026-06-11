import { useState } from 'react';
import { Link } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import SideNav from '../components/SideNav';

export default function MyLists() {
  const [activeTab, setActiveTab] = useState<'Đang mua' | 'Đã mua'>('Đang mua');
  const [activeLists, setActiveLists] = useState([
    {
      id: 1,
      name: 'Đi chợ cuối tuần',
      date: '20/10/2024',
      itemsCount: '12 món đồ',
      status: 'Đang chuẩn bị',
      progress: '0/12 đã chọn',
      color: 'tertiary'
    },
    {
      id: 2,
      name: 'Đồ dùng nhà bếp',
      date: 'N/A',
      itemsCount: '3 món đồ',
      status: 'Đang chuẩn bị',
      progress: '1/3 đã chọn',
      color: 'secondary'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [listNameInput, setListNameInput] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const openCreateModal = () => {
    setModalMode('create');
    setListNameInput('');
    setIsModalOpen(true);
  };

  const openEditModal = (id: number, name: string) => {
    setModalMode('edit');
    setEditingId(id);
    setListNameInput(name);
    setIsModalOpen(true);
  };

  const handleSaveList = () => {
    if (!listNameInput.trim()) return;
    
    if (modalMode === 'create') {
      setActiveLists([...activeLists, { 
        id: Date.now(), 
        name: listNameInput.trim(), 
        date: 'Hôm nay', 
        itemsCount: '0 món đồ', 
        status: 'Trống', 
        progress: '0/0', 
        color: 'primary' 
      }]);
    } else if (modalMode === 'edit' && editingId) {
      setActiveLists(activeLists.map(list => 
        list.id === editingId ? { ...list, name: listNameInput.trim() } : list
      ));
    }
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      setActiveLists(activeLists.filter(l => l.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="bg-background text-on-background h-screen overflow-hidden font-body-md antialiased selection:bg-primary-container selection:text-on-primary-container flex">
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
              <span className="font-bold text-primary text-sm">Danh sách mua sắm</span>
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
        <div className="max-w-7xl mx-auto w-full pb-[100px] md:pb-8">
        <div className="px-margin-mobile py-stack-md sticky top-0 bg-background/95 backdrop-blur-sm z-30">
          <h1 className="font-headline-md text-headline-md text-primary mb-2">Danh sách</h1>
          
          <div className="flex bg-surface-container-high rounded-lg p-1 w-full max-w-sm">
            <button onClick={() => setActiveTab('Đang mua')} aria-selected={activeTab === 'Đang mua'} className={`flex-1 py-2 font-label-sm text-label-sm font-semibold rounded-md shadow-sm transition-all ${activeTab === 'Đang mua' ? 'bg-surface text-primary' : 'text-on-surface-variant hover:text-on-surface shadow-none bg-transparent'}`}>
              Đang mua
            </button>
            <button onClick={() => setActiveTab('Đã mua')} aria-selected={activeTab === 'Đã mua'} className={`flex-1 py-2 font-label-sm text-label-sm font-semibold rounded-md shadow-sm transition-all ${activeTab === 'Đã mua' ? 'bg-surface text-primary' : 'text-on-surface-variant hover:text-on-surface shadow-none bg-transparent'}`}>
              Đã mua
            </button>
          </div>
        </div>

        {activeTab === 'Đang mua' ? (
          <div className="px-margin-mobile grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-stack-md">
            {activeLists.length > 0 ? (
              activeLists.map(list => (
                <Link key={list.id} to="/list-detail" className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-4 flex flex-col relative overflow-hidden transition-shadow hover:shadow-md cursor-pointer group">
                  <div className={`absolute top-0 left-0 w-full h-1 bg-${list.color}-container group-hover:bg-${list.color} transition-colors`}></div>
                  <div className="flex justify-between items-start mt-1 mb-3">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors pr-2">{list.name}</h3>
                    <div className="flex">
                      <button aria-label="Đổi tên" className="text-on-surface-variant hover:text-primary transition-colors p-1 rounded-full hover:bg-surface-container-low" onClick={(e) => { e.preventDefault(); openEditModal(list.id, list.name); }}>
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button aria-label="Xóa" className="text-on-surface-variant hover:text-error transition-colors p-1 rounded-full hover:bg-surface-container-low" onClick={(e) => { e.preventDefault(); setDeleteConfirmId(list.id); }}>
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 font-body-md text-body-md text-on-surface-variant mb-4">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-outline">calendar_today</span>
                      <span>{list.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-outline">shopping_basket</span>
                      <span>{list.itemsCount}</span>
                    </div>
                  </div>
                  <div className="mt-auto pt-3 border-t border-outline-variant flex justify-between items-center">
                    <span className={`inline-flex items-center gap-1 font-label-sm text-label-sm px-2 py-1 bg-surface-container-low text-primary rounded-full`}>
                      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>progress_activity</span>
                      {list.status}
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">{list.progress}</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center py-16 text-on-surface-variant text-center">
                <span className="material-symbols-outlined text-6xl mb-4 text-outline">shopping_cart</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Chưa có danh sách nào</h3>
                <p className="font-body-md text-body-md mb-6">Tạo danh sách mới để bắt đầu mua sắm.</p>
              </div>
            )}
            
            <article onClick={openCreateModal} className="hidden md:flex bg-surface-container-lowest rounded-2xl p-6 border border-dashed border-outline hover:border-primary hover:bg-primary-container/20 transition-all cursor-pointer flex-col items-center justify-center min-h-[200px] gap-4">
              <div className="w-14 h-14 rounded-full bg-primary-container text-primary flex items-center justify-center">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
              </div>
              <span className="font-headline-sm text-headline-sm text-primary">Tạo danh sách mới</span>
            </article>
          </div>
        ) : (
          <div className="px-margin-mobile flex flex-col items-center justify-center py-20 text-on-surface-variant">
            <span className="material-symbols-outlined text-6xl mb-4 text-outline">check_circle</span>
            <p className="font-body-lg text-body-lg">Bạn chưa có danh sách nào đã hoàn thành.</p>
          </div>
        )}
        </div>
      </main>

      <button className="md:hidden fixed bottom-[85px] right-margin-mobile z-40 bg-primary text-on-primary rounded-[16px] shadow-lg flex items-center gap-2 px-4 py-4 hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 group" onClick={openCreateModal}>
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
        <span className="font-label-sm text-label-sm font-semibold whitespace-nowrap pr-1">Tạo danh sách</span>
      </button>
      </div>

      <BottomNav />

      {/* Modal Tạo/Sửa Danh Sách */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-2xl p-6 w-full max-w-sm shadow-xl flex flex-col gap-4 animate-slide-up">
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              {modalMode === 'create' ? 'Tạo danh sách mới' : 'Đổi tên danh sách'}
            </h2>
            <input 
              autoFocus
              className="w-full px-4 py-3 bg-surface-container border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-md text-on-surface"
              placeholder="Nhập tên danh sách..."
              value={listNameInput}
              onChange={(e) => setListNameInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSaveList(); }}
            />
            <div className="flex justify-end gap-2 mt-2">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-label-md text-primary hover:bg-primary/10 rounded-full transition-colors">Hủy</button>
              <button 
                onClick={handleSaveList} 
                disabled={!listNameInput.trim()}
                className={`px-4 py-2 font-label-md rounded-full transition-colors ${listNameInput.trim() ? 'bg-primary text-on-primary hover:bg-primary/90' : 'bg-surface-container-high text-on-surface-variant opacity-50'}`}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Xác nhận Xóa */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-2xl p-6 w-full max-w-sm shadow-xl flex flex-col gap-4 animate-slide-up">
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">Xác nhận xóa</h2>
            <p className="font-body-md text-on-surface-variant">Bạn có chắc chắn muốn xóa danh sách này không? Tất cả các món đồ bên trong sẽ bị xóa và không thể khôi phục.</p>
            <div className="flex justify-end gap-2 mt-2">
              <button onClick={() => setDeleteConfirmId(null)} className="px-4 py-2 font-label-md text-primary hover:bg-primary/10 rounded-full transition-colors">Hủy</button>
              <button onClick={confirmDelete} className="px-4 py-2 font-label-md bg-error text-on-error hover:bg-error/90 rounded-full transition-colors">Xóa danh sách</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
