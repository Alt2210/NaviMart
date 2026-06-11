import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    // Navigate to onboarding after 2.5 seconds
    const timer = setTimeout(() => {
      navigate('/onboarding');
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="bg-background min-h-screen flex items-center justify-center m-0 overflow-hidden">
      <div className="splash-enter flex flex-col items-center justify-center gap-stack-md">
        <img src="/src/assets/logo-1-primary.png" alt="NaviMart" className="w-48 md:w-56 object-contain drop-shadow-sm" />
      </div>
    </div>
  );
}
