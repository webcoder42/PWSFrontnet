import {
  formatAppointmentTime,
  formatDisplayDate,
  getPatientName,
  getPatientPhoto,
  parseAppointmentDate,
  parseDurationHours,
} from './appointmentHelpers';

export type ClientStatus = 'ACTIVE' | 'NEW' | 'INACTIVE';

export interface ClientStats {
  totalVisits: number;
  hrsThisMonth: string;
  rating: number;
  since: string;
}

export interface ClientDetails {
  fullName: string;
  age: number | string;
  gender: string;
  languages: string[];
  phone: string;
  email: string;
  address: string;
  physicalStats: {
    height: string;
    weight: string;
  };
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  careConditions: string[];
  careServices: string[];
}

export interface PswClient {
  id: string;
  userId: string;
  name: string;
  image: string;
  type: string;
  location: string;
  status: ClientStatus;
  stats: ClientStats;
  nextAppointment: {
    date: string;
    time: string;
  };
  details: ClientDetails;
}

function getClientUserId(appt: Record<string, unknown>): string {
  const userId = appt.userId;
  if (userId && typeof userId === 'object' && '_id' in userId) {
    return String((userId as { _id: unknown })._id);
  }
  return String(userId);
}

function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function formatPhysicalStat(
  stat?: { value?: number; unit?: string },
  fallback = '—',
): string {
  if (!stat || stat.value === undefined || Number.isNaN(Number(stat.value))) return fallback;
  return `${stat.value} ${stat.unit || ''}`.trim();
}

function computeBasicRating(completedVisits: number): number {
  const rating = 4 + Math.min(1, completedVisits * 0.05);
  return Math.round(rating * 10) / 10;
}

function deriveClientStatus(
  appts: Record<string, unknown>[],
  hasUpcoming: boolean,
): ClientStatus {
  const nonCancelled = appts.filter((a) => String(a.status || '').toLowerCase() !== 'cancelled');
  if (nonCancelled.length === 0) return 'INACTIVE';

  const firstCreated = nonCancelled.reduce((earliest, appt) => {
    const created = appt.createdAt ? new Date(String(appt.createdAt)) : new Date(0);
    return created < earliest ? created : earliest;
  }, new Date());

  const daysSinceFirst = (Date.now() - firstCreated.getTime()) / (1000 * 60 * 60 * 24);
  if (nonCancelled.length <= 2 && daysSinceFirst <= 30) return 'NEW';

  if (!hasUpcoming) {
    const lastAppt = nonCancelled.reduce((latest, appt) => {
      const d = parseAppointmentDate(appt as { appointmentDate?: string; date?: string });
      return d > latest ? d : latest;
    }, new Date(0));
    const daysSinceLast = (Date.now() - lastAppt.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceLast > 90) return 'INACTIVE';
  }

  return 'ACTIVE';
}

function getLocation(user: Record<string, unknown> | null, fallbackLocation: string): string {
  const address = user?.address as Record<string, unknown> | undefined;
  const city = typeof address?.city === 'string' ? address.city.trim() : '';
  if (city) return city;
  if (fallbackLocation) return fallbackLocation.split(',')[0].trim();
  return '—';
}

function buildDefaultDetails(
  user: Record<string, unknown> | null,
  name: string,
  primaryService: string,
): ClientDetails {
  const recipient = user?.recipientProfile as Record<string, unknown> | undefined;
  const emergencyList = Array.isArray(recipient?.emergencyContacts)
    ? (recipient.emergencyContacts as Record<string, unknown>[])
    : [];
  const emergency = emergencyList[0] || {};
  const physical = user?.physicalStats as Record<string, unknown> | undefined;
  const height = physical?.height as { value?: number; unit?: string } | undefined;
  const weight = physical?.weight as { value?: number; unit?: string } | undefined;
  const address = user?.address as Record<string, unknown> | undefined;
  const addressParts = [
    typeof address?.street === 'string' ? address.street : '',
    typeof address?.city === 'string' ? address.city : '',
    typeof address?.province === 'string' ? address.province : '',
  ].filter(Boolean);

  let age: number | string = '—';
  if (user?.dateOfBirth) {
    const dob = new Date(String(user.dateOfBirth));
    if (!Number.isNaN(dob.getTime())) {
      age = Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    }
  }

  const careConditions = Array.isArray(recipient?.careConditions)
    ? (recipient.careConditions as string[])
    : primaryService ? [primaryService] : [];

  const careServices = Array.isArray(recipient?.servicesNeeded)
    ? (recipient.servicesNeeded as string[])
    : primaryService ? [primaryService] : [];

  return {
    fullName: name,
    age,
    gender: typeof user?.gender === 'string' ? user.gender : '—',
    languages: typeof user?.language === 'string' ? [user.language] : ['English'],
    phone: typeof user?.phone === 'string' ? user.phone : '—',
    email: typeof user?.email === 'string' ? user.email : '—',
    address: addressParts.length > 0 ? addressParts.join(', ') : '—',
    physicalStats: {
      height: formatPhysicalStat(height),
      weight: formatPhysicalStat(weight),
    },
    emergencyContact: {
      name: typeof emergency.name === 'string' ? emergency.name : '—',
      relation: typeof emergency.relationship === 'string' ? emergency.relationship : '—',
      phone: typeof emergency.phone === 'string' ? emergency.phone : '—',
    },
    careConditions,
    careServices,
  };
}

