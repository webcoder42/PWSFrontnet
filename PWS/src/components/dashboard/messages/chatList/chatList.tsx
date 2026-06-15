import React from 'react';
import { HiOutlineSearch } from 'react-icons/hi';
import MessageItem from '../messageItem/messageItem';

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
}

interface ChatListProps {
  conversations: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({
  conversations,
  activeId,
  onSelect,
  searchQuery,
  onSearchChange
}) => {
  return (
    <div className="flex flex-col h-full bg-white border border-gray-100 shadow-logs overflow-hidden">
      <div className="p-6 pb-2">
        <div className="relative group">
          <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400 group-focus-within:text-primary duration-300" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-surface-vibrant border-none rounded-xl py-4 pl-12 pr-4 text-[14px] font-medium font-dm focus:outline-none focus:ring-2 focus:ring-primary/20 duration-300"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
        {conversations.length > 0 ? (
          conversations.map((chat) => (
            <MessageItem
              key={chat.id}
              name={chat.name}
              avatar={chat.avatar}
              lastMessage={chat.lastMessage}
              time={chat.time}
              unreadCount={chat.unreadCount}
              isActive={activeId === chat.id}
              onClick={() => onSelect(chat.id)}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <p className="text-gray-400 font-medium font-dm">No conversations found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
