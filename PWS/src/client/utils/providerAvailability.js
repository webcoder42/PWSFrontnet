export const AVAILABILITY_DAY_KEYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export const AVAILABILITY_TIME_LABELS = {
  Morning: '09:00 AM - 12:00 PM',
  Afternoon: '12:00 PM - 06:00 PM',
  Evening: '06:00 PM - 12:00 AM',
};
const SLOT_BY_VALUE = Object.entries(AVAILABILITY_TIME_LABELS).reduce((acc, [key, value]) => {
  acc[key.toLowerCase()] = key;
  acc[String(value).toLowerCase()] = key;
  return acc;
}, {});

const DAY_NAMES = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

export const getCurrentDayKey = (date = new Date()) => {
  const weekdayIndex = (date.getDay() + 6) % 7;
  return AVAILABILITY_DAY_KEYS[weekdayIndex];
};

export const getDayLabel = (dayKey, short = false) => {
  if (short) {
    return dayKey.slice(0, 3).replace(/^(.)/, (match) => match.toUpperCase());
  }
  return DAY_NAMES[dayKey];
};

export const normalizeAvailability = (availability = {}) => {
  return AVAILABILITY_DAY_KEYS.reduce((acc, dayKey) => {
    const rawSlots = Array.isArray(availability?.[dayKey]) ? availability[dayKey] : [];
    acc[dayKey] = rawSlots
      .map((slot) => SLOT_BY_VALUE[String(slot).trim().toLowerCase()] || '')
      .filter(Boolean);
    return acc;
  }, {});
};

export const getAvailabilityForDay = (availability, dayKey) => {
  return normalizeAvailability(availability)[dayKey] || [];
};

export const getCurrentDayAvailability = (availability, date = new Date()) => {
  return getAvailabilityForDay(availability, getCurrentDayKey(date));
};

export const getAvailabilitySummary = (availability, dayKey) => {
  const slots = getAvailabilityForDay(availability, dayKey);
  return slots.length ? slots.join(', ') : 'No availability';
};

export const getWeeklyAvailability = (availability) => {
  const normalized = normalizeAvailability(availability);
  return AVAILABILITY_DAY_KEYS.map((dayKey) => ({
    dayKey,
    dayLabel: getDayLabel(dayKey),
    slots: normalized[dayKey],
  }));
};

export const formatReadableDate = (date) => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatSlotLabel = (slot) => {
  return AVAILABILITY_TIME_LABELS[slot] || slot;
};

const SLOT_CANONICAL = Object.entries(AVAILABILITY_TIME_LABELS).reduce((acc, [key, value]) => {
  acc[key.toLowerCase()] = key;
  acc[String(value).toLowerCase()] = key;
  return acc;
}, {});

export const normalizeTimeSlot = (slot) => {
  const normalized = String(slot || '').trim().toLowerCase();
  return SLOT_CANONICAL[normalized] || String(slot || '').trim();
};

export const isActiveBookingStatus = (status) => {
  const normalized = String(status || '').toLowerCase().trim();
  return normalized === 'pending' || normalized === 'confirmed';
};

export const isSameCalendarDay = (leftDate, rightDate) => {
  if (!(leftDate instanceof Date) || Number.isNaN(leftDate.getTime())) return false;
  if (!(rightDate instanceof Date) || Number.isNaN(rightDate.getTime())) return false;

  return (
    leftDate.getFullYear() === rightDate.getFullYear()
    && leftDate.getMonth() === rightDate.getMonth()
    && leftDate.getDate() === rightDate.getDate()
  );
};

export const getAppointmentCalendarDate = (appointment) => {
  if (appointment?.appointmentDate) {
    const parsed = new Date(appointment.appointmentDate);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  if (appointment?.year && appointment?.month && appointment?.day) {
    const parsed = new Date(Number(appointment.year), Number(appointment.month) - 1, Number(appointment.day));
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  if (appointment?.date) {
    const parsed = new Date(appointment.date);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return null;
};

export const getBookedSlotsForDate = (appointments = [], date, excludeAppointmentId = null) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return [];
  }

  const bookedSlots = new Set();

  appointments.forEach((appointment) => {
    if (!isActiveBookingStatus(appointment?.status)) {
      return;
    }

    const appointmentId = appointment?._id || appointment?.id;
    if (excludeAppointmentId && String(appointmentId) === String(excludeAppointmentId)) {
      return;
    }

    const appointmentDate = getAppointmentCalendarDate(appointment);
    if (!isSameCalendarDay(appointmentDate, date)) {
      return;
    }

    const normalizedSlot = normalizeTimeSlot(appointment?.time);
    if (normalizedSlot) {
      bookedSlots.add(normalizedSlot);
    }
  });

  return Array.from(bookedSlots);
};

export const isSlotBooked = (appointments = [], date, slot, excludeAppointmentId = null) => {
  const normalizedSlot = normalizeTimeSlot(slot);
  return getBookedSlotsForDate(appointments, date, excludeAppointmentId).includes(normalizedSlot);
};
