import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDialog } from '../contexts/DialogContext';

export default function EditProfile() {
  const navigate = useNavigate();
  const { showAlert } = useDialog();
  
  // Fake initial state
  const [name, setName] = useState('Nguyễn Thu');
  const [email, setEmail] = useState('m.thu.nguyen@email.com');
  const [phone, setPhone] = useState('0901234567');
  const [avatar] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuDyl8yaRsuYJ42CVzel8-hugkAllxoAD37iFPM_sRGu7rM6F_D1wlMdaVeMM99txYq6cFtErP4pbvEPn6KW8axA-TfBoSgYTfnQSsLJl6era0guCk8IcZrVFE6yen0zae41Ph2W9RZ9RnBTgKxWWQBOhIhxVwimrf-ggYb9GteJ_gdV_tK4vPmYzdZ6qm6Dk5o5nlN-n73JZ2JhhkfqsOuLT9xNb_A5BZ_ZtspMF99qeDfe_SVZwxL3ZRLdnHJtcFKceu-JFgnmoQTB');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showAlert('Đã cập nhật thông tin thành công!');
    navigate('/profile');
  };

  return (
    <div className="bg-background text-on-background h-screen overflow-hidden font-body-md flex flex-col">
      <header className="shrink-0 h-16 bg-surface flex items-center justify-between px-4 border-b border-outline-variant z-40">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="text-on-surface p-2 -ml-2 mr-2 rounded-full hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-headline-sm text-headline-sm font-bold text-on-surface">Chỉnh sửa hồ sơ</h1>
        </div>
        <button onClick={handleSave} className="text-primary font-label-md font-bold px-4 py-2 hover:bg-primary/10 rounded-lg transition-colors">
          Lưu
        </button>
      </header>

      <main className="flex-1 overflow-y-auto w-full">
        <div className="pt-6 px-4 md:px-8 max-w-2xl mx-auto w-full pb-[100px] md:pb-8">
          
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="relative w-28 h-28 rounded-full border-4 border-primary-container overflow-hidden group mb-4">
              <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
              </div>
            </div>
            <button className="text-primary font-label-sm font-bold hover:underline">Thay đổi ảnh đại diện</button>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="font-label-md text-on-surface">Họ và tên</label>
              <input 
                type="text" 
                id="name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder="Nhập họ và tên"
                required
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="font-label-md text-on-surface">Email</label>
              <input 
                type="email" 
                id="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder="Nhập email"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="phone" className="font-label-md text-on-surface">Số điện thoại</label>
              <input 
                type="tel" 
                id="phone" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder="Nhập số điện thoại"
                required
              />
            </div>
          </form>

        </div>
      </main>
    </div>
  );
}
