import React, { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import {
  HiOutlineInformationCircle,
  HiOutlinePlus,
  HiOutlineEmojiHappy,
  HiPaperAirplane,
  HiArrowLeft
} from 'react-icons/hi';
import MessageBubble from '../messageBubble/messageBubble';
import ECallButton from '../eCallButton/eCallButton';

interface Message {
  id: string;
  text: string;
  time: string;
  type: 'incoming' | 'outgoing';
  status?: 'sent' | 'delivered' | 'read';
}

interface ChatWindowProps {
  activeChat: {
    id: string;
    name: string;
    avatar: string;
    status: string;
  } | null;
  messages: Message[];
  onSendMessage: (text: string) => void;
  onBack?: () => void;
  onStartCall?: () => void;
  messagesEndRef?: React.RefObject<HTMLDivElement | null>;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  activeChat,
  messages,
  onSendMessage,
  onBack,
  onStartCall,
  messagesEndRef: externalEndRef,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const internalEndRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = externalEndRef || internalEndRef;

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior,
      });
    }
  };

  useEffect(() => {
    scrollToBottom('auto');
  }, [activeChat?.id]);

  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  if (!activeChat) {
    return (
      <div className="h-full bg-white flex flex-col items-center justify-center text-center p-6 lg:p-12">
        <div className="size-16 lg:size-24 rounded-full bg-primary/5 flex items-center justify-center text-primary mb-6">
          <HiPaperAirplane className="size-8 lg:size-10 rotate-45" />
        </div>
        <h3 className="text-xl lg:text-2xl font-bold text-gray-900 font-playfair mb-3">Your Messages</h3>
        <p className="text-gray-500 font-medium font-dm text-sm lg:text-base">
          Select a conversation from the left to start chatting with your clients or support.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0 bg-white overflow-hidden relative">
      {/* Header */}
      <div className="shrink-0 px-4 lg:px-8 py-3 lg:py-4 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-2 lg:gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="md:hidden p-2 -ml-2 text-gray-500 hover:text-primary duration-300"
            >
              <HiArrowLeft className="size-6" />
            </button>
          )}
          <div className="size-10 lg:size-12 rounded-full border border-primary/10 relative shrink-0">
            <img src={activeChat.avatar} alt={activeChat.name} className="rounded-full size-full object-cover" />
            <div className="absolute bottom-0 right-0 size-2.5 lg:size-3 bg-green-500 border-2 border-white rounded-full" />
          </div>
          <div className="min-w-0">
            <h3 className="text-[14px] lg:text-[16px] font-bold text-gray-900 font-dm leading-tight truncate">
              {activeChat.name}
            </h3>
            <p className="text-[11px] lg:text-[12px] text-green-500 font-medium font-dm mt-0.5">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ECallButton onClick={onStartCall} disabled={!activeChat?.id} />
          <button className="p-2 lg:p-2.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-full duration-300">
            <HiOutlineInformationCircle className="size-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 min-h-0 overflow-y-auto p-4 lg:p-6 custom-scrollbar relative chat-doodle-bg"
      >
        <div className="flex flex-col relative z-10">
          <div className="flex items-center justify-center my-6">
            <span className="px-3 py-1 text-[10px] lg:text-[11px] font-bold text-gray-500 bg-white/80 rounded-lg shadow-sm uppercase tracking-wider">
              Today
            </span>
          </div>

          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              text={msg.text}
              time={msg.time}
              type={msg.type}
              status={msg.status}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Footer / WhatsApp Style Input */}
      <div className="shrink-0 px-3 lg:px-4 py-3 lg:py-4 bg-chat-bg border-t border-gray-100 z-10">
        <div className="flex items-center gap-2 lg:gap-3">
          <div className="flex items-center">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={clsx(
                "p-2 duration-300",
                showEmojiPicker ? "text-primary scale-110" : "text-gray-500 hover:text-primary"
              )}
            >
              <HiOutlineEmojiHappy className="size-6" />
            </button>
          </div>

          <div className="flex-1">
            <input
              type="text"
              placeholder="Type a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="w-full bg-white border-none rounded-full py-2 lg:py-2.5 px-4 lg:px-5 text-[14px] lg:text-[15px] font-dm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
            />
          </div>

          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className={clsx(
              "size-10 lg:size-11 rounded-full flex items-center justify-center duration-300 shadow-md shrink-0",
              inputValue.trim()
                ? "bg-primary text-white hover:scale-105 active:scale-95"
                : "bg-gray-300 text-white cursor-not-allowed"
            )}
          >
            <HiPaperAirplane className="size-5 rotate-45 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
