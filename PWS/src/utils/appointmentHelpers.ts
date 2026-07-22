export type AppointmentCategory = 'Today' | 'Upcoming' | 'History';
export type DisplayStatus = 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'COMPLETED';

const AVATAR_COLORS = [
  'bg-purple-100 text-purple-600',
  'bg-pink-100 text-pink-600',
  'bg-green-100 text-green-600',
  'bg-blue-100 text-blue-600',
  'bg-orange-100 text-orange-600',
];

export function getLoggedInUserId(
  rawUser?: { _id?: string; id?: string } | null,
  profile?: { id?: string } | null,
): string | null {
  const id = rawUser?._id || rawUser?.id || profile?.id;
  if (!id || typeof id !== 'string' || id.length !== 24) return null;
  return id;
}

export function getPatientName(userId: unknown): string {
  if (!userId || typeof userId !== 'object') return 'Client';
  const u = userId as Record<string, unknown>;
  const first = typeof u.firstName === 'string' ? u.firstName.trim() : '';
  const last = typeof u.lastName === 'string' ? u.lastName.trim() : '';
  const combined = `${first} ${last}`.trim();
  if (combined) return combined;
  const name = typeof u.name === 'string' ? u.name.trim() : '';
  return name || 'Client';
}

export function getPatientPhoto(userId: unknown): string | undefined {
  if (!userId || typeof userId !== 'object') return undefined;
  const u = userId as Record<string, unknown>;
  const photo = typeof u.photoUrl === 'string' ? u.photoUrl.trim() : '';
  return photo || undefined;
}

export function getInitials(name: string): string {
  const parts = name.split(' ').map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0) return 'C';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function parseAppointmentDate(appt: {
  appointmentDate?: string | Date;
  date?: string;
  year?: number;
}): Date {
  if (appt.appointmentDate) {
    const d = new Date(appt.appointmentDate);
    if (!Number.isNaN(d.getTime())) return d;
  }
  const raw = appt.date || '';
  const lower = raw.toLowerCase();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (lower.includes('today')) return today;
  if (lower.includes('tomorrow')) {
    const t = new Date(today);
    t.setDate(t.getDate() + 1);
    return t;
  }
  const parsed = Date.parse(raw);
  if (!Number.isNaN(parsed)) return new Date(parsed);
  return new Date(0);
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function formatDisplayDate(appt: {
  appointmentDate?: string | Date;
  date?: string;
}): string {
  const d = parseAppointmentDate(appt);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (isSameDay(d, today)) return 'Today';
  if (isSameDay(d, tomorrow)) return 'Tomorrow';
  if (appt.date && !appt.date.toLowerCase().includes('today')) {
    const weekdayMonth = appt.date.match(/^[A-Za-z]+,\s*([A-Za-z]+\s+\d{1,2})/);
    if (weekdayMonth) return weekdayMonth[1];
  }
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: d.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
  });
}

export function formatAppointmentTime(time: string, duration?: string): string {
  if (!time) return 'Time pending';
  const lower = time.toLowerCase().trim();
  if (lower === 'morning') return '09:00 AM – 12:00 PM';
  if (lower === 'afternoon') return '12:00 PM – 06:00 PM';
  if (lower === 'evening') return '06:00 PM – 12:00 AM';
  if (duration && !time.includes('–') && !time.includes('-')) {
    return `${time} (${duration})`;
  }
  return time;
}

export type ApiAppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export function toDisplayStatus(status?: string): DisplayStatus {
  const s = (status || 'pending').toLowerCase();
  if (s === 'confirmed') return 'CONFIRMED';
  if (s === 'cancelled') return 'CANCELLED';
  if (s === 'completed') return 'COMPLETED';
  return 'PENDING';
}

export function toApiStatus(status: DisplayStatus): ApiAppointmentStatus {
  return status.toLowerCase() as ApiAppointmentStatus;
}

/** Pending → Confirm or Cancel */
export function getStatusActions(status: DisplayStatus) {
  return {
    canConfirm: status === 'PENDING',
    canComplete: status === 'CONFIRMED' || status === 'Active' || status === 'ACTIVE',
    canCancel: status === 'PENDING',
    showActions: status === 'PENDING' || status === 'CONFIRMED' || status === 'Active' || status === 'ACTIVE',
  };
}

export function canRescheduleAppointment(status?: string): boolean {
  return (status || '').toLowerCase() === 'pending';
}

