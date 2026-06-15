export type PopulatedUser = {
  _id?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
  role?: string;
};

export type ChatParticipant = {
  id: string;
  name: string;
  photoUrl: string;
  role: string;
};

const OBJECT_ID_HEX = /^[a-f0-9]{24}$/i;

export const normalizeUserId = (value: unknown): string => {
  if (!value) return '';
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return OBJECT_ID_HEX.test(trimmed) ? trimmed : '';
  }
  if (typeof value === 'object' && value !== null) {
    const record = value as { _id?: unknown; id?: unknown; toString?: () => string };
    if (record._id !== undefined) return normalizeUserId(record._id);
    if (typeof record.id === 'string') return normalizeUserId(record.id);
    if (typeof record.toString === 'function') {
      const asString = record.toString();
      if (OBJECT_ID_HEX.test(asString)) return asString;
    }
  }
  return '';
};

export const getUserId = (user?: { _id?: unknown; id?: unknown } | null): string =>
  normalizeUserId(user?._id) || normalizeUserId(user?.id) || '';

export const normalizeParticipant = (field: PopulatedUser | string | null | undefined): ChatParticipant => {
  if (field && typeof field === 'object') {
    const first = field.firstName || '';
    const last = field.lastName || '';
    const name = [first, last].filter(Boolean).join(' ') || 'User';
    return {
      id: String(field._id || field.id || ''),
      name,
      photoUrl: field.photoUrl || '',
      role: field.role || '',
    };
  }
  return {
    id: String(field || ''),
    name: 'User',
    photoUrl: '',
    role: '',
  };
};

export const getOtherParticipant = (
  conversation: {
    clientId: PopulatedUser | string;
    pswId: PopulatedUser | string;
  },
  myUserId: string,
): ChatParticipant => {
  const clientId = normalizeParticipant(
    typeof conversation.clientId === 'object' ? conversation.clientId : { _id: conversation.clientId },
  ).id;
  const isClient = normalizeUserId(myUserId) === normalizeUserId(clientId);
  const other = isClient ? conversation.pswId : conversation.clientId;
  return normalizeParticipant(typeof other === 'object' ? other : { _id: other });
};

export const formatMessageTime = (value?: string | Date): string => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const formatConversationTime = (value?: string | Date): string => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  if (diffMs < 60_000) return 'Just now';
  if (diffMs < 3_600_000) return `${Math.floor(diffMs / 60_000)}m ago`;
  if (diffMs < 86_400_000) return `${Math.floor(diffMs / 3_600_000)}h ago`;
  if (diffMs < 604_800_000) return date.toLocaleDateString([], { weekday: 'short' });
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

export const avatarFallback = (name: string): string =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || 'user')}`;

/** Unread = from the other user and not yet read. */
export const countUnreadMessages = (messages: unknown[], myUserId: string): number => {
  const me = normalizeUserId(myUserId);
  if (!me) return 0;
  return (Array.isArray(messages) ? messages : []).filter((msg: { senderId?: unknown; isRead?: boolean }) => {
    return normalizeUserId(msg.senderId) !== me && msg.isRead !== true;
  }).length;
};

export const mapMessageReadStatus = (isRead: boolean | undefined): 'sent' | 'read' =>
  isRead === true ? 'read' : 'sent';

export const appendMessageIfNew = <T extends { _id?: unknown; sentAt?: unknown; text?: unknown }>(
  messages: T[],
  incoming: T,
): T[] => {
  const incomingId = normalizeUserId(incoming?._id);
  if (incomingId && messages.some((m) => normalizeUserId(m._id) === incomingId)) {
    return messages;
  }
  const fallbackKey = `${String(incoming?.sentAt || '')}-${incoming?.text || ''}`;
  if (
    messages.some(
      (m) => !normalizeUserId(m._id) && `${String(m.sentAt || '')}-${m.text || ''}` === fallbackKey,
    )
  ) {
    return messages;
  }
  return [...messages, incoming];
};