export function buildPswClientsFromAppointments(
  appointments: Record<string, unknown>[],
): PswClient[] {
  const byUser = new Map<string, Record<string, unknown>[]>();

  appointments.forEach((appt) => {
    const id = getClientUserId(appt);
    if (!byUser.has(id)) byUser.set(id, []);
    byUser.get(id)!.push(appt);
  });

  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  return Array.from(byUser.entries()).map(([userId, appts]) => {
    const sorted = [...appts].sort(
      (a, b) =>
        parseAppointmentDate(a as { appointmentDate?: string; date?: string }).getTime() -
        parseAppointmentDate(b as { appointmentDate?: string; date?: string }).getTime(),
    );

    const user =
      sorted[0]?.userId && typeof sorted[0].userId === 'object'
        ? (sorted[0].userId as Record<string, unknown>)
        : null;

    const name = getPatientName(user);
    const photo = getPatientPhoto(user);
    const image = photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

    const completed = sorted.filter((a) => String(a.status || '').toLowerCase() === 'completed');
    const totalVisits = completed.length > 0
      ? completed.length
      : sorted.filter((a) => String(a.status || '').toLowerCase() !== 'cancelled').length;

    const hrsThisMonth = sorted
      .filter((a) => {
        const d = parseAppointmentDate(a as { appointmentDate?: string; date?: string });
        return (
          d.getMonth() === month &&
          d.getFullYear() === year &&
          String(a.status || '').toLowerCase() !== 'cancelled'
        );
      })
      .reduce((sum, a) => sum + parseDurationHours(String(a.duration || '')), 0);

    const firstAppt = sorted.reduce((earliest, appt) => {
      const created = appt.createdAt ? new Date(String(appt.createdAt)) : parseAppointmentDate(appt as { appointmentDate?: string; date?: string });
      return created < earliest ? created : earliest;
    }, new Date());

    const upcoming = sorted
      .filter((a) => {
        const status = String(a.status || '').toLowerCase();
        if (status !== 'pending' && status !== 'confirmed') return false;
        const d = parseAppointmentDate(a as { appointmentDate?: string; date?: string });
        d.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return d.getTime() >= today.getTime();
      })
      .sort(
        (a, b) =>
          parseAppointmentDate(a as { appointmentDate?: string; date?: string }).getTime() -
          parseAppointmentDate(b as { appointmentDate?: string; date?: string }).getTime(),
      );

    const hasUpcoming = upcoming.length > 0;
    const primaryService = String(
      sorted[sorted.length - 1]?.service || sorted[0]?.service || 'Care visit',
    );
    const location = getLocation(user, String(sorted[0]?.location || ''));

    const next = upcoming[0];
    const nextAppointment = next
      ? {
          date: formatDisplayDate(next as { appointmentDate?: string; date?: string }),
          time: formatAppointmentTime(String(next.time || ''), String(next.duration || '')),
        }
      : { date: 'N/A', time: 'No upcoming visits' };

    return {
      id: userId,
      userId,
      name,
      image,
      type: primaryService,
      location,
      status: deriveClientStatus(sorted, hasUpcoming),
      stats: {
        totalVisits,
        hrsThisMonth: hrsThisMonth % 1 === 0 ? `${hrsThisMonth} hrs` : `${hrsThisMonth.toFixed(1)} hrs`,
        rating: computeBasicRating(completed.length),
        since: formatMonthYear(firstAppt),
      },
      nextAppointment,
      details: buildDefaultDetails(user, name, primaryService),
    };
  });
}

export function getClientsPageSummary(clients: PswClient[]) {
  const active = clients.filter((c) => c.status === 'ACTIVE').length;
  const newThisMonth = clients.filter((c) => c.status === 'NEW').length;
  return { active, newThisMonth };
}

export function mergeUserProfileIntoClient(client: PswClient, user: Record<string, unknown>): PswClient {
  const name = getPatientName(user);
  return {
    ...client,
    name,
    image: getPatientPhoto(user) || client.image,
    details: buildDefaultDetails(user, name, client.type),
  };
}
