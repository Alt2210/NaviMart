import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoPrimaryUrl } from '../assets/logos';
import { useAuth } from '../contexts/AuthContext';

export default function Splash() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        navigate(user?.role === 'admin' ? '/admin' : '/home');
      } else {
        navigate('/onboarding');
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate, isAuthenticated, user]);

  return (
    <div className="bg-background min-h-screen flex items-center justify-center m-0 overflow-hidden">
      <div className="splash-enter flex flex-col items-center justify-center gap-stack-md">
        <img src={logoPrimaryUrl} alt="NaviMart" className="w-48 md:w-56 object-contain drop-shadow-sm" />
      </div>
    </div>
  );
}
