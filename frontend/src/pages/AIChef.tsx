import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AIChef() {
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const [messages, setMessages] = useState<{id: number, text: string, sender: 'ai' | 'user', time: string}[]>([
    {
      id: 1,
      text: 'Chào bạn! Tôi là NaviChef - trợ lý bếp ảo của bạn. Tôi thấy trong tủ lạnh bạn đang có **Súp lơ xanh**, **Thịt bò**, và **Trứng**. Bạn muốn tôi gợi ý món gì hôm nay?',
      sender: 'ai',
      time: '10:00'
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    // Add user message
    const userMsg = {
      id: Date.now(),
      text: text,
      sender: 'user' as const,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      const aiMsg = {
        id: Date.now() + 1,
        text: 'Tuyệt vời! Với súp lơ xanh và thịt bò, bạn có thể làm món **Thịt bò xào súp lơ**. Chỉ mất khoảng 15 phút thôi.\n\n**Nguyên liệu bổ sung cần có:**\n- Tỏi băm\n- Dầu hào, nước tương\n\nBạn có muốn tôi hướng dẫn chi tiết từng bước không?',
        sender: 'ai' as const,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1500);
  };

  const suggestions = [
    "Tôi chỉ có 15 phút",
    "Gợi ý món ăn ít calo",
    "Nấu món gì với thịt bò?",
    "Mẹo bảo quản rau lâu"
  ];

  return (
    <div className="bg-surface-container-lowest text-on-surface h-screen overflow-hidden flex flex-col font-body-md antialiased relative">
      {/* Header */}
      <header className="shrink-0 bg-surface dark:bg-surface-dim border-b border-outline-variant z-40 px-margin-mobile pt-safe-top h-nav-height flex items-center justify-between shadow-sm">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-surface-container-high transition-colors active:opacity-80">
          <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center overflow-hidden">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>robot_2</span>
          </div>
          <div>
            <h1 className="font-headline-sm text-headline-sm font-bold text-on-surface leading-tight">NaviChef</h1>
            <p className="font-label-sm text-label-sm text-primary flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Trực tuyến
            </p>
          </div>
        </div>
        <button className="p-2 -mr-2 rounded-full hover:bg-surface-container-high transition-colors active:opacity-80">
          <span className="material-symbols-outlined text-on-surface-variant">more_vert</span>
        </button>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto px-margin-mobile py-6 flex flex-col gap-4 bg-surface dark:bg-surface-dim">
        <div className="text-center font-label-sm text-label-sm text-on-surface-variant mb-4">Hôm nay</div>
        
        {messages.map(msg => (
          <div key={msg.id} className={`flex max-w-[85%] ${msg.sender === 'user' ? 'ml-auto justify-end' : 'mr-auto justify-start'}`}>
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center mr-2 flex-shrink-0 self-end mb-1">
                <span className="material-symbols-outlined text-on-primary-container text-[18px]">robot_2</span>
              </div>
            )}
            <div className="flex flex-col gap-1">
              <div className={`px-4 py-3 rounded-2xl shadow-sm ${msg.sender === 'user' ? 'bg-primary text-on-primary rounded-br-sm' : 'bg-surface-container-lowest border border-outline-variant/50 text-on-surface rounded-bl-sm'}`}>
                {/* Render text with basic markdown support (bold) */}
                <span className="whitespace-pre-wrap leading-relaxed">
                  {msg.text.split(/(\*\*.*?\*\*)/).map((part, i) => 
                    part.startsWith('**') && part.endsWith('**') 
                      ? <strong key={i} className="font-bold">{part.slice(2, -2)}</strong> 
                      : part
                  )}
                </span>
              </div>
              <span className={`font-label-sm text-[10px] text-on-surface-variant ${msg.sender === 'user' ? 'text-right' : 'text-left ml-1'}`}>
                {msg.time}
              </span>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex max-w-[85%] mr-auto justify-start">
            <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center mr-2 flex-shrink-0 self-end mb-1">
              <span className="material-symbols-outlined text-on-primary-container text-[18px]">robot_2</span>
            </div>
            <div className="px-4 py-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/50 rounded-bl-sm flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <div className="shrink-0 bg-surface-container-lowest border-t border-outline-variant pb-safe-bottom z-40">
        {/* Suggestion Chips */}
        <div className="flex overflow-x-auto gap-2 px-margin-mobile py-3 hide-scrollbar border-b border-outline-variant/30">
          {suggestions.map((suggestion, idx) => (
            <button 
              key={idx}
              onClick={() => handleSend(suggestion)}
              className="whitespace-nowrap px-4 py-1.5 rounded-full border border-primary/30 text-primary font-body-md text-sm bg-primary/5 hover:bg-primary/10 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* Input Field */}
        <div className="px-margin-mobile py-3 flex items-end gap-2">
          <button className="p-2 text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-container rounded-full flex-shrink-0">
            <span className="material-symbols-outlined">add_circle</span>
          </button>
          
          <div className="flex-1 bg-surface-container rounded-2xl border border-outline-variant focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all flex items-end min-h-[48px] px-4 py-2">
            <textarea 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(inputText);
                }
              }}
              placeholder="Hỏi NaviChef điều gì đó..."
              className="w-full bg-transparent border-none outline-none resize-none max-h-32 text-on-surface font-body-md py-1"
              rows={1}
              style={{ minHeight: '24px' }}
            />
            <button className="text-on-surface-variant hover:text-primary ml-2 py-1">
              <span className="material-symbols-outlined text-[20px]">mic</span>
            </button>
          </div>
          
          <button 
            onClick={() => handleSend(inputText)}
            disabled={!inputText.trim()}
            className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-colors shadow-sm ${inputText.trim() ? 'bg-primary text-on-primary hover:opacity-90 active:scale-95' : 'bg-surface-container-high text-on-surface-variant opacity-50'}`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
