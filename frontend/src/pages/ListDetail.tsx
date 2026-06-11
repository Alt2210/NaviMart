import { useState } from 'react';
import { Link } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

export default function ListDetail() {
  const [items, setItems] = useState([
    {
      id: 1,
      name: 'Cải ngọt',
      unit: '1 bó (~500g)',
      amount: 1,
      checked: false,
      category: 'Rau củ',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBo3cIHbdWYzrpz1rGWY6_cClQ3rGc1Uu8Y8ff0J48aZcZfBLKMjO-DFMwR5TPvtdw9GHkkH0F4MmjQTC-edEFfl6w04ezByYfB5z-VdnCv1YBcONoLKYPiFdzPrzkvA7OdXEAAWFvxXqR_9n0JxiSkN_uvExfJV6IxT-5Lq_t26-07iDvS4RMWEWZxw1VBT3kozgwro0q0xHxzxtzy8LkAIGiEV-katzqScCE2yjzZqL3DlYsson-TUktQcBpriYe4cXtGnSPOWlKR'
    },
    {
      id: 2,
      name: 'Thịt ba chỉ heo',
      unit: '500g',
      amount: 1,
      checked: true,
      category: 'Thịt cá',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRqRi27MDbCvxvnZda45Z8KneEYXxD4zc5OhlJ6QhMAm-HpJGgTPrrDFw4EVyXZnI08wuFfYFZSUiXLZ49-tIvt0vVh3_gbtEvCmw7nqmULk84uuDlHpTOinfmUmkWCZE9ar982X8o-wauO-JWtBn2AWJUOob7xOYrBvJcv16t99mmZCBSu7geojPG6ACTsAH_OJxJQkBtgyi_TwaVr0HA5CBu5QB09qnv2YIf7MpD_9zLwe_v4xemWKtz81CPdFTHACZVWkzktfX1'
    }
  ]);
  const [newItem, setNewItem] = useState('');

  const toggleCheck = (id: number) => {
    setItems(items.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };
  const updateAmount = (id: number, delta: number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newAmount = Math.max(1, item.amount + delta);
        return { ...item, amount: newAmount };
      }
      return item;
    }));
  };
  const deleteItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };
  const handleAddItem = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newItem.trim()) {
      setItems([...items, {
        id: Date.now(),
        name: newItem.trim(),
        unit: 'Tùy chọn',
        amount: 1,
        checked: false,
        category: 'Khác',
        image: ''
      }]);
      setNewItem('');
    }
  };

  const categories = Array.from(new Set(items.map(i => i.category)));

  return (
    <div className="bg-background text-on-background h-screen overflow-hidden font-body-md antialiased flex flex-col">
      <header className="shrink-0 bg-surface dark:bg-surface-dim border-b border-outline-variant w-full z-40">
        <div className="flex justify-between items-center w-full h-nav-height px-margin-mobile max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <Link to="/lists" className="material-symbols-outlined text-primary dark:text-primary-fixed hover:bg-surface-container-high dark:hover:bg-surface-container transition-colors rounded-full p-2">arrow_back</Link>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <Link to="/home" className="hover:text-primary transition-colors flex items-center">
                <span className="material-symbols-outlined text-[20px]">home</span>
              </Link>
              <span className="text-sm">/</span>
              <span className="font-bold text-primary text-sm">Chi tiết danh sách</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="material-symbols-outlined text-primary dark:text-primary-fixed hover:bg-surface-container-high dark:hover:bg-surface-container transition-colors rounded-full p-2">notifications</button>
            <Link to="/profile" className="text-on-surface-variant font-medium hover:bg-surface-container-high dark:hover:bg-surface-container transition-colors p-2 rounded-full flex items-center justify-center active:opacity-80 active:scale-95 duration-150">
              <span className="material-symbols-outlined">account_circle</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto w-full">
        <div className="max-w-7xl mx-auto w-full pt-stack-md pb-[100px] md:pb-8">
        <section className="px-margin-mobile mb-stack-md">
          <div className="flex justify-between items-end mb-stack-sm">
            <div>
              <h1 className="font-headline-md text-headline-md text-primary mb-2">Đi chợ hôm nay</h1>
              <p className="font-body-md text-body-md text-on-surface-variant">Ngày mai • Bách Hóa Xanh</p>
            </div>
            <button className="material-symbols-outlined text-primary-container bg-surface-container-low rounded-full p-2 hover:bg-surface-container-highest transition-colors shadow-sm">more_horiz</button>
          </div>
          
          <div className="relative mt-stack-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">add_shopping_cart</span>
            <input 
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={handleAddItem}
              className="w-full pl-10 pr-4 py-3 rounded-none border border-[#c1c1c1] bg-surface-container-lowest font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container shadow-sm transition-all" 
              placeholder="Thêm món đồ nhanh (Nhấn Enter để thêm)..." 
              type="text"
            />
          </div>
        </section>

        {categories.map(category => {
          const categoryItems = items.filter(i => i.category === category);
          if (categoryItems.length === 0) return null;
          return (
            <section key={category} className="mb-stack-md">
              <div className="px-margin-mobile flex items-center gap-2 mb-stack-sm">
                <span className="material-symbols-outlined text-tertiary-container" style={{ fontVariationSettings: "'FILL' 1" }}>category</span>
                <h2 className="font-headline-sm text-headline-sm text-tertiary">{category}</h2>
                <span className="ml-auto font-label-sm text-label-sm text-outline px-2 py-1 bg-surface-container rounded-full">{categoryItems.length} món</span>
              </div>
              <div className="px-margin-mobile flex flex-col gap-stack-sm">
                {categoryItems.map(item => (
                  <div key={item.id} className={`flex items-center gap-stack-sm rounded-lg p-3 border transition-all ${item.checked ? 'bg-surface-container-low border-outline-variant opacity-80' : 'bg-surface-container-lowest shadow-sm border-surface-container-highest hover:shadow-md'}`}>
                    <input 
                      className="w-6 h-6 rounded border-outline-variant text-primary-container cursor-pointer flex-shrink-0" 
                      type="checkbox" 
                      checked={item.checked} 
                      onChange={() => toggleCheck(item.id)} 
                    />
                    <div className={`w-12 h-12 rounded-lg overflow-hidden bg-surface-container flex-shrink-0 flex items-center justify-center ${item.checked ? 'opacity-70 grayscale-[30%]' : ''}`}>
                      {item.image ? (
                        <img alt={item.name} className="w-full h-full object-cover" src={item.image}/>
                      ) : (
                        <span className="material-symbols-outlined text-outline">image</span>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col">
                      <span className={`font-body-md text-body-md font-bold text-on-surface ${item.checked ? 'line-through text-on-surface-variant' : ''}`}>{item.name}</span>
                      <span className={`font-label-sm text-label-sm text-on-surface-variant mt-0.5 ${item.checked ? 'line-through' : ''}`}>{item.unit}</span>
                    </div>
                    {item.checked ? (
                      <div className="flex items-center opacity-50 pointer-events-none">
                        <span className="font-body-md text-body-md text-on-surface font-bold">Đã mua</span>
                      </div>
                    ) : (
                      <div className="flex items-center bg-surface-container rounded-full p-1 border border-outline-variant shrink-0">
                        <button onClick={() => updateAmount(item.id, -1)} className="w-7 h-7 flex items-center justify-center rounded-full text-primary-container hover:bg-surface-container-high transition-colors">
                          <span className="material-symbols-outlined text-[18px]">remove</span>
                        </button>
                        <span className="font-body-md text-body-md text-on-surface w-6 text-center font-bold">{item.amount}</span>
                        <button onClick={() => updateAmount(item.id, 1)} className="w-7 h-7 flex items-center justify-center rounded-full bg-primary-container text-on-primary-container shadow-sm hover:opacity-90 transition-opacity">
                          <span className="material-symbols-outlined text-[18px]">add</span>
                        </button>
                      </div>
                    )}
                    <button onClick={() => deleteItem(item.id)} className="ml-2 text-error hover:bg-error-container p-2 rounded-full transition-colors flex-shrink-0">
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )
        })}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
