import React, { useEffect, useMemo, useState } from 'react';
import { formatRate, getServiceHourlyRate } from '../../utils/servicePricing';
import { useUser } from '../../context/UserContext';
import { useProvidersQuery } from '../../hooks/useClientQueries';

const getDistanceKm = (lat1, lng1, lat2, lng2) => {
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const DAY_LABELS = {
  monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
  thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
};

const isApprovedProvider = (provider) => {
  const pswStatus = String(provider.pswCertificateStatus || '').toLowerCase();
  const bgStatus = String(provider.backgroundCheckStatus || '').toLowerCase();
  return pswStatus === 'approved' && bgStatus === 'approved';
};

const formatProvider = (provider) => ({
  ...provider,
  fullName: provider.fullName || `${provider.firstName || ''} ${provider.lastName || ''}`.trim() || 'Care Provider',
  rating: Number(provider.rating) || 0,
  ratingCount: Number(provider.ratingCount) || 0,
  spokenLanguages: Array.isArray(provider.spokenLanguages) && provider.spokenLanguages.length ? provider.spokenLanguages : ['English'],
  specializations: Array.isArray(provider.specializations) && provider.specializations.length ? provider.specializations : ['Personal Care Specialist'],
  yearsOfExperience: Number(provider.yearsOfExperience) || 0,
  availability: provider.availability || {},
  // certificate/clearance statuses from backend
  pswCertificateStatus: provider.pswCertificateStatus || 'pending',
  backgroundCheckStatus: provider.backgroundCheckStatus || 'pending',
  todaySlotsCount: Number(provider.todaySlotsCount) || 0,
  minimumNoticeHours: Number(provider.minimumNoticeHours) || 24,
  autoConfirm: provider.autoConfirm === true,
});

// ─── Status badge helper ─────────────────────────────────────────────────────
const ClearanceBadge = ({ status }) => {
  const cfg = {
    approved: { label: 'Verified',  cls: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    pending:  { label: 'Pending',   cls: 'bg-amber-50  text-amber-600  border-amber-100'  },
    rejected: { label: 'Rejected',  cls: 'bg-rose-50   text-rose-600   border-rose-100'   },
  };
  const { label, cls } = cfg[status] || cfg.pending;
  return (
    <span className={`text-[8px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest border ${cls}`}>
      {label}
    </span>
  );
};

// ─── Provider Bio Slide-Over Panel ───────────────────────────────────────────
const ProviderBioPanel = ({ provider, onClose, onSelect, isSelected, serviceHourlyRate }) => {
  if (!provider) return null;

  const displayRating = Number(provider.rating) || 0;
  const ratingLabel = displayRating > 0 ? displayRating.toFixed(1) : 'New';

  const availabilityEntries = Object.entries(provider.availability || {}).filter(
    ([, slots]) => Array.isArray(slots) && slots.length > 0,
  );

  const allServices = [
    ...(provider.servicesProvided || []),
    ...(provider.specializations || []),
  ];

  // Count available days
  const availableDays = Object.values(provider.availability || {}).filter(
    (slots) => Array.isArray(slots) && slots.length > 0,
  ).length;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl overflow-y-auto flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div>
            <p className="text-[9px] font-bold text-purple-600 uppercase tracking-widest mb-0.5">Provider Profile</p>
            <h3 className="text-lg font-bold text-gray-900 font-serif leading-tight">{provider.fullName}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-6 space-y-5 overflow-y-auto">
          {/* Avatar + Verified */}
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <img
                src={provider.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${provider.fullName}`}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-lg"
                alt={provider.fullName}
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-lg border-2 border-white flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div>
              <span className="bg-emerald-50 text-emerald-600 text-[8px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-100">
                Clinical Verified
              </span>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">
                {provider.specializations?.[0] || 'Care Provider'}
              </p>
              <p className="text-[9px] text-gray-500 mt-0.5">
                {provider.yearsOfExperience} yrs experience
              </p>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-gray-50 rounded-2xl p-3 text-center border border-gray-100">
              <p className="text-base font-bold text-gray-900">{ratingLabel}</p>
              <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Rating</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-3 text-center border border-gray-100">
              <p className="text-base font-bold text-gray-900">{provider.todaySlotsCount || 0}</p>
              <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Open slots</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-3 text-center border border-gray-100">
              <p className="text-base font-bold text-gray-900">{availableDays}/7</p>
              <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Coverage</p>
            </div>
          </div>

          {/* Clinical Bio */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <p className="text-[9px] font-bold text-purple-600 uppercase tracking-widest mb-2">Clinical Bio</p>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              {provider.bio && provider.bio.trim() ? provider.bio : 'No biography details provided.'}
            </p>
          </div>

          {/* ── CLEARANCE ── actual status from backend */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <p className="text-[9px] font-bold text-purple-600 uppercase tracking-widest mb-3">Clearance</p>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-white rounded-lg border border-gray-100 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-bold text-gray-700">PSW certificate</span>
                </div>
                <ClearanceBadge status={provider.pswCertificateStatus} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-white rounded-lg border border-gray-100 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-bold text-gray-700">Background check</span>
                </div>
                <ClearanceBadge status={provider.backgroundCheckStatus} />
              </div>
            </div>
          </div>

          {/* Booking Rules */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <p className="text-[9px] font-bold text-purple-600 uppercase tracking-widest mb-3">Booking Rules</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-[10px] text-gray-500 font-bold">Minimum notice</span>
                <span className="text-[10px] font-bold text-gray-900">{provider.minimumNoticeHours || 24} hrs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[10px] text-gray-500 font-bold">Auto confirm</span>
                <span className="text-[10px] font-bold text-gray-900">
                  {provider.autoConfirm ? 'Auto confirm' : 'Manual review'}
                </span>
              </div>
            </div>
          </div>

          {/* Services & Languages */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <p className="text-[9px] font-bold text-purple-600 uppercase tracking-widest mb-3">
              Services & Languages
            </p>
            <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mb-2">
              {allServices.length} services · {provider.spokenLanguages?.length || 1} languages
            </p>
            <div className="flex flex-wrap gap-1.5">
              {(provider.servicesProvided || []).map((s) => (
                <span key={s} className="bg-purple-50 text-purple-600 text-[8px] font-bold px-2 py-1 rounded-lg border border-purple-100">{s}</span>
              ))}
              {(provider.spokenLanguages || []).map((l) => (
                <span key={l} className="bg-blue-50 text-blue-600 text-[8px] font-bold px-2 py-1 rounded-lg border border-blue-100">{l}</span>
              ))}
              {(provider.specializations || []).map((s) => (
                <span key={s} className="bg-emerald-50 text-emerald-600 text-[8px] font-bold px-2 py-1 rounded-lg border border-emerald-100">{s}</span>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <p className="text-[9px] font-bold text-purple-600 uppercase tracking-widest mb-3">Availability</p>
            {availabilityEntries.length > 0 ? (
              <div className="space-y-2">
                {Object.entries(DAY_LABELS).map(([key, label]) => {
                  const slots = provider.availability?.[key];
                  const hasSlots = Array.isArray(slots) && slots.length > 0;
                  return (
                    <div key={key} className="flex items-start justify-between gap-2">
                      <span className={`text-[10px] font-bold shrink-0 ${hasSlots ? 'text-gray-900' : 'text-gray-300'}`}>
                        {label}
                      </span>
                      {hasSlots ? (
                        <div className="flex flex-wrap gap-1 justify-end">
                          {slots.map((slot, i) => (
                            <span key={i} className="bg-white text-purple-600 text-[8px] font-bold px-2 py-0.5 rounded-lg border border-purple-100">
                              {typeof slot === 'string'
                                ? slot
                                : `${slot.start || slot.startTime || ''}${slot.end || slot.endTime ? ` - ${slot.end || slot.endTime}` : ''}`}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[9px] text-gray-300 font-bold">Unavailable</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-[10px] text-gray-400">No availability set</p>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-5 border-t border-gray-100 space-y-2.5 shrink-0">
          <button
            onClick={() => { onSelect(provider); onClose(); }}
            className="w-full py-4 rounded-2xl bg-[#5915BD] text-white font-bold text-[11px] uppercase tracking-widest shadow-xl shadow-purple-200 hover:-translate-y-0.5 transition-all active:scale-[0.98]"
          >
            {isSelected ? '✓ Selected' : 'Select This Provider'}
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all"
          >
            Back to results
          </button>
        </div>
      </div>
    </>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const BookingStep2 = ({ selectedService, selectedProvider, onProviderSelect, onBack, onContinue }) => {
  const { user } = useUser();
  const [bioProvider, setBioProvider] = useState(null);
  const [searchRadius, setSearchRadius] = useState(25);
  const [sortBy, setSortBy] = useState('Best Match');
  const [userLat, setUserLat] = useState(null);
  const [userLng, setUserLng] = useState(null);
  const [userAddress, setUserAddress] = useState('');

  // Extract user location from context
  useEffect(() => {
    const coords = user?.address?.geojson?.coordinates;
    const hasCoords = Array.isArray(coords) && coords.length === 2;
    if (hasCoords) {
      setUserLng(coords[0]);
      setUserLat(coords[1]);
    }
    const city = user?.address?.city || '';
    const province = user?.address?.province || '';
    setUserAddress([user?.address?.street, city, province].filter(Boolean).join(', ') || 'Your location');

    if (!hasCoords) {
      const query = [user?.address?.street, city, province, user?.address?.postalCode].filter(Boolean).join(', ');
      if (query) {
        fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(query)}&limit=1`)
          .then((r) => r.json())
          .then((data) => {
            if (Array.isArray(data) && data.length > 0) {
              const glat = parseFloat(data[0].lat);
              const glng = parseFloat(data[0].lon);
              if (!isNaN(glat) && !isNaN(glng)) {
                setUserLat(glat);
                setUserLng(glng);
              }
            }
          })
          .catch(() => {});
      }
    }
  }, [user]);

  const providersEnabled = !!(selectedService && (userLat != null || user?.address));
  const { data: rawProviders = [], isLoading: loading, error: fetchError } = useProvidersQuery(
    { service: selectedService, lat: userLat, lng: userLng, radiusKm: searchRadius },
    providersEnabled
  );

  const providers = rawProviders
    .map(formatProvider)
    .filter(isApprovedProvider)
    .map((p) => {
      if (Number.isFinite(userLat) && Number.isFinite(userLng) && typeof p.distanceKm !== 'number') {
        const pCoords = p.address?.geojson?.coordinates;
        if (Array.isArray(pCoords) && pCoords.length === 2) {
          const plng = Number(pCoords[0]);
          const plat = Number(pCoords[1]);
          if (Number.isFinite(plat) && Number.isFinite(plng)) {
            p.distanceKm = getDistanceKm(userLat, userLng, plat, plng);
          }
        }
      }
      return p;
    });

  const sortedProviders = useMemo(() => {
    const nextProviders = [...providers];
    nextProviders.sort((a, b) => {
      if (sortBy === 'Rating') {
        const ratingDiff = (b.rating || 0) - (a.rating || 0);
        if (ratingDiff !== 0) return ratingDiff;
      }

      if (sortBy === 'Experience') {
        const experienceDiff = (b.yearsOfExperience || 0) - (a.yearsOfExperience || 0);
        if (experienceDiff !== 0) return experienceDiff;
      }

      const distanceDiff = (a.distanceKm ?? Number.MAX_VALUE) - (b.distanceKm ?? Number.MAX_VALUE);
      if (distanceDiff !== 0) return distanceDiff;

      const ratingDiff = (b.rating || 0) - (a.rating || 0);
      if (ratingDiff !== 0) return ratingDiff;

      return (b.yearsOfExperience || 0) - (a.yearsOfExperience || 0);
    });
    return nextProviders;
  }, [providers, sortBy]);

  useEffect(() => {
    if (!selectedProvider && sortedProviders.length > 0) {
      onProviderSelect(sortedProviders[0]);
    }
  }, [onProviderSelect, selectedProvider, sortedProviders]);

  const activeProvider = selectedProvider || sortedProviders[0];
  const serviceHourlyRate = useMemo(
    () => getServiceHourlyRate(selectedService),
    [selectedService]
  );

  return (
    <>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
        <div className="mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 font-serif tracking-tight">Choose a Care Provider</h2>
          <div className="flex items-center text-xs font-bold text-purple-600 uppercase tracking-widest bg-purple-50 px-4 py-2 rounded-xl w-fit border border-purple-100">
            Step 02 <span className="mx-2 opacity-30 text-gray-400">·</span> <span className="text-gray-400">Elite Caregiver Selection</span>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md p-4 rounded-[2rem] border border-gray-50 mb-6 flex flex-wrap gap-3 items-center shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest shrink-0">
            {userLat != null && userLng != null
              ? <>Search radius <span className="text-purple-600">{searchRadius} km</span> from {userAddress || 'your location'}</>
              : 'Search radius'}
          </span>
          <div className="flex gap-1">
            {[5, 10, 15, 25, 50].map(km => (
              <button
                key={km}
                onClick={() => setSearchRadius(km)}
                className={`px-3 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${
                  searchRadius === km
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-white text-gray-500 border border-gray-100 hover:border-purple-200'
                }`}
              >
                {km} km
              </button>
            ))}
          </div>
          {!userAddress && (
            <span className="text-[8px] text-amber-500 font-bold">Set your location in profile to see provider distances</span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 px-2 gap-3">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest shrink-0">Sort by:</span>
            <div className="flex bg-gray-50/50 p-1 rounded-xl border border-gray-25 w-full sm:w-auto">
              {['Best Match', 'Rating', 'Experience'].map(sort => (
                <button
                  key={sort}
                  onClick={() => setSortBy(sort)}
                  className={`flex-1 sm:flex-none px-2 md:px-6 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${
                    sortBy === sort ? 'bg-white text-purple-600 shadow-sm border border-gray-50' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {sort}
                </button>
              ))}
            </div>
          </div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest opacity-70">{sortedProviders.length} Provider{sortedProviders.length === 1 ? '' : 's'} Available</p>
        </div>

        {(fetchError && providersEnabled) && <p className="mb-6 text-sm text-amber-600">No providers are available right now. Please try again in a moment.</p>}

        {loading ? (
          <div className="rounded-[2rem] border border-gray-100 bg-white px-8 py-12 text-center shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
            <p className="text-sm font-semibold text-gray-700">Loading real providers...</p>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-gray-400">Fetching from your backend</p>
          </div>
        ) : sortedProviders.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-gray-200 bg-white px-8 py-12 text-center shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
            <p className="text-sm font-semibold text-gray-700">No verified providers are available right now.</p>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-gray-400">Only approved PSWs appear in this booking list.</p>
          </div>
        ) : (
        <div className="space-y-8">
          {sortedProviders.map((provider, index) => {
            const isSelected = activeProvider?._id === provider._id;
            const tags = [...(provider.specializations || ['Personal Care Specialist']).slice(0, 2)];
            if (provider.spokenLanguages?.length) {
              provider.spokenLanguages.slice(0, 1).forEach(l => tags.push(l));
            }
            if (provider.yearsOfExperience) {
              tags.push(`${provider.yearsOfExperience} yrs experience`);
            }

            const displayRating = Number(provider.rating) || 0;
            const ratingLabel = displayRating > 0 ? displayRating.toFixed(1) : 'New';
            const ratingCount = Number(provider.ratingCount) || 0;
            const ratingSubLabel =
              ratingCount > 0
                ? `${ratingCount} ${ratingCount === 1 ? 'Review' : 'Reviews'}`
                : 'Verified Rating';

            // Availability for Monday display
            const mondaySlots = provider.availability?.monday;
            const availDisplay = Array.isArray(mondaySlots) && mondaySlots.length > 0
              ? mondaySlots.map(s =>
                  typeof s === 'string' ? s : `${s.start || s.startTime || ''} - ${s.end || s.endTime || ''}`
                ).join(', ')
              : 'Availability soon';

            return (
              <div key={provider._id} className={`bg-white p-6 md:p-10 rounded-[2.5rem] border flex flex-col md:flex-row items-center relative overflow-hidden group hover:border-[#5915BD] transition-all duration-500 shadow-[0_20px_60px_rgba(0,0,0,0.02)] ${isSelected ? 'border-[#5915BD] shadow-[0_30px_70px_rgba(89,21,189,0.08)]' : 'border-gray-50 hover:shadow-[0_30px_70px_rgba(89,21,189,0.08)]'}`}>
                {index === 0 && (
                  <div className="absolute top-0 left-10 bg-[#5915BD] px-5 py-2 rounded-b-2xl text-[9px] font-bold text-white uppercase tracking-[0.2em] shadow-lg shadow-purple-100 z-10">Primary Choice</div>
                )}

                <div className="flex-shrink-0 relative mb-8 md:mb-0">
                  <div className="w-32 h-32 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl relative group-hover:scale-105 transition-transform duration-500">
                    <img src={provider.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${provider.fullName}`} className="w-full h-full object-cover" alt={provider.fullName} />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-8 h-8 rounded-2xl border-4 border-white flex items-center justify-center shadow-lg text-white">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                  </div>
                </div>

                <div className="md:ml-10 flex-1 w-full text-center md:text-left">
                  <div className="flex flex-col md:flex-row items-center md:items-baseline gap-3 mb-2">
                    <h4 className="text-2xl font-bold text-gray-900 font-serif">{provider.fullName}</h4>
                    <span className="bg-emerald-50 text-emerald-600 text-[8px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-100 flex items-center shadow-sm">
                      Clinical Verified
                    </span>
                  </div>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-3">
                    {provider.specializations?.[0] || 'Care Provider'}
                  </p>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 mb-5">
                    {userAddress && (
                      <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-gray-400">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                        {userAddress}
                      </span>
                    )}
                    <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l6 6-6 6"/></svg>
                    {(provider.address?.city || provider.address?.province) && (
                      <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-purple-600">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                        {[provider.address?.city, provider.address?.province].filter(Boolean).join(', ')}
                      </span>
                    )}
                    {typeof provider.distanceKm === 'number' && (
                      <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                        {provider.distanceKm.toFixed(1)} km
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                    <div className="flex items-center">
                      <span className="text-orange-400 text-xl mr-2">★</span>
                      <span className="text-lg font-bold text-gray-800">{ratingLabel}</span>
                      <span className="text-gray-300 text-[10px] font-bold ml-2 uppercase tracking-tight">{ratingSubLabel}</span>
                    </div>
                    <div className="w-40 h-1.5 bg-gray-50 rounded-full overflow-hidden shrink-0 border border-gray-100">
                      <div
                        className="h-full bg-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.5)]"
                        style={{ width: `${displayRating > 0 ? Math.min((displayRating / 5) * 100, 100) : 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-8">
                    {tags.map((tag) => (
                      <span key={tag} className="bg-[#F9F7FF] text-[#5915BD] text-[9px] font-bold px-4 py-2 rounded-xl border border-purple-50/50">{tag}</span>
                    ))}
                  </div>

                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest flex items-center justify-center md:justify-start">
                    <span className="w-2 h-2 rounded-full bg-[#5915BD] mr-3 animate-pulse"></span>
                    Monday: <span className="text-[#5915BD] ml-2">{availDisplay}</span>
                  </p>
                </div>

                <div className="md:ml-10 w-full md:w-auto text-center md:text-right md:border-l border-gray-50 md:pl-10 pt-10 md:pt-0">
                  <div className="mb-8">
                    <p className="text-3xl font-bold text-gray-900 leading-none">${formatRate(serviceHourlyRate)}</p>
                    <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-[0.2em] font-bold">Hourly Rate</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => onProviderSelect(provider)}
                      className={`px-6 md:px-10 py-4 md:py-5 rounded-2xl font-bold text-[11px] uppercase tracking-widest transition-all active:scale-[0.98] ${isSelected ? 'bg-[#5915BD] text-white shadow-xl shadow-purple-200 hover:-translate-y-1' : 'bg-white border border-gray-100 text-[#5915BD] hover:border-purple-100'}`}
                    >
                      {isSelected ? 'Selected ✓' : 'Select PSW'}
                    </button>
                    <button
                      onClick={() => setBioProvider(provider)}
                      className="py-4 text-[#5915BD] text-[9px] font-bold uppercase tracking-widest hover:bg-purple-50 rounded-2xl transition-all border border-transparent hover:border-purple-50"
                    >
                      View Full Clinical Bio
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        )}

        <div className="flex justify-between items-center mt-16 pt-8 border-t border-gray-100">
          <button onClick={onBack} className="flex items-center gap-3 text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:text-[#5915BD] transition-all group">
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
            Return to Service
          </button>
          <button onClick={onContinue} disabled={!activeProvider} className={`px-6 md:px-12 py-4 md:py-5 rounded-[1.5rem] font-bold flex items-center text-[10px] uppercase tracking-widest shadow-sm transition-all group ${activeProvider ? 'bg-white border border-gray-100 text-[#5915BD] hover:shadow-md' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
            {activeProvider ? 'Continue' : 'Select a Provider'} <svg className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>

      {/* Provider Bio Slide-Over */}
      {bioProvider && (
        <ProviderBioPanel
          provider={bioProvider}
          onClose={() => setBioProvider(null)}
          onSelect={onProviderSelect}
          isSelected={activeProvider?._id === bioProvider._id}
          serviceHourlyRate={serviceHourlyRate}
        />
      )}
    </>
  );
};

export default BookingStep2;
