import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { authApi } from '../api';
import { useDialog } from '../contexts/DialogContext';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { showAlert } = useDialog();
  const [step, setStep] = useState<1 | 2>(1);
  const [identifier, setIdentifier] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [devToken, setDevToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const requestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || loading) return;
    setError('');
    setLoading(true);
    try {
      const result = await authApi.forgotPassword(identifier.trim());
      if (result.devResetToken) {
        setDevToken(result.devResetToken);
        setToken(result.devResetToken);
      }
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không gửi được yêu cầu.');
    } finally {
      setLoading(false);
    }
  };

  const submitReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim() || !newPassword || loading) return;
    if (newPassword.length < 8) {
      setError('Mật khẩu mới phải có ít nhất 8 ký tự.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await authApi.resetPassword(token.trim(), newPassword);
      showAlert('Đặt lại mật khẩu thành công! Hãy đăng nhập bằng mật khẩu mới.');
      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Mã đặt lại không hợp lệ hoặc đã hết hạn.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full pl-10 pr-4 py-3 bg-transparent border border-[#C1C1C1] rounded-none focus:ring-1 focus:ring-primary focus:border-primary font-body-md text-body-md text-on-surface placeholder-outline-variant transition-colors';

  return (
    <div className="bg-background h-screen overflow-y-auto w-full flex items-center justify-center p-4 md:p-8">
      <main className="w-full max-w-md bg-surface-container-lowest rounded-xl shadow-lg p-8 md:p-10">
        <div className="flex justify-center mb-6">
          <img src="/src/assets/logo-1-primary.png" alt="NaviMart" className="h-10 object-contain" />
        </div>
        <div className="mb-8 text-center">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Quên mật khẩu</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {step === 1
              ? 'Nhập email hoặc số điện thoại để nhận mã đặt lại mật khẩu.'
              : 'Nhập mã đặt lại và mật khẩu mới của bạn.'}
          </p>
        </div>

        {step === 1 ? (
          <form className="space-y-6" onSubmit={requestReset}>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="material-symbols-outlined text-outline">person</span>
              </span>
              <input
                className={inputClass}
                placeholder="Email hoặc số điện thoại"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>
            {error && (
              <p className="font-body-md text-body-md text-error bg-error-container/30 border border-error/30 rounded-lg px-4 py-3">{error}</p>
            )}
            <Button type="submit" fullWidth icon="send">
              {loading ? 'Đang gửi...' : 'Gửi mã đặt lại'}
            </Button>
          </form>
        ) : (
          <form className="space-y-6" onSubmit={submitReset}>
            {devToken && (
              <div className="bg-tertiary-container/25 border border-tertiary/20 rounded-lg px-4 py-3">
                <p className="font-label-sm text-label-sm font-bold text-tertiary mb-1">Chế độ phát triển (chưa cấu hình email)</p>
                <p className="font-body-md text-body-md text-on-surface break-all">
                  Mã đặt lại của bạn: <b className="select-all">{devToken}</b>
                </p>
              </div>
            )}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="material-symbols-outlined text-outline">key</span>
              </span>
              <input
                className={inputClass}
                placeholder="Mã đặt lại"
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="material-symbols-outlined text-outline">lock_reset</span>
              </span>
              <input
                className={inputClass}
                placeholder="Mật khẩu mới (tối thiểu 8 ký tự)"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            {error && (
              <p className="font-body-md text-body-md text-error bg-error-container/30 border border-error/30 rounded-lg px-4 py-3">{error}</p>
            )}
            <Button type="submit" fullWidth icon="lock_reset">
              {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
            </Button>
            <button
              type="button"
              onClick={() => { setStep(1); setError(''); }}
              className="w-full text-center font-body-md text-primary hover:underline"
            >
              Gửi lại mã khác
            </button>
          </form>
        )}

        <p className="mt-8 text-center font-body-md text-body-md text-on-surface-variant">
          Nhớ ra mật khẩu rồi?
          <Link to="/login" className="ml-1 font-semibold text-primary hover:underline underline-offset-4">Đăng nhập</Link>
        </p>
      </main>
    </div>
  );
}
