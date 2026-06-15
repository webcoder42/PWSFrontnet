import { useCallback, useEffect, useState } from 'react';
import {
  HiOutlineUserAdd,
  HiOutlineUsers,
  HiCheck,
  HiChevronRight,
  HiOutlineTrash,
  HiOutlineX,
  HiOutlineEye,
  HiOutlineEyeOff,
} from 'react-icons/hi';
import { clsx } from 'clsx';

import { useUser } from '../../context/UserContext';
import type { SessionUser } from '../../context/UserContext';
import {
  addSwitchAccountAPI,
  getSwitchAccountsAPI,
  removeSwitchAccountAPI,
} from '../../utils/api';
import {
  type SavedAccount,
  getActiveAccount,
  getAvatarUrl,
  getDashboardPathForRole,
  getLinkedAccountSession,
  getUserId,
  mapLinkedUsersToSavedAccounts,
  removeLinkedAccountSession,
  saveLinkedAccountSession,
} from '../../utils/linkedAccounts';
import { disconnectChatSocket } from '../../utils/chatSocket';
import { PENDING_CHAT_STORAGE_KEY } from '../../utils/chatPending';

interface SwitchAccountsPanelProps {
  onAfterSwitch?: (role: string) => void;
}

export default function SwitchAccountsPanel({ onAfterSwitch }: SwitchAccountsPanelProps) {
  const { rawUser, setUser } = useUser();

  const [otherAccounts, setOtherAccounts] = useState<SavedAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSwitching, setIsSwitching] = useState(false);
  const [isManageMode, setIsManageMode] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addError, setAddError] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const currentAccount = getActiveAccount(rawUser);
  const ownerId = getUserId(rawUser);

  const refreshAccounts = useCallback(async () => {
    // Remove legacy local list (accounts now come from database only)
    localStorage.removeItem('linked_accounts');

    if (!ownerId) {
      setOtherAccounts([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await getSwitchAccountsAPI(ownerId);
      const linked = Array.isArray(response?.data?.linkedAccounts)
        ? (response.data.linkedAccounts as SessionUser[])
        : [];
      setOtherAccounts(mapLinkedUsersToSavedAccounts(linked));
    } catch {
      setOtherAccounts([]);
    } finally {
      setIsLoading(false);
    }
  }, [ownerId]);

  useEffect(() => {
    void refreshAccounts();
  }, [refreshAccounts]);

  const navigateAfterSwitch = (role: string) => {
    if (onAfterSwitch) {
      onAfterSwitch(role);
      return;
    }
    window.location.href = getDashboardPathForRole(role);
  };

  const handleSwitchAccount = async (targetAccount: SavedAccount) => {
    if (isManageMode) return;

    const session =
      getLinkedAccountSession(targetAccount.id) || targetAccount.session;
    if (!session || !getUserId(session)) {
      setAddError('Please remove and re-add this account to switch.');
      return;
    }

    setIsSwitching(true);
    try {
      // Clear any pending chat intent — it belongs to the previous account
      // and would cause a "chat with yourself" error on the new account.
      sessionStorage.removeItem(PENDING_CHAT_STORAGE_KEY);

      // Disconnect the socket so the new account gets a fresh authenticated
      // connection instead of reusing the previous user's socket.
      disconnectChatSocket();

      setUser(session);

      // Use window.location.replace for a full reload — this resets all React
      // state AND removes switch-accounts from the browser history stack so
      // the back button never returns to the switch screen.
      const targetPath = getDashboardPathForRole(targetAccount.role);
      window.location.replace(targetPath);
    } finally {
      setTimeout(() => setIsSwitching(false), 400);
    }
  };

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newPassword || !ownerId) return;

    setAddError('');
    setIsAdding(true);

    try {
      const response = await addSwitchAccountAPI(ownerId, {
        email: newEmail.trim(),
        password: newPassword,
      });

      const user = response.data as SessionUser;
      saveLinkedAccountSession(user);
      await refreshAccounts();
      setNewEmail('');
      setNewPassword('');
      setIsAddModalOpen(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Could not add account.';
      setAddError(message);
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveAccount = async (linkedId: string) => {
    if (!ownerId) return;
    try {
      await removeSwitchAccountAPI(ownerId, linkedId);
      removeLinkedAccountSession(linkedId);
      await refreshAccounts();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Could not remove account.';
      setAddError(message);
    }
  };

  if (!currentAccount) {
    return (
      <p className="text-gray-500 font-medium text-center py-12">
        Please sign in to manage accounts.
      </p>
    );
  }

  return (
    <div className="relative">
      {isSwitching && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center rounded-2xl min-h-[200px]">
          <div className="flex flex-col items-center gap-4 text-center p-6">
            <div className="size-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-gray-900 font-bold font-dm text-sm">Switching account...</p>
          </div>
        </div>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 font-dm">Add Account</h3>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setAddError('');
                }}
                className="p-2 text-gray-400 hover:text-primary duration-300"
              >
                <HiOutlineX className="size-5 sm:size-6" />
              </button>
            </div>
            <form onSubmit={handleAddAccount} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
              {addError && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
                  {addError}
                </div>
              )}
              <div className="space-y-1">
                <label className="block text-xs sm:text-sm font-bold text-gray-700 ml-1">Email Address</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm font-dm focus:ring-2 focus:ring-primary/20 focus:bg-white duration-300"
                  required
                  disabled={isAdding}
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs sm:text-sm font-bold text-gray-700 ml-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm font-dm focus:ring-2 focus:ring-primary/20 focus:bg-white duration-300 pr-12"
                    required
                    disabled={isAdding}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-primary duration-300"
                  >
                    {showPassword ? (
                      <HiOutlineEyeOff className="size-5" />
                    ) : (
                      <HiOutlineEye className="size-5" />
                    )}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={isAdding}
                className="w-full bg-gradient-primary text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] duration-300 disabled:opacity-60"
              >
                {isAdding ? 'Verifying...' : 'Add Account'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="mb-8 sm:mb-10">
        <h4 className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 sm:mb-4 ml-1">
          Active Account
        </h4>
        <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-primary/20 shadow-lg shadow-primary/5 p-4 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="size-12 sm:size-14 rounded-full overflow-hidden border-2 border-primary/10 shrink-0 bg-primary/5">
              <img
                src={getAvatarUrl(currentAccount)}
                alt={currentAccount.name}
                className="size-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 font-dm truncate">
                {currentAccount.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 font-medium font-dm truncate">
                {currentAccount.email}
              </p>
            </div>
          </div>
          <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 ml-2">
            <HiCheck className="size-5" />
          </div>
        </div>
      </div>

      <div className="mb-8 sm:mb-10">
        <h4 className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 sm:mb-4 ml-1">
          Other Accounts
        </h4>
        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-400 font-medium text-sm border-b border-gray-50">
              Loading accounts...
            </div>
          ) : otherAccounts.length > 0 ? (
            otherAccounts.map((account) => (
              <div
                key={account.id}
                onClick={() => handleSwitchAccount(account)}
                className={clsx(
                  'p-4 sm:p-6 flex items-center justify-between duration-300 border-b border-gray-50 group',
                  isManageMode ? 'cursor-default' : 'cursor-pointer hover:bg-primary/[0.02]',
                )}
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div
                    className={clsx(
                      'size-10 sm:size-12 rounded-full overflow-hidden border-2 border-gray-100 shrink-0 bg-gray-50',
                      !isManageMode && 'grayscale-[0.5] group-hover:grayscale-0',
                    )}
                  >
                    <img
                      src={getAvatarUrl(account)}
                      alt={account.name}
                      className="size-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3
                      className={clsx(
                        'text-base font-bold text-gray-900 font-dm truncate',
                        !isManageMode && 'group-hover:text-primary',
                      )}
                    >
                      {account.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 font-medium font-dm truncate">
                      {account.email}
                    </p>
                  </div>
                </div>

                {isManageMode ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      void handleRemoveAccount(account.id);
                    }}
                    className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white duration-300 shrink-0 ml-2"
                  >
                    <HiOutlineTrash className="size-5" />
                  </button>
                ) : (
                  <div className="text-primary opacity-0 group-hover:opacity-100 duration-300 font-bold text-sm shrink-0 ml-2">
                    Switch
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-400 font-medium text-sm border-b border-gray-50">
              No other accounts added
            </div>
          )}

          <div
            onClick={() => {
              setAddError('');
              setIsAddModalOpen(true);
            }}
            className="p-4 sm:p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 duration-300 border-b border-gray-50 group"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="size-10 sm:size-12 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white duration-300 shrink-0">
                <HiOutlineUserAdd className="size-5 sm:size-6" />
              </div>
              <span className="text-sm sm:text-base font-bold text-gray-700 font-dm group-hover:text-primary duration-300">
                Add Account
              </span>
            </div>
            <HiChevronRight className="size-5 text-gray-300 group-hover:text-primary group-hover:translate-x-1 duration-300" />
          </div>

          <div
            onClick={() => setIsManageMode(!isManageMode)}
            className={clsx(
              'p-4 sm:p-6 flex items-center justify-between cursor-pointer duration-300 group',
              isManageMode ? 'bg-primary/5' : 'hover:bg-gray-50',
            )}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div
                className={clsx(
                  'size-10 sm:size-12 rounded-lg flex items-center justify-center duration-300 shrink-0',
                  isManageMode
                    ? 'bg-primary text-white'
                    : 'bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white',
                )}
              >
                <HiOutlineUsers className="size-5 sm:size-6" />
              </div>
              <span
                className={clsx(
                  'text-sm sm:text-base font-bold font-dm duration-300',
                  isManageMode ? 'text-primary' : 'text-gray-700 group-hover:text-primary',
                )}
              >
                {isManageMode ? 'Done Managing' : 'Manage Accounts'}
              </span>
            </div>
            {!isManageMode && (
              <HiChevronRight className="size-5 text-gray-300 group-hover:text-primary group-hover:translate-x-1 duration-300" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
