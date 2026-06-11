import { useState } from 'react';
import { Link } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import SideNav from '../components/SideNav';
import { useDialog } from '../contexts/DialogContext';

// Types
interface MealSession {
  id: string;
  title: string;
  icon: string;
  colorClass: string;
  isMain: boolean;
}

interface Meal {
  id: number;
  session: string;
  name: string;
  calories: number;
  image: string;
  completed: boolean;
}

// Mock suggestions
const SUGGESTIONS = [
  { name: 'Bún Chả Hà Nội', calories: 550, image: 'https://images.unsplash.com/photo-1615486171448-4fd1ab64ce14?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
  { name: 'Cơm Tấm Sườn Bì', calories: 600, image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
  { name: 'Phở Gà', calories: 400, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
  { name: 'Bánh Mì Thịt Nướng', calories: 350, image: 'https://images.unsplash.com/photo-1630431341973-02e1b662ce3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
  { name: 'Gỏi Cuốn', calories: 200, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' }
];

export default function MealPlanner() {
  const { showConfirm } = useDialog();
  const [activeDay, setActiveDay] = useState(2);
  
  // Sessions
  const [sessions, setSessions] = useState<MealSession[]>([
    { id: 'breakfast', title: 'Bữa sáng', icon: 'wb_twilight', colorClass: 'text-primary', isMain: true },
    { id: 'lunch', title: 'Bữa trưa', icon: 'light_mode', colorClass: 'text-secondary', isMain: true },
    { id: 'dinner', title: 'Bữa tối', icon: 'bedtime', colorClass: 'text-tertiary', isMain: true }
  ]);

  // Meals
  const [meals, setMeals] = useState<Meal[]>([
    {
      id: 1,
      session: 'breakfast',
      name: 'Phở Bò Tái Lăn',
      calories: 450,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxLmjbbPFQHTwvJfV3r_myDF4070EhXZ5S_7TtLdzPOhzGPeuQBOzq8ES1vLJvj_YtvyxEbpZm878HmFbAAfdtBc3_1SADUdTAhB_WmJG-OwHy76VPPffqJPqRCi7X-kfCohlaoVxZ9fMJQtbqyBVtW8iSzPc1_lYGiPO7AfqLV0g-8xG6kwhLr00G8b4Ewm_4Qbuj24BoEyoYGHJYDnt6jsYDASjeYv38NWY6YSVN6Hn8X3DlAFO4GEQBOTXysG5Xj9EV-kLr0N6H',
      completed: false
    },
    {
      id: 2,
      session: 'lunch',
      name: 'Salad Ức Gà Xốt Mè Rang',
      calories: 250,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKaNpg41Npm2EialKKJPtfNdQ5C22RhoMHq5huapojrTZ3uSC8kJRNDFmiq3Fgj_zfZr2gJYqJTMSTkoxUAe98M_GUvkff6kFIvg8ikmlsrXXg6kTNTjvUaOPuu4bLRGq3UMZIyIWvY-6MbkKwx8j3tvrbRvFxdamAgECSImHWkl5DOXS8zcEdfXy0Z7EgvMGzk-W5cM1q4HZUXJdEqCEB1MJTPaxV6O1ZX3i5cw5qCXFQ-BA4jamQXTYbir1q0IzM91NWjF00qNDi',
      completed: false
    }
  ]);

  // Modal states for Meals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [targetSession, setTargetSession] = useState<string>('breakfast');
  const [formData, setFormData] = useState({ name: '', calories: '' });

  // Modal states for New Session
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [newSessionName, setNewSessionName] = useState('');

  // Suggestion Modal states
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState(SUGGESTIONS[0]);

  const toggleMeal = (id: number) => {
    setMeals(meals.map(m => m.id === id ? { ...m, completed: !m.completed } : m));
  };

  const deleteMeal = (id: number) => {
    showConfirm("Bạn có chắc chắn muốn xóa món ăn này khỏi lịch trình?", () => {
      setMeals(meals.filter(m => m.id !== id));
    });
  };

  const openAddModal = (sessionId: string) => {
    setEditingMeal(null);
    setTargetSession(sessionId);
    setFormData({ name: '', calories: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (meal: Meal) => {
    setEditingMeal(meal);
    setTargetSession(meal.session);
    setFormData({ name: meal.name, calories: meal.calories.toString() });
    setIsModalOpen(true);
  };

  const handleSaveMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.calories) return;

    if (editingMeal) {
      setMeals(meals.map(m => m.id === editingMeal.id ? { 
        ...m, 
        name: formData.name, 
        calories: parseInt(formData.calories) || 0 
      } : m));
    } else {
      const newMeal: Meal = {
        id: Date.now(),
        session: targetSession,
        name: formData.name,
        calories: parseInt(formData.calories) || 0,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        completed: false
      };
      setMeals([...meals, newMeal]);
    }
    
    setIsModalOpen(false);
  };

  // Add Session logic
  const handleSaveSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSessionName.trim()) {
      const newSession: MealSession = {
        id: `custom-${Date.now()}`,
        title: newSessionName,
        icon: 'restaurant',
        colorClass: 'text-on-surface',
        isMain: false
      };
      setSessions([...sessions, newSession]);
      setNewSessionName('');
      setIsSessionModalOpen(false);
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    showConfirm("Xóa bữa ăn này sẽ xóa toàn bộ món ăn bên trong. Bạn chắc chắn chứ?", () => {
      setSessions(sessions.filter(s => s.id !== sessionId));
      setMeals(meals.filter(m => m.session !== sessionId));
    });
  };

  // Suggestion logic
  const openSuggestModal = (sessionId: string) => {
    setTargetSession(sessionId);
    pickRandomSuggestion();
    setIsSuggestModalOpen(true);
  };

  const pickRandomSuggestion = () => {
    const randomIdx = Math.floor(Math.random() * SUGGESTIONS.length);
    setCurrentSuggestion(SUGGESTIONS[randomIdx]);
  };

  const acceptSuggestion = () => {
    const newMeal: Meal = {
      id: Date.now(),
      session: targetSession,
      name: currentSuggestion.name,
      calories: currentSuggestion.calories,
      image: currentSuggestion.image,
      completed: false
    };
    setMeals([...meals, newMeal]);
    setIsSuggestModalOpen(false);
  };

  const renderMealSection = (session: MealSession) => {
    const sectionMeals = meals.filter(m => m.session === session.id);

    return (
      <section key={session.id} className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden flex flex-col group transition-shadow mb-6">
        <div className="px-4 py-3 bg-surface-container-low border-b border-outline-variant flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className={`material-symbols-outlined ${session.colorClass}`}>{session.icon}</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">{session.title}</h3>
          </div>
          <div className="flex items-center gap-1">
            {!session.isMain && (
              <button 
                onClick={() => handleDeleteSession(session.id)}
                className="text-error hover:bg-error-container p-1.5 rounded-full transition-colors"
                title="Xóa bữa ăn này"
              >
                <span className="material-symbols-outlined text-[20px]">delete</span>
              </button>
            )}
            <button 
              onClick={() => openAddModal(session.id)} 
              className="text-primary hover:bg-primary-container hover:text-on-primary-container p-1.5 rounded-full transition-colors"
              title="Thêm món ăn"
            >
              <span className="material-symbols-outlined">add</span>
            </button>
          </div>
        </div>
        
        {sectionMeals.length > 0 ? (
          sectionMeals.map((meal, index) => (
            <div key={meal.id} className={`p-4 flex items-center gap-3 md:gap-4 ${index !== sectionMeals.length - 1 ? 'border-b border-outline-variant/50' : ''}`}>
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-surface-container-high">
                <img className="w-full h-full object-cover" src={meal.image} alt={meal.name}/>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-body-lg text-body-lg text-on-surface font-semibold truncate">{meal.name}</h4>
                <p className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-[14px]">local_fire_department</span> {meal.calories} kcal
                </p>
              </div>
              
              <div className="flex items-center gap-1 shrink-0">
                <button 
                  onClick={() => toggleMeal(meal.id)} 
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${meal.completed ? 'bg-primary border-primary text-on-primary' : 'border-outline text-primary hover:border-primary hover:bg-primary/5'}`}
                >
                  <span className={`material-symbols-outlined text-[18px] transition-all ${meal.completed ? 'scale-100 opacity-100' : 'scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100'}`}>check</span>
                </button>
                <button 
                  onClick={() => openEditModal(meal)} 
                  className="text-on-surface-variant hover:text-primary hover:bg-surface-container-high p-2 rounded-full transition-colors flex"
                >
                  <span className="material-symbols-outlined text-[20px]">edit</span>
                </button>
                <button 
                  onClick={() => deleteMeal(meal.id)} 
                  className="text-on-surface-variant hover:text-error hover:bg-error-container p-2 -mr-2 rounded-full transition-colors flex"
                >
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 flex flex-col items-center justify-center text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl mb-2 opacity-50">restaurant_menu</span>
            <p className="font-body-md text-center">Chưa có món ăn nào.</p>
            <button 
              onClick={() => openAddModal(session.id)}
              className="mt-2 text-primary font-label-md hover:underline"
            >
              Thêm món ăn
            </button>
          </div>
        )}
        
        {sectionMeals.length > 0 && (
          <button 
            onClick={() => openSuggestModal(session.id)} 
            className="w-[calc(100%-2rem)] p-3 flex items-center justify-center border-2 border-dashed border-outline-variant mx-4 mb-4 mt-2 rounded-xl hover:bg-surface-container-low transition-colors text-on-surface-variant hover:text-primary"
          >
            <div className="flex items-center gap-2 font-label-md font-medium"><span className="material-symbols-outlined text-[18px]">auto_awesome</span> Gợi ý món ăn</div>
          </button>
        )}
      </section>
    );
  };

  return (
    <div className="bg-background text-on-background h-screen overflow-hidden font-body-md antialiased flex flex-col md:flex-row">
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
              <span className="font-bold text-primary text-sm">Lịch trình bữa ăn</span>
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
        <header className="shrink-0 bg-surface border-b border-outline-variant md:border-none md:bg-transparent md:pt-8 md:px-8 px-margin-mobile py-4 flex flex-col gap-4 z-30">
          <div className="flex justify-between items-center w-full">
            <div className="flex flex-col">
              <h1 className="font-headline-md text-headline-md text-primary mb-2">Lịch trình bữa ăn</h1>
              <p className="font-body-md text-body-md text-on-surface-variant">Tháng 10, 2024</p>
            </div>
            <div className="flex gap-2">
              <button aria-label="Tìm kiếm món ăn" className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant bg-surface-container hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined">search</span>
              </button>
            </div>
          </div>

          <div className="flex overflow-x-auto gap-3 pb-2 snap-x snap-mandatory hide-scrollbar -mx-margin-mobile px-margin-mobile md:mx-0 md:px-0">
            {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, idx) => (
              <button 
                key={idx} 
                onClick={() => setActiveDay(idx)}
                className={`snap-center shrink-0 w-14 h-20 rounded-full flex flex-col items-center justify-center gap-1 transition-all ${activeDay === idx ? 'bg-primary text-on-primary shadow-md' : 'bg-surface-container-lowest border border-outline-variant text-on-surface-variant hover:bg-surface-container'}`}
              >
                <span className={`font-label-sm text-label-sm ${activeDay === idx ? 'opacity-80' : ''}`}>{day}</span>
                <span className="font-headline-sm text-headline-sm font-bold">{14 + idx}</span>
              </button>
            ))}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto w-full">
          <div className="px-margin-mobile md:px-8 py-stack-md flex flex-col max-w-5xl mx-auto pb-[100px] md:pb-8">
            
            {sessions.map(session => renderMealSection(session))}
            
            {/* Thêm bữa ăn mới */}
            <button 
              onClick={() => setIsSessionModalOpen(true)}
              className="mt-2 w-full py-4 border-2 border-dashed border-primary/40 rounded-2xl text-primary font-headline-sm hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">add_box</span>
              Thêm bữa ăn
            </button>
            
          </div>
        </main>
        
        {/* Add/Edit Meal Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-surface rounded-2xl p-6 w-full max-w-md shadow-xl border border-outline-variant/30">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-headline-sm text-headline-sm text-on-surface">
                  {editingMeal ? 'Chỉnh sửa món ăn' : 'Thêm món ăn mới'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              
              <form onSubmit={handleSaveMeal}>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block font-label-md text-on-surface mb-1">Tên món ăn</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="Nhập tên món ăn..."
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block font-label-md text-on-surface mb-1">Lượng Calo (kcal)</label>
                    <input 
                      type="number" 
                      required
                      min="0"
                      value={formData.calories}
                      onChange={e => setFormData({...formData, calories: e.target.value})}
                      placeholder="Ví dụ: 300"
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-lg font-label-md font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors"
                  >
                    Hủy
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2.5 rounded-lg font-label-md font-bold bg-primary text-on-primary hover:opacity-90 transition-opacity shadow-sm"
                  >
                    Lưu
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Session Modal */}
        {isSessionModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-surface rounded-2xl p-6 w-full max-w-sm shadow-xl border border-outline-variant/30">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Tạo bữa ăn mới</h2>
                <button onClick={() => setIsSessionModalOpen(false)} className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              
              <form onSubmit={handleSaveSession}>
                <div className="mb-6">
                  <label className="block font-label-md text-on-surface mb-1">Tên bữa ăn</label>
                  <input 
                    type="text" 
                    required
                    value={newSessionName}
                    onChange={e => setNewSessionName(e.target.value)}
                    placeholder="VD: Ăn xế, Ăn đêm..."
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
                
                <div className="flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsSessionModalOpen(false)}
                    className="px-5 py-2.5 rounded-lg font-label-md font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors"
                  >
                    Hủy
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2.5 rounded-lg font-label-md font-bold bg-primary text-on-primary hover:opacity-90 transition-opacity shadow-sm"
                  >
                    Tạo mới
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Suggestion Modal */}
        {isSuggestModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-surface rounded-3xl p-6 w-full max-w-sm shadow-xl border border-outline-variant/30 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-32 bg-primary/10 -z-10"></div>
              
              <div className="flex justify-end mb-2">
                <button onClick={() => setIsSuggestModalOpen(false)} className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors -mr-2 -mt-2">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              
              <div className="mb-2">
                <span className="material-symbols-outlined text-5xl text-primary mb-2">auto_awesome</span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Hôm nay ăn gì?</h2>
              </div>
              
              <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm my-6">
                <div className="h-40 w-full bg-surface-variant">
                  <img src={currentSuggestion.image} alt={currentSuggestion.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1 font-bold">{currentSuggestion.name}</h3>
                  <p className="font-body-md flex items-center justify-center gap-1 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[18px]">local_fire_department</span> {currentSuggestion.calories} kcal
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 mt-4">
                <button 
                  onClick={pickRandomSuggestion}
                  className="flex-1 py-3 rounded-xl font-label-md font-bold text-on-surface border border-outline-variant hover:bg-surface-container-low transition-colors"
                >
                  Bỏ qua
                </button>
                <button 
                  onClick={acceptSuggestion}
                  className="flex-1 py-3 rounded-xl font-label-md font-bold bg-primary text-on-primary hover:opacity-90 transition-opacity shadow-sm"
                >
                  Thêm món này
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      <BottomNav />
    </div>
  );
}
