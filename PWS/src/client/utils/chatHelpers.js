const OBJECT_ID_HEX = /^[a-f0-9]{24}$/i;

export const normalizeUserId = (value) => {
  if (!value) return '';
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return OBJECT_ID_HEX.test(trimmed) ? trimmed : '';
  }
  if (typeof value === 'object' && value !== null) {
    if (value._id !== undefined) return normalizeUserId(value._id);
    if (typeof value.id === 'string') return normalizeUserId(value.id);
    if (typeof value.toString === 'function') {
      const asString = value.toString();
      if (OBJECT_ID_HEX.test(asString)) return asString;
    }
  }
  return '';
};

export const normalizeParticipant = (field) => {
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
  return { id: String(field || ''), name: 'User', photoUrl: '', role: '' };
};

export const getOtherParticipant = (conversation, myUserId) => {
  const client = normalizeParticipant(
    typeof conversation.clientId === 'object' ? conversation.clientId : { _id: conversation.clientId },
  );
  const isClient = normalizeUserId(myUserId) === normalizeUserId(client.id);
  const other = isClient ? conversation.pswId : conversation.clientId;
  return normalizeParticipant(typeof other === 'object' ? other : { _id: other });
};

export const formatMessageTime = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const formatConversationTime = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const diffMs = Date.now() - date.getTime();
  if (diffMs < 60_000) return 'Just now';
  if (diffMs < 3_600_000) return `${Math.floor(diffMs / 60_000)}m ago`;
  if (diffMs < 86_400_000) return `${Math.floor(diffMs / 3_600_000)}h ago`;
  if (diffMs < 604_800_000) return date.toLocaleDateString([], { weekday: 'short' });
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

export const avatarFallback = (name) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || 'user')}`;

export const appendMessageIfNew = (messages, incoming) => {
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

export const getLastMessagePreview = (conversation) => {
  const messages = Array.isArray(conversation?.messages) ? conversation.messages : [];
  const last = messages[messages.length - 1];
  return last?.text || 'No messages yet';
};

export const countUnreadMessages = (messages, myUserId) => {
  const me = normalizeUserId(myUserId);
  if (!me) return 0;
  return (Array.isArray(messages) ? messages : []).filter(
    (msg) => normalizeUserId(msg.senderId) !== me && msg.isRead !== true,
  ).length;
};