export function categorizeAppointment(appt: {
  appointmentDate?: string | Date;
  date?: string;
  status?: string;
}): AppointmentCategory {
  const status = (appt.status || '').toLowerCase();
  if (status === 'completed' || status === 'cancelled') return 'History';

  const apptDate = parseAppointmentDate(appt);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const apptDay = new Date(apptDate);
  apptDay.setHours(0, 0, 0, 0);

  if (apptDay.getTime() === today.getTime()) return 'Today';
  if (apptDay.getTime() < today.getTime()) return 'History';
  return 'Upcoming';
}

export function parseDurationHours(duration?: string): number {
  if (!duration) return 1;
  const lower = duration.toLowerCase();
  if (lower.includes('3+')) return 3;
  const match = lower.match(/([\d.]+)/);
  return match ? Number(match[1]) || 1 : 1;
}

export interface PswRequestViewModel {
  id: string;
  image?: string;
  initials: string;
  color: string;
  name: string;
  type: string;
  date: string;
  time: string;
  status: DisplayStatus;
  category: AppointmentCategory;
  location: string;
  paymentStatus?: string;
}

export function mapPswAppointmentToRequest(
  appt: Record<string, unknown>,
  index: number,
): PswRequestViewModel {
  const name = getPatientName(appt.userId);
  return {
    id: String(appt._id || appt.id || index),
    image: getPatientPhoto(appt.userId),
    initials: getInitials(name),
    color: AVATAR_COLORS[index % AVATAR_COLORS.length],
    name,
    type: String(appt.service || 'Care visit'),
    date: formatDisplayDate(appt as { appointmentDate?: string | Date; date?: string }),
    time: formatAppointmentTime(String(appt.time || ''), String(appt.duration || '')),
    status: toDisplayStatus(String(appt.status || '')),
    category: categorizeAppointment(appt as { appointmentDate?: string | Date; date?: string; status?: string }),
    location: String(appt.location || ''),
    paymentStatus: ((appt.payment as Record<string, unknown>)?.status as string) || 'unpaid',
  };
}

export type EarningsOverview = {
  today: number;
  week: number;
  month: number;
};

const EARNINGS_STATUSES = new Set(['pending', 'confirmed', 'completed']);

export function formatEarningsAmount(amount: number): string {
  return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function computeEarningsOverview(
  appointments: Record<string, unknown>[],
): EarningsOverview {
  const now = new Date();
  const todayStart = new Date(now);
  const todayStartMs = todayStart.setHours(0, 0, 0, 0);

  const weekStart = new Date(todayStartMs);
  const day = weekStart.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  weekStart.setDate(weekStart.getDate() + diff);

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const result: EarningsOverview = { today: 0, week: 0, month: 0 };

  for (const appt of appointments) {
    const status = String(appt.status || '').toLowerCase();
    const paymentStatus = String((appt.payment as Record<string, unknown>)?.status || '').toLowerCase();
    if (status !== 'completed' || paymentStatus !== 'paid') continue;

    const apptDate = parseAppointmentDate(appt as { appointmentDate?: string | Date; date?: string });
    const price = Number(appt.price) || 0;

    if (apptDate.getTime() >= todayStartMs) result.today += price;
    if (apptDate >= weekStart) result.week += price;
    if (apptDate >= monthStart) result.month += price;
  }

  return result;
}

export function computeTodaySummary(appointments: Record<string, unknown>[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayAppts = appointments.filter((appt) => {
    const d = parseAppointmentDate(appt as { appointmentDate?: string | Date; date?: string });
    d.setHours(0, 0, 0, 0);
    const status = String(appt.status || '').toLowerCase();
    const paymentStatus = String((appt.payment as Record<string, unknown>)?.status || '').toLowerCase();
    return d.getTime() === today.getTime() && status === 'completed' && paymentStatus === 'paid';
  });

  const hours = todayAppts.reduce(
    (sum, appt) => sum + parseDurationHours(String(appt.duration || '')),
    0,
  );
  const earnings = todayAppts.reduce((sum, appt) => sum + (Number(appt.price) || 0), 0);

  return {
    count: todayAppts.length,
    hours: hours % 1 === 0 ? `${hours} hrs` : `${hours.toFixed(1)} hrs`,
    earnings: `$${Math.round(earnings)}`,
  };
}
