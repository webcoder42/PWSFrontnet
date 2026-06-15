import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  HiOutlineSearch,
  HiOutlineBell,
  HiOutlineMenuAlt2,
  HiOutlineUser,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineHome,
  HiOutlineClipboardList,
  HiOutlineUsers,
  HiOutlineChat,
  HiOutlineSwitchHorizontal,
  HiOutlineCreditCard,
  HiOutlineLockClosed,
  HiOutlineDatabase,
  HiOutlineInformationCircle,
  HiOutlineAdjustments,
  HiOutlineMap,
  HiOutlineCalendar,
  HiOutlineStar,
  HiOutlineHeart,
  HiOutlineUserGroup,
  HiOutlineTranslate,
  HiOutlineBadgeCheck,
  HiChevronRight
} from 'react-icons/hi';
import { clsx } from 'clsx';
import { useUser } from '../../../context/UserContext';
import { useNotificationCenter } from '../../../context/NotificationCenterContext';

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onMenuClick }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, clearUser } = useUser();
  const { notifications, unreadCount, markRead, markAllRead, removeNotification } = useNotificationCenter();

  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const searchableItems = [
    { title: 'Dashboard', path: '/dashboard', category: 'Main Navigation', icon: HiOutlineHome },
    { title: 'Care Requests', path: '/care-requests', category: 'Patient Management', icon: HiOutlineClipboardList },
    { title: 'My Clients', path: '/clients', category: 'Patient Management', icon: HiOutlineUsers },
    { title: 'Messages', path: '/messages', category: 'Communication', icon: HiOutlineChat },
    { title: 'Account Settings', path: '/settings', category: 'Account', icon: HiOutlineCog },
    { title: 'Switch Accounts', path: '/settings/switch-accounts', category: 'Account', icon: HiOutlineSwitchHorizontal },
    { title: 'Profile Information', path: '/settings/profile', category: 'Account', icon: HiOutlineUser },
    { title: 'Notification Preferences', path: '/settings/notifications', category: 'Preferences', icon: HiOutlineBell },
    { title: 'Billing & Payment', path: '/settings/billing', category: 'Financial', icon: HiOutlineCreditCard },
    { title: 'Security Settings', path: '/settings/security', category: 'Security', icon: HiOutlineLockClosed },
    { title: 'Data & Privacy', path: '/settings/data', category: 'Security', icon: HiOutlineDatabase },
    { title: 'About myPSW+', path: '/settings/about', category: 'Support', icon: HiOutlineInformationCircle },
    { title: 'General Preferences', path: '/settings/preferences', category: 'Preferences', icon: HiOutlineAdjustments },
    { title: 'Service Area', path: '/settings/preferences/service-area', category: 'Preferences -> Region', icon: HiOutlineMap },
    { title: 'Schedule & Availability', path: '/settings/preferences/availability', category: 'Preferences -> Schedule', icon: HiOutlineCalendar },
    { title: 'Care Expertise', path: '/settings/preferences/care-expertise', category: 'Preferences -> Skills', icon: HiOutlineStar },
    { title: 'Care Services', path: '/settings/preferences/care-services', category: 'Preferences -> Skills', icon: HiOutlineHeart },
    { title: 'Gender Preferences', path: '/settings/preferences/patient-gender', category: 'Preferences -> Matches', icon: HiOutlineUserGroup },
    { title: 'Language & Communication', path: '/settings/preferences/language', category: 'Preferences -> Language', icon: HiOutlineTranslate },
    { title: 'Certifications', path: '/settings/preferences/certifications', category: 'Preferences -> Credentials', icon: HiOutlineBadgeCheck },
  ];

  const filteredItems = searchableItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPageTitle = (pathname: string) => {
    if (pathname === '/dashboard') return 'Dashboard';
    if (pathname === '/care-requests') return 'Care Requests';
    if (pathname === '/clients') return 'My Clients';
    if (pathname === '/messages') return 'Messages';
    if (pathname.startsWith('/settings')) {
      if (pathname === '/settings') return 'Settings';
      if (pathname.includes('/preferences')) {
        if (pathname === '/settings/preferences') return 'Preferences';
        if (pathname.includes('service-area')) return 'Service Area';
        if (pathname.includes('availability')) return 'Schedule & Availability';
        if (pathname.includes('care-expertise')) return 'Care Expertise';
        if (pathname.includes('care-services')) return 'Care Services';
        if (pathname.includes('patient-gender')) return 'Gender Preferences';
        if (pathname.includes('language')) return 'Language & Communication';
        if (pathname.includes('certifications')) return 'Certifications & Qualifications';
      }
      if (pathname.includes('switch-accounts')) return 'Switch Accounts';
      if (pathname.includes('profile')) return 'Profile Settings';
      if (pathname.includes('notifications')) return 'Notifications';
      if (pathname.includes('billing')) return 'Billing & Payment';
      if (pathname.includes('security')) return 'Security';
      if (pathname.includes('data')) return 'Data Settings';
      if (pathname.includes('about')) return 'About';
    }
    return 'Dashboard';
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const profileOptions = [
    { label: 'My Profile', icon: HiOutlineUser, onClick: () => navigate('/settings/profile') },
    { label: 'Settings', icon: HiOutlineCog, onClick: () => navigate('/settings') },
    { 
      label: 'Log Out', 
      icon: HiOutlineLogout, 
      onClick: () => {
        clearUser();
        navigate('/login');
      }, 
      variant: 'danger' 
    },
  ];
  const unreadNotifications = notifications.filter((item) => !item.read);

  const formatAgo = (iso: string) => {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '';
    const diff = Date.now() - date.getTime();
    if (diff < 60_000) return 'Just now';
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <header className="sticky top-0 h-20 lg:h-24 flex items-center justify-between px-6 lg:px-10 bg-white z-40 border-b border-gray-200">
      <div className={clsx(
        "flex items-center gap-4 transition-all duration-300",
        isMobileSearchOpen ? "opacity-0 invisible w-0 overflow-hidden" : "opacity-100 visible flex-1"
      )}>
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-500 hover:text-primary duration-300"
        >
          <HiOutlineMenuAlt2 className="size-7" />
        </button>
        <div className="min-w-0">
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 font-playfair flex items-center gap-2 truncate">
            <span className="md:hidden">{getPageTitle(location.pathname)}</span>
            <span className="hidden md:flex items-center gap-2">
              Hi, {profile?.name || 'User'} <span className="text-xl lg:text-2xl">👋</span>
            </span>
          </h1>
          <p className="hidden md:block text-xs lg:text-sm text-gray-400 font-medium font-dm mt-0.5 lg:mt-1">Good morning</p>
        </div>
      </div>

      <div className={clsx(
        "flex items-center gap-3 lg:gap-8 transition-all duration-300",
        isMobileSearchOpen ? "flex-1" : ""
      )}>
        <div className={clsx(
          "relative transition-all duration-300",
          isMobileSearchOpen ? "flex-1" : "hidden md:block w-64 lg:w-96"
        )} ref={searchRef}>
          <div className="relative group flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                autoFocus={isMobileSearchOpen}
                placeholder="Search settings, pages..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                className="w-full h-11 lg:h-14 bg-gray-50 border border-border-soft rounded-xl pl-11 pr-4 outline-none focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 duration-300 font-dm text-sm font-medium shadow-sm group-hover:bg-white group-hover:border-gray-200"
              />
              <HiOutlineSearch className={clsx(
                "absolute left-4 top-1/2 -translate-y-1/2 duration-300 size-5 lg:size-6",
                searchQuery ? "text-primary" : "text-gray-400"
              )} />
            </div>
            
            {isMobileSearchOpen && (
              <button 
                onClick={() => {
                  setIsMobileSearchOpen(false);
                  setSearchQuery('');
                }}
                className="md:hidden p-2 text-primary font-bold font-dm text-sm whitespace-nowrap"
              >
                Cancel
              </button>
            )}
          </div>

          {showSearchResults && searchQuery.trim().length > 0 && filteredItems.length > 0 && (
            <div className={clsx(
              "absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-2xl shadow-black/10 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-300 ring-1 ring-black/5",
              isMobileSearchOpen ? "fixed top-20 left-4 right-4" : "absolute"
            )}>
              <div className="p-2 max-h-[60vh] md:max-h-[480px] overflow-y-auto custom-scrollbar">
                <div className="px-3 py-2 mb-2">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Search Results ({filteredItems.length})</p>
                </div>
                <div className="space-y-1">
                  {filteredItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        navigate(item.path);
                        setSearchQuery('');
                        setShowSearchResults(false);
                        setIsMobileSearchOpen(false);
                      }}
                      className="w-full text-left p-3 rounded-xl hover:bg-primary/5 group duration-300 flex items-center gap-4 transition-all"
                    >
                      <div className="size-10 rounded-lg bg-gray-50 text-gray-400 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-primary duration-300 shadow-sm border border-transparent group-hover:border-primary/10">
                        <item.icon className="size-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[15px] font-bold text-gray-900 font-dm group-hover:text-primary duration-300 truncate">{item.title}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <p className="text-[11px] text-gray-400 font-bold font-dm uppercase tracking-widest">{item.category}</p>
                        </div>
                      </div>
                      <HiChevronRight className="size-4 text-gray-300 group-hover:text-primary duration-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {!isMobileSearchOpen && (
          <>
            <button
              onClick={() => setIsMobileSearchOpen(true)}
              className="md:hidden size-10 flex items-center justify-center text-gray-400 hover:text-primary duration-300"
            >
              <HiOutlineSearch className="size-6" />
            </button>

            <div className="flex items-center gap-3 lg:gap-8">
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={clsx(
                    "size-10 lg:size-12 flex items-center justify-center relative rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300",
                    showNotifications ? "text-primary border-primary/20 shadow-md" : "text-gray-400 hover:text-primary hover:border-gray-200"
                  )}
                >
                  <HiOutlineBell className="size-6 lg:size-7" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 min-w-4 lg:min-w-5 h-4 lg:h-5 px-1 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] lg:text-[10px] font-bold text-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                <div className={clsx(
                  "absolute top-full right-0 mt-4 w-72 sm:w-84 bg-white rounded-2xl border border-gray-100 shadow-2xl shadow-black/5 p-4 origin-top duration-300 transform z-50",
                  showNotifications ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                )}>
                  <div className="flex items-center justify-between mb-4 px-2">
                    <h4 className="text-md font-bold text-gray-900 font-dm">Notifications</h4>
                    <button onClick={markAllRead} className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/5 px-2 py-1 rounded-md">
                      Mark all read
                    </button>
                  </div>
                  <div className="space-y-1">
                    {unreadNotifications.length === 0 ? (
                      <p className="px-3 py-8 text-sm text-gray-400 text-center font-dm">No new notifications</p>
                    ) : unreadNotifications.slice(0, 20).map((item) => (
                      <div key={item.id} className="px-3 py-4 border-b border-gray-50 hover:bg-gray-50 duration-300 group">
                        <div className="flex gap-3">
                          <div className="size-10 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                            <HiOutlineBell className="size-5 text-primary" />
                          </div>
                          <button
                            className="text-left flex-1"
                            onClick={() => {
                              markRead(item.id);
                              setShowNotifications(false);
                              if (item.type === 'chat_message') navigate('/messages');
                              if (item.type === 'appointment_update') navigate('/care-requests');
                            }}
                          >
                            <p className="text-sm font-bold text-gray-900 font-dm">{item.title}</p>
                            <p className="text-xs text-gray-400 font-medium font-dm mt-0.5">{item.body}</p>
                            <p className="text-[10px] text-gray-300 font-bold mt-1">{formatAgo(item.createdAt)}</p>
                          </button>
                          <button className="text-[10px] text-gray-400 font-bold" onClick={() => removeNotification(item.id)}>
                            Dismiss
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 py-3 text-sm font-bold text-primary hover:bg-primary/5 rounded-md duration-300" onClick={markAllRead}>
                    Mark all as read
                  </button>
                </div>
              </div>

            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 p-1 rounded-full hover:bg-gray-50 duration-300"
              >
                <div className="size-10 lg:size-14 rounded-full overflow-hidden border-2 border-primary/10 shrink-0">
                  {profile?.photoUrl ? (
                    <img
                      src={profile.photoUrl}
                      alt={profile.name || 'User'}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="size-full bg-primary text-white flex items-center justify-center font-bold text-sm lg:text-base">
                      {profile?.initials || 'U'}
                    </div>
                  )}
                </div>
              </button>

              <div className={clsx(
                "absolute top-full right-0 mt-4 w-64 bg-white rounded-2xl border border-gray-100 shadow-2xl shadow-black/5 p-4 origin-top duration-300 transform z-50",
                showProfileMenu ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
              )}>
                <div className="p-3 mb-2 border-b border-gray-50">
                  <p className="text-base font-bold text-gray-900 font-dm">{profile?.name || 'User'}</p>
                  <p className="text-sm text-gray-400 font-medium font-dm">{profile?.email || 'No email available'}</p>
                </div>
                <div className="space-y-1">
                  {profileOptions.map((option) => (
                    <button
                      key={option.label}
                      onClick={() => {
                        option.onClick();
                        setShowProfileMenu(false);
                      }}
                      className={clsx(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium font-dm duration-300",
                        option.variant === 'danger'
                          ? "text-red-500 hover:bg-red-50"
                          : "text-gray-700 hover:bg-gray-50 hover:text-primary"
                      )}
                    >
                      <option.icon className="size-5" />
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  </header>
  );
};

export default DashboardHeader;
