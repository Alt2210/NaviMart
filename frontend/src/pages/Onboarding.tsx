import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const slides = [
  {
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXc8_jCbf-I0Tg2wXkk9I17WzYZoTfP06V9so9vfKH35dlFciCKg8lt_Ndf44aIStgDhBt4RKhZzA4CoieRPahpqWhMFIVa7sD0knPuaN49IdteKG-tBAse876tZndb33fNqmoDSX0ZOJL4fYtpgbRFHaYFy1w4BAJC0NAm3fXGyqw_veowI-QMC4LQ2BOWhOSIigr-nGRMLn1wKwR7WC-RCjbzfxHCl3MiCRSgk86xKCA4wIxg0sayrFHGs2NqzvYMfhuLVSopJIW",
    title: "Lên danh sách mua sắm nhanh chóng",
    description: "Tạo danh sách đi chợ trong chớp mắt. Ghi nhớ mọi nguyên liệu tươi ngon bạn cần cho gia đình."
  },
  {
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuASGUpwxauyLq_3qHqW3ElH8qYafUhtHkvqzaVkHBKhVz5BrqhJfSP0EFb0z5i7w_mhxS-LWDRFk_oDo_T0jNuI_nrWWTqPb0hK6mcSHIEd9NGHvXMYhdjCzT21dJ8nEnHpzLIC6C5BQgfia5NLz1WQoVtZMtvhNPnwoM8ta8j1PbSwPZ8TJFFKUlAn-2RMloTZ1PJ8LlSsIwJdfG384CpnsOlbzXHrBiGjip1x_jGqFyJC63fp20Edg087T-3bbKlGrDUpAkW5yJrM",
    title: "Quản lý thực phẩm,\ntránh lãng phí",
    description: "Theo dõi hạn sử dụng và số lượng tồn kho. Luôn sử dụng thực phẩm lúc tươi ngon nhất."
  },
  {
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAdbomFpg_dTWXgLXHfLIN4wU2JlKOK0dVJX1WnlEkq-CmCaaF5yFcrkHVqNtlJ_gvRLMFEHZxshERnVRKXIyXBx6idGpvX3HLlxBTm0ag97NVlyL6jsQ6S8cOBGcsOoazCFW0Ud83n6megb42jtG1qutkehB-QGr0MaINObpYpcV79ar2ULdnvZ1EYvXPKETXy7n0GISv_hnlafk2K6syZAEHrciWiniaCVMG1UyfQAsiA6oKc1XgwFVkW6S3xd0kBmH_Qd8AIJF3T",
    title: "Gợi ý bữa ăn\nthông minh",
    description: "Hôm nay ăn gì? NaviMart sẽ gợi ý những món ngon hoàn hảo từ chính những gì có sẵn trong tủ lạnh của bạn."
  }
];

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      navigate('/login');
    }
  };

  const handleSkip = () => {
    navigate('/login');
  };

  return (
    <main className="relative h-screen w-full max-w-md mx-auto flex flex-col overflow-hidden bg-background shadow-2xl">
      <header className="w-full flex justify-end px-margin-mobile pt-8 pb-4 z-10 relative">
        <Button variant="text" onClick={handleSkip}>
          Bỏ qua
        </Button>
      </header>

      <div className="flex-1 w-full overflow-hidden relative">
        <div 
          className="flex w-[300%] h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentSlide * (100 / slides.length)}%)` }}
        >
          {slides.map((slide, index) => (
            <article key={index} className="w-1/3 h-full flex flex-col items-center justify-center px-margin-mobile pb-12">
              <div className="w-full max-w-[280px] aspect-square rounded-2xl overflow-hidden mb-8 shadow-sm bg-surface-container-low">
                <img className="w-full h-full object-cover" src={slide.image} alt="Onboarding" />
              </div>
              <div className="text-center w-full max-w-[320px]">
                <h2 className="font-headline-md text-headline-md text-primary mb-stack-sm tracking-tight whitespace-pre-line">
                  {slide.title}
                </h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant opacity-90">
                  {slide.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="w-full px-margin-mobile pb-10 pt-4 bg-gradient-to-t from-background via-background to-transparent relative z-10">
        <div className="flex justify-center items-center gap-2 mb-8">
          {slides.map((_, index) => (
            <div 
              key={index} 
              className={`dot h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'w-6 bg-primary' : 'w-2 bg-surface-variant'
              }`}
            />
          ))}
        </div>

        <Button 
          fullWidth 
          variant={currentSlide === slides.length - 1 ? 'secondary' : 'primary'}
          icon={currentSlide === slides.length - 1 ? 'check_circle' : 'arrow_forward'}
          onClick={handleNext}
        >
          {currentSlide === slides.length - 1 ? 'Bắt đầu ngay' : 'Tiếp tục'}
        </Button>
      </div>
    </main>
  );
}
