/** Client-facing service rates (pay-as-you-go / subscription) per platform fee sheet. */
export const PLATFORM_FEE_PERCENT = 1.9;

export const bookingServices = [
  {
    id: 1,
    slug: 'respite-care',
    name: 'Respite Care',
    description: 'Short-term relief care so family caregivers can rest and recharge.',
    icon: '🛌',
    time: 'VARIABLE',
    payAsYouGoRate: 32.5,
    subscriptionRate: 27.5,
    taxPercent: 13,
  },
  {
    id: 2,
    slug: 'laundry',
    name: 'Laundry',
    description: 'Washing, drying, folding, and organizing clothing and linens.',
    icon: '👕',
    time: '60-90 MIN',
    payAsYouGoRate: 30,
    subscriptionRate: 25,
    taxPercent: 13,
  },
  {
    id: 3,
    slug: 'light-housekeeping',
    name: 'Light Housekeeping',
    description: 'Tidying, dusting, and maintaining a clean, safe living space.',
    icon: '🏠',
    time: '60-120 MIN',
    payAsYouGoRate: 30,
    subscriptionRate: 25,
    taxPercent: 13,
  },
  {
    id: 4,
    slug: 'companionship',
    name: 'Companionship',
    description: 'Social engagement, activities, and emotional support visits.',
    icon: '🤝',
    time: '120-180 MIN',
    payAsYouGoRate: 30,
    subscriptionRate: 25,
    taxPercent: 13,
  },
  {
    id: 5,
    slug: 'transportation',
    name: 'Transportation Services',
    description: 'Safe travel to medical appointments or essential errands.',
    icon: '🚗',
    time: 'VARIABLE',
    payAsYouGoRate: 30,
    subscriptionRate: 25,
    taxPercent: 3,
  },
  {
    id: 6,
    slug: 'mobility-rehab',
    name: 'Mobility / Rehabilitation Exercises',
    description: 'Assisted movement, stretching, and guided rehabilitation exercises.',
    icon: '🏃',
    time: '45-60 MIN',
    payAsYouGoRate: 30,
    subscriptionRate: 25,
    taxPercent: 13,
  },
];

export function getServiceHourlyRate(service, isSubscription = false) {
  if (!service) return 32.5;
  return isSubscription
    ? Number(service.subscriptionRate ?? service.payAsYouGoRate)
    : Number(service.payAsYouGoRate ?? 32.5);
}

export function findBookingService(match) {
  if (!match) return null;
  if (typeof match === 'object' && match.slug) {
    return bookingServices.find((s) => s.slug === match.slug || s.id === match.id) || match;
  }
  const key = String(match).toLowerCase();
  return (
    bookingServices.find(
      (s) =>
        s.slug === key ||
        String(s.id) === key ||
        s.name.toLowerCase() === key
    ) || null
  );
}

/**
 * @param {object|number} service - service object or hourly rate
 * @param {number} durationMinutes
 * @param {boolean} [isSubscription=false]
 */
export function computeBookingEstimate(service, durationMinutes, isSubscription = false) {
  const resolved = typeof service === 'object' ? findBookingService(service) || service : null;
  const hourlyRate =
    typeof service === 'number'
      ? service
      : getServiceHourlyRate(resolved, isSubscription);
  const taxPercent = resolved?.taxPercent ?? 13;
  const durationHours = durationMinutes / 60;
  const subtotal = hourlyRate * durationHours;
  const platformFee = subtotal * (PLATFORM_FEE_PERCENT / 100);
  const tax = subtotal * (taxPercent / 100);
  const total = subtotal + platformFee + tax;

  return {
    hourlyRate,
    durationHours,
    subtotal,
    platformFee,
    tax,
    total,
    platformFeePercent: PLATFORM_FEE_PERCENT,
    taxPercent,
  };
}

export function formatRate(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return '0.00';
  return n % 1 === 0 ? n.toFixed(2) : n.toFixed(2);
}
