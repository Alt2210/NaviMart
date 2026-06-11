import { useState } from 'react';
import { Link } from 'react-router-dom';
import SideNav from '../components/SideNav';
import { useDialog } from '../contexts/DialogContext';

export default function FamilySharing() {
  const { showAlert, showConfirm } = useDialog();
  const [members, setMembers] = useState([
    { id: 1, name: 'Mẹ Thu', role: 'Chủ hộ', isMe: true, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyl8yaRsuYJ42CVzel8-hugkAllxoAD37iFPM_sRGu7rM6F_D1wlMdaVeMM99txYq6cFtErP4pbvEPn6KW8axA-TfBoSgYTfnQSsLJl6era0guCk8IcZrVFE6yen0zae41Ph2W9RZ9RnBTgKxWWQBOhIhxVwimrf-ggYb9GteJ_gdV_tK4vPmYzdZ6qm6Dk5o5nlN-n73JZ2JhhkfqsOuLT9xNb_A5BZ_ZtspMF99qeDfe_SVZwxL3ZRLdnHJtcFKceu-JFgnmoQTB' },
    { id: 2, name: 'Con Gái Hoa', role: 'Thành viên', isMe: false, avatarLetter: 'H' }
  ]);
  const [invites, setInvites] = useState([
    { id: 3, phone: '090 123 4567', status: 'Đang chờ xác nhận' }
  ]);

  // New states
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [invitePhone, setInvitePhone] = useState('');
  const [inviteRole, setInviteRole] = useState('Thành viên');
  
  const [permissions, setPermissions] = useState({
    viewPantry: true,
    editList: true
  });

  const removeMember = (id: number) => {
    showConfirm("Bạn có chắc chắn muốn xóa thành viên này khỏi nhóm gia đình?", () => {
      setMembers(members.filter(m => m.id !== id));
    });
  };
  
  const removeInvite = (id: number) => {
    showConfirm("Bạn có chắc chắn muốn hủy lời mời này?", () => {
      setInvites(invites.filter(i => i.id !== id));
    });
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (invitePhone.trim() !== '') {
      const newInvite = {
        id: Date.now(),
        phone: invitePhone,
        status: 'Đang chờ xác nhận'
      };
      setInvites([...invites, newInvite]);
      setIsInviteModalOpen(false);
      setInvitePhone('');
      showAlert("Đã gửi lời mời thành công!");
    }
  };

  const handleTogglePermission = (key: 'viewPantry' | 'editList') => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-background text-on-background h-screen overflow-hidden flex font-body-md">
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
              <span className="font-bold text-primary text-sm">Quản lý gia đình</span>
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
        <header className="md:hidden shrink-0 h-16 bg-surface flex items-center px-4 border-b border-outline-variant z-40">
          <button className="text-on-surface p-2 -ml-2 mr-2" onClick={() => window.history.back()}>
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-headline-sm text-headline-sm text-on-surface">Quản lý Nhóm Gia Đình</h1>
        </header>

        <main className="flex-1 overflow-y-auto w-full">
          <div className="pt-4 md:pt-12 px-4 md:px-8 max-w-5xl mx-auto w-full pb-[100px] md:pb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h1 className="font-headline-md text-headline-md text-primary mb-2 hidden md:block">Quản lý Nhóm Gia Đình</h1>
                <p className="font-body-md text-body-md text-on-surface-variant">Gia đình "Bếp Ấm Áp"</p>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <button 
                  onClick={() => setIsQRModalOpen(true)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary-container text-on-primary-container font-body-md text-body-md px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                  <span className="material-symbols-outlined text-sm">qr_code_scanner</span>
                  Mã QR
                </button>
                <button 
                  onClick={() => setIsInviteModalOpen(true)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary text-on-primary font-body-md text-body-md px-4 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-sm"
                >
                  <span className="material-symbols-outlined text-sm">person_add</span>
                  Mời qua SĐT
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-outline-variant/30">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4">Thành viên ({members.length + invites.length})</h3>
                  <div className="space-y-4">
                    {members.map(member => (
                      <div key={member.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-container-low transition-colors group">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className={`w-12 h-12 rounded-full overflow-hidden ${member.isMe ? 'border-2 border-primary bg-surface-variant' : 'bg-surface-variant flex items-center justify-center bg-secondary-container text-on-secondary-container font-headline-sm'}`}>
                              {member.avatar ? (
                                <img alt="Avatar" className="w-full h-full object-cover" src={member.avatar}/>
                              ) : (
                                member.avatarLetter
                              )}
                            </div>
                            {member.isMe && (
                              <div className="absolute -bottom-1 -right-1 bg-primary text-on-primary text-[10px] px-1.5 py-0.5 rounded-full font-bold border border-surface-container-lowest">
                                Bạn
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-body-md text-body-md font-bold text-on-surface">{member.name}</p>
                            <p className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                              {member.isMe && <span className="material-symbols-outlined text-[14px] text-tertiary">stars</span>} {member.role}
                            </p>
                          </div>
                        </div>
                        {!member.isMe && (
                          <button onClick={() => removeMember(member.id)} className="text-error p-2 hover:bg-error-container rounded-full transition-colors" title="Xóa thành viên">
                            <span className="material-symbols-outlined">person_remove</span>
                          </button>
                        )}
                      </div>
                    ))}

                    {invites.map(invite => (
                      <div key={invite.id} className="flex items-center justify-between p-3 rounded-lg border border-dashed border-outline-variant bg-surface-container-low/50">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full border-2 border-dashed border-outline-variant flex items-center justify-center text-outline-variant">
                            <span className="material-symbols-outlined">mail</span>
                          </div>
                          <div>
                            <p className="font-body-md text-body-md text-on-surface opacity-70">{invite.phone}</p>
                            <p className="font-label-sm text-label-sm text-secondary flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">schedule</span> {invite.status}
                            </p>
                          </div>
                        </div>
                        <button onClick={() => removeInvite(invite.id)} className="text-error text-sm font-body-md px-3 py-1 hover:bg-error-container rounded-md transition-colors">
                          Hủy
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-outline-variant/30">
                  <div className="flex items-center gap-2 mb-4 text-primary">
                    <span className="material-symbols-outlined">shield_lock</span>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">Quyền hạn chung</h3>
                  </div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mb-6">Mặc định áp dụng cho tất cả Thành viên trong gia đình.</p>
                  
                  <div className="space-y-5">
                    <label className="flex items-start justify-between cursor-pointer group">
                      <div className="flex-1 pr-4">
                        <p className="font-body-md text-body-md text-on-surface">Xem tủ lạnh chung</p>
                        <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">Cho phép xem số lượng và hạn sử dụng thực phẩm.</p>
                      </div>
                      <div className="relative">
                        <input 
                          checked={permissions.viewPantry} 
                          onChange={() => handleTogglePermission('viewPantry')} 
                          className="sr-only peer" 
                          type="checkbox"
                        />
                        <div className="w-11 h-6 bg-surface-variant rounded-full peer peer-checked:bg-primary after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                      </div>
                    </label>
                    <hr className="border-outline-variant/30"/>
                    <label className="flex items-start justify-between cursor-pointer group">
                      <div className="flex-1 pr-4">
                        <p className="font-body-md text-body-md text-on-surface">Chỉnh sửa danh sách đi chợ</p>
                        <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">Thêm, xóa hoặc đánh dấu đã mua các mặt hàng.</p>
                      </div>
                      <div className="relative">
                        <input 
                          checked={permissions.editList} 
                          onChange={() => handleTogglePermission('editList')}
                          className="sr-only peer" 
                          type="checkbox"
                        />
                        <div className="w-11 h-6 bg-surface-variant rounded-full peer peer-checked:bg-primary after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="bg-error-container/30 rounded-xl p-4 border border-error-container">
                  <button className="w-full flex items-center justify-center gap-2 text-error font-body-md text-body-md py-2 hover:bg-error-container/50 rounded-lg transition-colors">
                    <span className="material-symbols-outlined">logout</span>
                    Rời khỏi Nhóm Gia Đình
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        {/* Modal: Invite by Phone */}
        {isInviteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-surface rounded-2xl p-6 w-full max-w-md shadow-xl border border-outline-variant/30">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Mời thành viên mới</h2>
                <button onClick={() => setIsInviteModalOpen(false)} className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              
              <form onSubmit={handleSendInvite}>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block font-label-md text-on-surface mb-1">Số điện thoại</label>
                    <input 
                      type="tel" 
                      required
                      value={invitePhone}
                      onChange={e => setInvitePhone(e.target.value)}
                      placeholder="Nhập số điện thoại..."
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block font-label-md text-on-surface mb-1">Vai trò</label>
                    <div className="relative">
                      <select 
                        value={inviteRole}
                        onChange={e => setInviteRole(e.target.value)}
                        className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none"
                      >
                        <option value="Thành viên">Thành viên</option>
                        <option value="Quản trị">Quản trị</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsInviteModalOpen(false)}
                    className="px-5 py-2.5 rounded-lg font-label-md font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors"
                  >
                    Hủy
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2.5 rounded-lg font-label-md font-bold bg-primary text-on-primary hover:opacity-90 transition-opacity shadow-sm"
                  >
                    Gửi lời mời
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: QR Code */}
        {isQRModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-surface rounded-2xl p-6 w-full max-w-sm shadow-xl border border-outline-variant/30 flex flex-col items-center">
              <div className="w-full flex justify-end mb-2">
                <button onClick={() => setIsQRModalOpen(false)} className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors -mr-2 -mt-2">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              
              <h2 className="font-headline-sm text-headline-sm text-primary mb-2 text-center">Quét mã QR để tham gia</h2>
              <p className="font-body-md text-on-surface-variant text-center mb-6">Đưa mã này cho người thân của bạn để họ quét bằng ứng dụng NaviMart.</p>
              
              <div className="w-48 h-48 bg-white p-2 rounded-xl mb-6 shadow-sm border border-outline-variant">
                {/* Fake QR Code image */}
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=NaviMartFamily123" alt="QR Code" className="w-full h-full object-contain" />
              </div>
              
              <div className="bg-surface-container-low w-full rounded-lg p-3 text-center mb-2">
                <span className="font-label-sm text-on-surface-variant block mb-1">Hoặc dùng mã liên kết</span>
                <span className="font-headline-sm font-bold text-on-surface tracking-widest">NVM-8A9K</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
