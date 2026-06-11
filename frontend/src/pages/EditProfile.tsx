import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDialog } from '../contexts/DialogContext';
import { useAuth } from '../contexts/AuthContext';
import { usersApi } from '../api';

export default function EditProfile() {
  const navigate = useNavigate();
  const { showAlert } = useDialog();
  const { user, refreshSession } = useAuth();

  const [name, setName] = useState(user?.displayName ?? '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? '');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName || saving) return;

    const nameParts = trimmedName.split(/\s+/);
    const lastName = nameParts.pop()!;
    const firstName = nameParts.join(' ') || lastName;

    setSaving(true);
    try {
      await usersApi.updateMe({
        firstName,
        lastName,
        displayName: trimmedName,
        avatarUrl: avatarUrl.trim() || undefined,
      });
      // Sync the locally cached auth user with the new profile.
      await refreshSession();
      showAlert('Đã cập nhật thông tin thành công!');
      navigate('/profile');
    } catch (err) {
      showAlert(err instanceof Error ? err.message : 'Không cập nhật được hồ sơ.');
    } finally {
      setSaving(false);
    }
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
        <button onClick={handleSave} disabled={saving} className="text-primary font-label-md font-bold px-4 py-2 hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-50">
          {saving ? 'Đang lưu...' : 'Lưu'}
        </button>
      </header>

      <main className="flex-1 overflow-y-auto w-full">
        <div className="pt-6 px-4 md:px-8 max-w-2xl mx-auto w-full pb-[100px] md:pb-8">
          
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="relative w-28 h-28 rounded-full border-4 border-primary-container overflow-hidden group mb-4 bg-primary-container flex items-center justify-center">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="font-display-sm text-display-sm font-bold text-on-primary-container">
                  {(name || '?').charAt(0).toUpperCase()}
                </span>
              )}
            </div>
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
              <label htmlFor="avatarUrl" className="font-label-md text-on-surface">Ảnh đại diện (URL)</label>
              <input
                type="url"
                id="avatarUrl"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder="https://..."
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-on-surface">Email / Số điện thoại</label>
              <p className="font-body-md text-on-surface-variant px-4 py-3 bg-surface-container-low border border-outline-variant/40 rounded-xl">
                {[user?.email, user?.phone].filter(Boolean).join(' • ') || 'Chưa cập nhật'}
              </p>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Thông tin đăng nhập không thể thay đổi tại đây.</p>
            </div>
          </form>

        </div>
      </main>
    </div>
  );
}
