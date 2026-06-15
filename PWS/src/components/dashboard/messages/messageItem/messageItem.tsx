import React from 'react';
import { clsx } from 'clsx';

interface MessageItemProps {
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  isActive?: boolean;
  onClick: () => void;
}

const MessageItem: React.FC<MessageItemProps> = ({
  name,
  avatar,
  lastMessage,
  time,
  unreadCount,
  isActive,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "flex items-center gap-4 p-4 rounded-xl cursor-pointer duration-300 group",
        isActive
          ? "bg-gradient-primary text-white shadow-lg shadow-primary/20"
          : "hover:bg-gray-50"
      )}
    >
      <div className="relative shrink-0">
        <div className="size-14 rounded-full overflow-hidden border-2 border-white shadow-sm">
          <img src={avatar} alt={name} className="size-full object-cover" />
        </div>
        <div className="absolute bottom-0 right-0 size-3.5 bg-green-500 border-2 border-white rounded-full" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className={clsx(
            "text-base font-bold font-dm truncate",
            isActive ? "text-white" : "text-gray-900"
          )}>
            {name}
          </h4>
          <span className={clsx(
            "text-[11px] font-medium font-dm",
            isActive ? "text-white/70" : "text-gray-400"
          )}>
            {time}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className={clsx(
            "text-[13px] font-medium font-dm truncate",
            isActive ? "text-white/80" : "text-gray-500"
          )}>
            {lastMessage}
          </p>
          {unreadCount && unreadCount > 0 && !isActive && (
            <div className="size-5 bg-primary rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0">
              {unreadCount}
            </div>
          )}
          {unreadCount && unreadCount > 0 && isActive && (
            <div className="size-5 bg-white rounded-full flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
              {unreadCount}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
