import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Sparkles, Loader2, Info, Search } from 'lucide-react';
import { ChatMessage } from '../types';
import { handleUserQuery } from '../services/listingSearchService';

export const AIAdvisor: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "안녕하세요! 🏠 **어디살래** 스마트 매물검색입니다.\n\n서울 지역 **33,309건**의 매물 데이터를 보유하고 있습니다.\n\n**검색 예시:**\n- \"강남구 10억대 아파트\"\n- \"마포구 전세 5억 이하\"\n- \"역삼동 매매 아파트\"\n- \"송파구 오피스텔\"\n\n원하시는 조건을 입력해주세요!",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // 로컬 매물 검색 서비스 사용
      const responseText = await handleUserQuery(userMessage.text);

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "서버 연결에 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.",
        timestamp: new Date(),
        isError: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-4rem)] flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-[80vh] border border-slate-200">
        
        {/* Chat Header */}
        <div className="bg-primary px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Search className="text-yellow-300" size={24} />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">스마트 매물검색</h2>
              <p className="text-indigo-200 text-xs">서울 33,309건 매물 데이터</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-indigo-200 text-sm bg-white/10 px-3 py-1 rounded-full">
            <Info size={14} />
            <span>지역, 가격, 건물유형으로 검색하세요</span>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[85%] sm:max-w-[75%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  msg.role === 'user' 
                    ? 'bg-slate-200 text-slate-600' 
                    : 'bg-primary text-white'
                }`}>
                  {msg.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
                </div>

                {/* Bubble */}
                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-primary text-white rounded-tr-none'
                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                }`}>
                   <p className="whitespace-pre-wrap">{msg.text}</p>
                   {msg.role === 'model' && !msg.isError && (
                     <div className="mt-2 text-xs text-slate-400 flex items-center gap-1">
                        어디살래 스마트검색
                     </div>
                   )}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex w-full justify-start">
              <div className="flex max-w-[75%] gap-3">
                 <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                    <Sparkles size={16} />
                 </div>
                 <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-2">
                    <Loader2 className="animate-spin text-primary" size={16} />
                    <span className="text-sm text-slate-500">매물을 검색하고 있습니다...</span>
                 </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100">
          <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="예: 양재동 10억대 아파트, 강남구 전세 5억 이하..."
              className="w-full pl-4 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-700 placeholder:text-slate-400"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="absolute right-2 p-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send size={20} />
            </button>
          </form>
          <p className="text-center text-xs text-slate-400 mt-2">
            AI는 실수를 할 수 있습니다. 중요한 정보는 확인이 필요합니다.
          </p>
        </div>
      </div>
    </div>
  );
};