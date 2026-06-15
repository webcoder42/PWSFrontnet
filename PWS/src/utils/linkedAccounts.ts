import { decryptData, encryptData } from './security';
import type { SessionUser } from '../context/UserContext';

/** Local cache of verified sessions for switching (keyed by user id). */
export const LINKED_SESSIONS_KEY = 'linked_account_sessions';

export interface SavedAccount {
  id: string;
  email: string;
  name: string;
  photoUrl: string;
  role: string;
  initials: string;
  session: SessionUser;
}

function getString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function getUserId(user: SessionUser | null | undefined): string {
  if (!user) return '';
  return getString(user._id) || getString(user.id);
}

function getUserName(user: SessionUser): string {
  const direct =
    getString(user.name) || getString(user.fullName) || getString(user.displayName);
  if (direct) return direct;
  const firstName = getString(user.firstName);
  const lastName = getString(user.lastName);
  return `${firstName} ${lastName}`.trim() || 'User';
}

function getInitials(name: string): string {
  const parts = name.split(' ').map((part) => part.trim()).filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return `${parts[0].slice(0, 1)}${parts[1].slice(0, 1)}`.toUpperCase();
}

export function sessionToSavedAccount(user: SessionUser): SavedAccount {
  const name = getUserName(user);
  const id = getUserId(user);
  const email = getString(user.email);
  const photoUrl =
    getString(user.photoUrl) ||
    getString(user.profilePhoto) ||
    getString(user.avatar) ||
    getString(user.image);

  return {
    id,
    email,
    name,
    photoUrl,
    role: getString(user.role),
    initials: getInitials(name),
    session: user,
  };
}

export function getAvatarUrl(account: SavedAccount): string {
  if (account.photoUrl) return account.photoUrl;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(account.name)}&background=7327C2&color=fff`;
}

function loadSessionMap(): Record<string, SessionUser> {
  try {
    const stored = localStorage.getItem(LINKED_SESSIONS_KEY);
    const parsed = decryptData(stored);
    if (!parsed || typeof parsed !== 'object') return {};
    return parsed as Record<string, SessionUser>;
  } catch {
    return {};
  }
}

function saveSessionMap(map: Record<string, SessionUser>): void {
  localStorage.setItem(LINKED_SESSIONS_KEY, encryptData(map));
}

export function saveLinkedAccountSession(user: SessionUser): void {
  const id = getUserId(user);
  if (!id) return;
  const map = loadSessionMap();
  map[id] = user;
  saveSessionMap(map);
}

export function getLinkedAccountSession(userId: string): SessionUser | null {
  const map = loadSessionMap();
  const session = map[userId];
  return session && typeof session === 'object' ? session : null;
}

export function removeLinkedAccountSession(userId: string): void {
  const map = loadSessionMap();
  delete map[userId];
  saveSessionMap(map);
}

/** Map API linked users to SavedAccount (session from local cache when available). */
export function mapLinkedUsersToSavedAccounts(users: SessionUser[]): SavedAccount[] {
  return users
    .map((user) => {
      const id = getUserId(user);
      const session = getLinkedAccountSession(id) || user;
      return sessionToSavedAccount(session);
    })
    .filter((account) => !!account.id);
}

export function getDashboardPathForRole(role: string): string {
  if (role === 'admin') return '/admin';
  if (role === 'looking_for_care') return '/patient';
  if (role === 'care_provider') return '/dashboard';
  return '/dashboard';
}

const ROLE_PATH_PREFIXES: Record<string, string[]> = {
  admin: ['/admin'],
  looking_for_care: ['/patient'],
  care_provider: ['/dashboard', '/care-requests', '/clients', '/messages', '/settings'],
};

/** Prefer the page the user was on (e.g. after refresh) when it matches their role. */
export function getRedirectPathForRole(role: string, fromPath?: string): string {
  const fallback = getDashboardPathForRole(role);
  if (!fromPath) return fallback;

  const prefixes = ROLE_PATH_PREFIXES[role];
  if (!prefixes) return fallback;

  const allowed = prefixes.some(
    (prefix) => fromPath === prefix || fromPath.startsWith(`${prefix}/`),
  );
  return allowed ? fromPath : fallback;
}

export function getActiveAccount(activeUser: SessionUser | null): SavedAccount | null {
  if (!activeUser) return null;
  return sessionToSavedAccount(activeUser);
}
