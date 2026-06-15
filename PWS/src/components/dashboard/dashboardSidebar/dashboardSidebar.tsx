import React, { useState, useRef, useEffect } from 'react';

import { clsx } from 'clsx';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HiOutlineViewGrid,
  HiOutlineUserGroup,
  HiOutlineChatAlt2,
  HiOutlineAcademicCap,
  HiOutlineCog,
  HiOutlineClipboardList,
  HiOutlineLogout,
  HiSelector,
  HiOutlineUser
} from 'react-icons/hi';

import logo from '../../../assets/logo-dark.png';
import { useUser } from '../../../context/UserContext';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: HiOutlineViewGrid, path: '/dashboard' },
  { id: 'requests', label: 'Care Requests', icon: HiOutlineClipboardList, path: '/care-requests' },
  { id: 'clients', label: 'My Clients', icon: HiOutlineUserGroup, path: '/clients' },
  { id: 'messages', label: 'Messages', icon: HiOutlineChatAlt2, path: '/messages' },
  { id: 'learning', label: 'Learning Hub', icon: HiOutlineAcademicCap, path: '/learning-hub' },
  { id: 'settings', label: 'Settings', icon: HiOutlineCog, path: '/settings' },
];

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isOpen, onClose }) => {
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, clearUser } = useUser();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setShowAccountMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const accountOptions = [
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

  return (
    <>
      <div
        className={clsx(
          "fixed inset-0 bg-black/50 z-50 lg:hidden duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <div className={clsx(
        "fixed inset-y-0 left-0 w-72 bg-white border-r border-gray-100 flex flex-col shrink-0 z-50 duration-300 transform",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-8 flex items-center justify-between border-b border-b-gray-200">
          <Link to="/dashboard">
            <img src={logo} alt="myPSW+" className="h-8" />
          </Link>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-primary duration-300 lg:hidden"
          >
            <HiOutlineViewGrid className="size-6" />
          </button>
        </div>

        <nav className="flex-1 pt-3 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (

              <Link
                key={item.id}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={clsx(
                  "w-full flex items-center gap-4 px-6 py-4 rounded-xl sm:text-base text-sm font-medium font-inter duration-300 group",
                  isActive
                    ? "bg-gradient-purple text-white shadow-lg shadow-primary/20"
                    : "text-gray-800 hover:text-primary hover:bg-primary/5"
                )}
              >
                <item.icon className={clsx(
                  "sm:size-7 size-5 duration-300",
                  isActive ? "text-white" : "text-primary group-hover:text-primary"
                )} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-gray-200 relative" ref={accountRef}>
          <div className={clsx(
            "absolute bottom-full left-6 right-6 mb-4 bg-white rounded-2xl border border-gray-100 shadow-2xl shadow-black/5 p-3 origin-bottom duration-300 transform",
            showAccountMenu ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2 pointer-events-none"
          )}>
            <div className="space-y-1">
              {accountOptions.map((option) => (
                <button
                  key={option.label}
                  onClick={() => {
                    option.onClick();
                    setShowAccountMenu(false);
                  }}
                  className={clsx(
                    "w-full flex items-center gap-3 p-3 rounded-lg text-base font-medium font-dm duration-300",
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

          <div
            onClick={() => setShowAccountMenu(!showAccountMenu)}
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 duration-300 cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-full overflow-hidden border-2 border-primary/10 shadow-sm">
                {profile?.photoUrl ? (
                  <img
                    src={profile.photoUrl}
                    alt={profile.name || 'User'}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="size-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                    {profile?.initials || 'U'}
                  </div>
                )}
              </div>
              <div className="text-left">
                <p className="text-[15px] font-bold text-gray-900 font-dm leading-tight">{profile?.name || 'User'}</p>
                <p className="text-[13px] text-gray-400 font-medium font-dm mt-0.5">{profile?.email || 'No email available'}</p>
              </div>
            </div>
            <HiSelector className={clsx(
              "text-gray-400 size-5 duration-300",
              showAccountMenu && "rotate-180"
            )} />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardSidebar;
