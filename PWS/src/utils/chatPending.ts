export const PENDING_CHAT_STORAGE_KEY = 'pws_pending_chat';

export type PendingChatTarget = {
  otherUserId: string;
  peerName?: string;
  peerPhoto?: string;
};

export function savePendingChat(target: PendingChatTarget): void {
  sessionStorage.setItem(PENDING_CHAT_STORAGE_KEY, JSON.stringify(target));
}

export function consumePendingChat(): PendingChatTarget | null {
  try {
    const raw = sessionStorage.getItem(PENDING_CHAT_STORAGE_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(PENDING_CHAT_STORAGE_KEY);
    const parsed = JSON.parse(raw) as PendingChatTarget;
    if (!parsed?.otherUserId) return null;
    return parsed;
  } catch {
    sessionStorage.removeItem(PENDING_CHAT_STORAGE_KEY);
    return null;
  }
}
