import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserMultiFormatReader } from '@zxing/browser';
import type { IScannerControls } from '@zxing/browser';
import { catalogApi } from '../api';
import type { CatalogFood } from '../api';

type ScanState = 'starting' | 'scanning' | 'no-camera' | 'looking-up' | 'found' | 'not-found';

export default function Scanner() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const busyRef = useRef(false);

  const [scanState, setScanState] = useState<ScanState>('starting');
  const [barcode, setBarcode] = useState('');
  const [manualCode, setManualCode] = useState('');
  const [food, setFood] = useState<CatalogFood | null>(null);

  const lookupBarcode = useCallback(async (code: string) => {
    if (busyRef.current) return;
    busyRef.current = true;
    setBarcode(code);
    setScanState('looking-up');
    try {
      const foods = await catalogApi.searchFoods({ barcode: code });
      if (foods.length > 0) {
        setFood(foods[0]);
        setScanState('found');
      } else {
        setFood(null);
        setScanState('not-found');
      }
    } catch {
      setFood(null);
      setScanState('not-found');
    } finally {
      busyRef.current = false;
    }
  }, []);

  useEffect(() => {
    const reader = new BrowserMultiFormatReader();
    let cancelled = false;

    reader
      .decodeFromVideoDevice(undefined, videoRef.current ?? undefined, (result) => {
        if (result && !cancelled) {
          lookupBarcode(result.getText());
        }
      })
      .then((controls) => {
        if (cancelled) {
          controls.stop();
          return;
        }
        controlsRef.current = controls;
        setScanState((state) => (state === 'starting' ? 'scanning' : state));
      })
      .catch(() => {
        if (!cancelled) setScanState('no-camera');
      });

    return () => {
      cancelled = true;
      controlsRef.current?.stop();
    };
  }, [lookupBarcode]);

  const resumeScanning = () => {
    setFood(null);
    setBarcode('');
    setScanState(controlsRef.current ? 'scanning' : 'no-camera');
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) lookupBarcode(manualCode.trim());
  };

  const goToAddItem = () => {
    controlsRef.current?.stop();
    navigate('/add-item', food ? { state: { food } } : undefined);
  };

  return (
    <div className="bg-black text-white h-screen overflow-hidden flex flex-col font-body-md relative">
      {/* Header overlay */}
      <header className="absolute top-0 left-0 w-full z-40 px-margin-mobile pt-safe-top h-nav-height flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent">
        <button onClick={() => { controlsRef.current?.stop(); navigate(-1); }} className="p-2 -ml-2 rounded-full hover:bg-white/20 transition-colors">
          <span className="material-symbols-outlined text-white">close</span>
        </button>
        <div className="bg-surface-container-lowest/20 backdrop-blur-md rounded-full px-4 py-1.5 border border-white/20">
          <span className="font-label-sm text-label-sm font-semibold text-white">Quét mã vạch thực phẩm</span>
        </div>
        <div className="w-10"></div>
      </header>

      {/* Camera viewfinder */}
      <div className="flex-1 relative flex items-center justify-center">
        <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" muted playsInline />

        {(scanState === 'scanning' || scanState === 'starting') && (
          <div className="relative w-[80%] h-[40%] max-w-sm rounded-2xl border-2 border-white/40 overflow-hidden shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-primary/70 shadow-[0_0_8px_2px_rgba(46,125,50,0.5)] animate-[scan_2s_ease-in-out_infinite]"></div>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white/80 font-body-md text-center px-4 whitespace-nowrap">
              {scanState === 'starting' ? 'Đang bật camera...' : 'Đưa mã vạch vào trong khung'}
            </div>
          </div>
        )}

        {scanState === 'looking-up' && (
          <div className="flex flex-col items-center z-20 bg-black/60 rounded-2xl p-8">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 relative">
              <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              <span className="material-symbols-outlined text-primary text-2xl">barcode_scanner</span>
            </div>
            <p className="text-white/90 font-body-md">Đang tra cứu mã {barcode}...</p>
          </div>
        )}

        {scanState === 'no-camera' && (
          <div className="flex flex-col items-center z-20 text-center px-8">
            <span className="material-symbols-outlined text-5xl text-white/60 mb-4">videocam_off</span>
            <h2 className="font-headline-sm text-headline-sm font-bold text-white mb-2">Không truy cập được camera</h2>
            <p className="text-white/70 font-body-md mb-6">Hãy cấp quyền camera cho trình duyệt, hoặc nhập mã vạch thủ công bên dưới.</p>
          </div>
        )}
      </div>

      {/* Manual barcode entry */}
      {(scanState === 'scanning' || scanState === 'no-camera' || scanState === 'starting') && (
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/90 to-transparent pt-12 px-6 pb-8 z-40">
          <form onSubmit={handleManualSubmit} className="flex gap-2 max-w-md mx-auto">
            <input
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="Hoặc nhập mã vạch thủ công..."
              inputMode="numeric"
              className="flex-1 px-4 py-3 rounded-xl bg-white/15 backdrop-blur-md border border-white/30 text-white placeholder-white/50 outline-none focus:border-primary font-mono"
            />
            <button type="submit" className="bg-primary text-on-primary px-5 rounded-xl font-label-md font-bold hover:opacity-90 transition-opacity">
              Tra cứu
            </button>
          </form>
          <p className="text-center text-white/50 font-label-sm mt-3">Mẹo: thử mã seed 8934673001234 (Sữa tươi)</p>
        </div>
      )}

      {/* Result bottom sheet */}
      {(scanState === 'found' || scanState === 'not-found') && (
        <div className="absolute bottom-0 left-0 w-full bg-surface-container-lowest text-on-surface rounded-t-3xl z-50 flex flex-col shadow-[0_-8px_30px_rgba(0,0,0,0.3)] animate-slide-up">
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1.5 bg-outline-variant rounded-full"></div>
          </div>

          <div className="px-6 pt-2 pb-8">
            {scanState === 'found' && food ? (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <h2 className="font-headline-sm text-headline-sm font-bold text-primary">Tìm thấy sản phẩm</h2>
                </div>
                <div className="flex items-center gap-4 bg-surface-container-low border border-outline-variant rounded-xl p-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-surface-container flex items-center justify-center shrink-0 overflow-hidden">
                    {food.imageUrl ? (
                      <img src={food.imageUrl} alt={food.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-3xl text-outline">grocery</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-body-lg text-body-lg font-bold text-on-surface">{food.name}</h3>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">
                      Đơn vị: {food.defaultUnit}
                      {food.defaultShelfLifeDays ? ` • HSD ~${food.defaultShelfLifeDays} ngày` : ''}
                    </p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant font-mono mt-0.5">{barcode}</p>
                  </div>
                </div>
                {food.storageTips && (
                  <div className="flex items-start gap-2 bg-tertiary-container/25 border border-tertiary/20 rounded-xl px-4 py-3 mb-4">
                    <span className="material-symbols-outlined text-tertiary mt-0.5">lightbulb</span>
                    <p className="font-body-md text-body-md text-on-surface">{food.storageTips}</p>
                  </div>
                )}
                <div className="flex gap-3">
                  <button onClick={resumeScanning} className="flex-1 py-3.5 rounded-xl font-label-md font-bold text-on-surface border border-outline-variant hover:bg-surface-container-low transition-colors">
                    Quét tiếp
                  </button>
                  <button onClick={goToAddItem} className="flex-1 py-3.5 rounded-xl font-label-md font-bold bg-primary text-on-primary hover:opacity-90 transition-opacity shadow-sm">
                    Thêm vào tủ lạnh
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-secondary">help</span>
                  <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">Không tìm thấy sản phẩm</h2>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant mb-1">
                  Mã <b className="font-mono">{barcode}</b> chưa có trong danh mục hệ thống.
                </p>
                <p className="font-label-sm text-label-sm text-on-surface-variant mb-5">
                  Quản trị viên có thể thêm mã vạch cho thực phẩm trong trang Admin → Thực phẩm.
                </p>
                <div className="flex gap-3">
                  <button onClick={resumeScanning} className="flex-1 py-3.5 rounded-xl font-label-md font-bold text-on-surface border border-outline-variant hover:bg-surface-container-low transition-colors">
                    Quét lại
                  </button>
                  <button onClick={goToAddItem} className="flex-1 py-3.5 rounded-xl font-label-md font-bold bg-primary text-on-primary hover:opacity-90 transition-opacity shadow-sm">
                    Thêm thủ công
                  </button>
                </div>
              </>
            )}
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
