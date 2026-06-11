import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDialog } from '../contexts/DialogContext';

export default function Scanner() {
  const { showAlert } = useDialog();
  const navigate = useNavigate();
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'result'>('idle');
  const [scannedItems, setScannedItems] = useState<{id: number, name: string, qty: number, category: string, checked: boolean}[]>([]);

  const handleCapture = () => {
    setScanState('scanning');
    
    // Simulate AI processing time
    setTimeout(() => {
      setScannedItems([
        { id: 1, name: 'Sữa tươi Vinamilk 1L', qty: 2, category: 'Tủ mát', checked: true },
        { id: 2, name: 'Thịt bò bít tết', qty: 1, category: 'Tủ đông', checked: true },
        { id: 3, name: 'Cà chua Đà Lạt', qty: 5, category: 'Tủ mát', checked: true },
        { id: 4, name: 'Mì ý Spaghetti', qty: 1, category: 'Kệ đồ khô', checked: true },
      ]);
      setScanState('result');
    }, 2500);
  };

  const toggleCheck = (id: number) => {
    setScannedItems(items => items.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const handleSave = () => {
    // Navigate back to pantry
    showAlert('Đã thêm các mục đã chọn vào Tủ lạnh!');
    navigate('/pantry');
  };

  return (
    <div className="bg-black text-white h-screen overflow-hidden flex flex-col font-body-md relative">
      {/* Header overlay */}
      <header className="absolute top-0 left-0 w-full z-40 px-margin-mobile pt-safe-top h-nav-height flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-white/20 transition-colors">
          <span className="material-symbols-outlined text-white">close</span>
        </button>
        <div className="flex bg-surface-container-lowest/20 backdrop-blur-md rounded-full p-1 border border-white/20">
          <button className="px-4 py-1.5 rounded-full bg-white text-black font-label-sm text-label-sm font-semibold">Hóa đơn</button>
          <button className="px-4 py-1.5 rounded-full text-white font-label-sm text-label-sm font-medium">Mã vạch</button>
        </div>
        <button className="p-2 -mr-2 rounded-full hover:bg-white/20 transition-colors">
          <span className="material-symbols-outlined text-white">flash_off</span>
        </button>
      </header>

      {/* Viewfinder area */}
      <div className="flex-1 relative flex items-center justify-center">
        {/* Simulated Camera feed background */}
        <div className="absolute inset-0 bg-surface-container-highest opacity-20"></div>
        
        {scanState === 'idle' && (
          <div className="relative w-[80%] h-[60%] max-w-sm rounded-2xl border-2 border-white/40 overflow-hidden shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]">
            <div className="absolute inset-0 border-[3px] border-primary opacity-80" style={{ clipPath: 'polygon(0 0, 20px 0, 20px 3px, 3px 3px, 3px 20px, 0 20px, 0 0, 100% 0, 100% 20px, calc(100% - 3px) 20px, calc(100% - 3px) 3px, calc(100% - 20px) 3px, calc(100% - 20px) 0, 100% 0, 100% 100%, calc(100% - 20px) 100%, calc(100% - 20px) calc(100% - 3px), calc(100% - 3px) calc(100% - 3px), calc(100% - 3px) calc(100% - 20px), 100% calc(100% - 20px), 100% 100%, 0 100%, 0 calc(100% - 20px), 3px calc(100% - 20px), 3px calc(100% - 3px), 20px calc(100% - 3px), 20px 100%, 0 100%)' }}></div>
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-primary/70 shadow-[0_0_8px_2px_rgba(var(--color-primary-rgb),0.5)] animate-[scan_2s_ease-in-out_infinite]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/70 font-body-md text-center px-4">
              Căn chỉnh hóa đơn vào trong khung hình
            </div>
          </div>
        )}

        {scanState === 'scanning' && (
          <div className="flex flex-col items-center z-20">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6 relative">
              <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              <span className="material-symbols-outlined text-primary text-3xl">auto_awesome</span>
            </div>
            <h2 className="font-headline-sm text-headline-sm font-bold text-white mb-2">NaviAI đang phân tích...</h2>
            <p className="text-white/70 font-body-md text-center max-w-xs">Đang nhận diện các mặt hàng và trích xuất thông tin</p>
          </div>
        )}
      </div>

      {/* Controls */}
      {scanState === 'idle' && (
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/80 to-transparent pb-safe-bottom pt-12 px-8 z-40 flex items-center justify-between pb-8">
          <button className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors backdrop-blur-md">
            <span className="material-symbols-outlined text-white">photo_library</span>
          </button>
          
          <button onClick={handleCapture} className="w-20 h-20 rounded-full border-4 border-white/50 flex items-center justify-center hover:border-white transition-colors">
            <div className="w-16 h-16 rounded-full bg-white active:scale-95 transition-transform"></div>
          </button>
          
          <div className="w-12 h-12"></div> {/* Spacer for alignment */}
        </div>
      )}

      {/* Results Bottom Sheet */}
      {scanState === 'result' && (
        <div className="absolute bottom-0 left-0 w-full bg-surface-container-lowest text-on-surface rounded-t-3xl z-50 flex flex-col shadow-[0_-8px_30px_rgba(0,0,0,0.3)] animate-slide-up max-h-[85vh]">
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1.5 bg-outline-variant rounded-full"></div>
          </div>
          
          <div className="px-6 py-2 flex justify-between items-center">
            <h2 className="font-headline-sm text-headline-sm font-bold text-primary">Kết quả quét (4)</h2>
            <button onClick={() => setScanState('idle')} className="text-primary font-body-md font-semibold">Quét lại</button>
          </div>
          
          <div className="flex-1 overflow-y-auto px-6 py-2 pb-32 hide-scrollbar">
            <div className="bg-primary-container/30 border border-primary/20 rounded-xl p-3 mb-4 flex items-start gap-3">
              <span className="material-symbols-outlined text-primary mt-0.5">auto_awesome</span>
              <div>
                <p className="font-body-md text-body-md text-on-surface-variant text-sm">AI đã nhận diện thành công 4 sản phẩm từ hóa đơn của bạn. Vui lòng kiểm tra lại trước khi thêm.</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {scannedItems.map(item => (
                <div key={item.id} className="flex items-center gap-4 bg-surface-container-low border border-outline-variant rounded-xl p-3">
                  <input 
                    type="checkbox" 
                    checked={item.checked}
                    onChange={() => toggleCheck(item.id)}
                    className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary" 
                  />
                  <div className="flex-1">
                    <h3 className="font-body-md text-body-md font-bold text-on-surface line-clamp-1">{item.name}</h3>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">{item.category}</p>
                  </div>
                  <div className="bg-surface-container rounded-lg px-3 py-1 flex items-center justify-center border border-outline-variant/50">
                    <span className="font-body-md text-body-md font-bold">x{item.qty}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-outline-variant text-on-surface-variant font-body-md hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined">add</span>
              Thêm món bị thiếu
            </button>
          </div>

          <div className="absolute bottom-0 left-0 w-full bg-surface-container-lowest border-t border-outline-variant p-margin-mobile pb-safe-bottom z-50">
            <button onClick={handleSave} className="w-full bg-primary text-on-primary h-14 rounded-full font-headline-sm text-headline-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-md">
              Thêm vào tủ lạnh
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
