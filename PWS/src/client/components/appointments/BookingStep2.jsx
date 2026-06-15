import React, { useEffect, useMemo, useState } from 'react';
import { getAppointmentsByUserAPI, getCareProvidersAPI } from '../../../utils/api';
import { useUser } from '../../../context/UserContext';
import {
  formatSlotLabel,
  getCurrentDayAvailability,
  getCurrentDayKey,
  getDayLabel,
  getWeeklyAvailability,
} from '../../utils/providerAvailability';
import { formatRate, getServiceHourlyRate } from '../../../utils/servicePricing';

const BookingStep2 = ({ selectedService, selectedProvider, onProviderSelect, onBack, onContinue }) => {
  const { rawUser, profile } = useUser();
  const [providers, setProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedProviderId, setExpandedProviderId] = useState(null);
  const [profileProvider, setProfileProvider] = useState(null);
  const [providerBookings, setProviderBookings] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadProviders = async () => {
      setIsLoading(true);
      setError('');

      try {
        const response = await getCareProvidersAPI(selectedService?.name || null);
        if (!isMounted) return;

        setProviders(Array.isArray(response?.data) ? response.data : []);
      } catch (fetchError) {
        if (!isMounted) return;
        setProviders([]);
        setError(fetchError.message || 'Unable to load care providers right now.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProviders();

    return () => {
      isMounted = false;
    };
  }, [selectedService?.name]);

  useEffect(() => {
    if (!profileProvider) {
      setProviderBookings([]);
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [profileProvider]);

  useEffect(() => {
    if (!profileProvider) {
      return undefined;
    }

    let isMounted = true;
    const providerId = profileProvider._id || profileProvider.id || null;
    const userId = rawUser?._id || rawUser?.id || profile?.id || null;

    const loadProviderBookings = async () => {
      if (!providerId || !userId) {
        if (isMounted) {
          setProviderBookings([]);
          setIsLoadingBookings(false);
        }
        return;
      }

      setIsLoadingBookings(true);

      try {
        const response = await getAppointmentsByUserAPI(userId);
        if (!isMounted) return;

        const appointments = Array.isArray(response?.data) ? response.data : [];
        const matched = appointments.filter((appointment) => {
          const appointmentProviderId = typeof appointment.pswId === 'object'
            ? appointment.pswId?._id || appointment.pswId?.id
            : appointment.pswId;

          return String(appointmentProviderId || '') === String(providerId);
        });

        matched.sort((left, right) => {
          const leftDate = new Date(`${left.date || ''} ${left.time || ''}`).getTime();
          const rightDate = new Date(`${right.date || ''} ${right.time || ''}`).getTime();
          return rightDate - leftDate;
        });

        setProviderBookings(matched);
      } catch {
        if (isMounted) {
          setProviderBookings([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingBookings(false);
        }
      }
    };

    loadProviderBookings();

    return () => {
      isMounted = false;
    };
  }, [profileProvider, rawUser?._id, rawUser?.id, profile?.id]);

  const todayKey = useMemo(() => getCurrentDayKey(), []);
  const todayLabel = useMemo(() => getDayLabel(todayKey), [todayKey]);
  const serviceHourlyRate = useMemo(
    () => getServiceHourlyRate(selectedService),
    [selectedService]
  );

  const providerCountLabel = selectedService
    ? `${providers.length} ${providers.length === 1 ? 'provider' : 'providers'} available for ${selectedService.name}`
    : `${providers.length} providers available`;

  const selectedProviderId = selectedProvider?._id || selectedProvider?.id || null;

  const normalizeStatusLabel = (value) => {
    if (!value) return 'Not shared';
    return String(value)
      .replace(/[_-]/g, ' ')
      .replace(/\b\w/g, (character) => character.toUpperCase());
  };

  const getAppointmentStatusStyles = (status) => {
    const normalized = String(status || '').toLowerCase().trim();

    if (normalized === 'completed') {
      return {
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        label: 'Completed',
      };
    }

    if (normalized === 'cancelled') {
      return {
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-100',
        label: 'Cancelled',
      };
    }

    if (normalized === 'confirmed') {
      return {
        badgeClass: 'bg-purple-50 text-[#5915BD] border-purple-100',
        label: 'Confirmed',
      };
    }

    return {
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-100',
      label: 'Pending',
    };
  };

  const getStatusTone = (value) => {
    const normalized = String(value || '').toLowerCase();
    if (['verified', 'clear', 'cleared', 'approved', 'active'].includes(normalized)) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    }

    if (['pending', 'review', 'under review', 'processing'].includes(normalized)) {
      return 'bg-amber-50 text-amber-700 border-amber-100';
    }

    return 'bg-gray-50 text-gray-600 border-gray-100';
  };

  const getProviderDetails = (provider) => {
    if (!provider) return null;

    const providerId = provider._id || provider.id || null;
    const serviceTags = Array.isArray(provider.servicesProvided) && provider.servicesProvided.length > 0
      ? provider.servicesProvided
      : ['Care Services'];
    const languageTags = Array.isArray(provider.spokenLanguages) && provider.spokenLanguages.length > 0
      ? provider.spokenLanguages
      : ['English'];
    const specializationTags = Array.isArray(provider.specializations) && provider.specializations.length > 0
      ? provider.specializations
      : [provider.specialty || 'Care Provider'];
    const currentSlots = getCurrentDayAvailability(provider.availability);
    const weeklyAvailability = getWeeklyAvailability(provider.availability);
    const availableDaysCount = weeklyAvailability.filter((entry) => entry.slots.length > 0).length;

    return {
      providerId,
      serviceTags,
      languageTags,
      specializationTags,
      currentSlots,
      weeklyAvailability,
      availableDaysCount,
      providerBio: provider.bio || provider.professionalBio || 'No biography details provided yet.',
      certificateStatus: provider.pswCertificateStatus || 'pending',
      backgroundCheckStatus: provider.backgroundCheckStatus || 'pending',
      bookingSettings: provider.bookingSettings || {},
      isSelected: selectedProviderId === providerId,
    };
  };

  const profileDetails = useMemo(
    () => getProviderDetails(profileProvider),
    [profileProvider, selectedProviderId]
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-3 font-serif tracking-tight">Choose a Care Provider</h2>
        <div className="flex items-center text-xs font-bold text-purple-600 uppercase tracking-widest bg-purple-50 px-4 py-2 rounded-xl w-fit border border-purple-100">
          Step 02 <span className="mx-2 opacity-30 text-gray-400">·</span> <span className="text-gray-400">Elite Caregiver Selection</span>
        </div>
        <p className="mt-4 text-sm text-gray-500">Showing {todayLabel} availability for each provider.</p>
      </div>

      <div className="bg-white/80 backdrop-blur-md p-4 rounded-[2rem] border border-gray-50 mb-10 flex flex-wrap gap-4 items-center shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
        {['Availability', 'Rating', 'Language'].map(filter => (
          <button
            key={filter}
            type="button"
            className="bg-white px-6 py-3 rounded-2xl text-[10px] font-bold text-gray-700 uppercase tracking-widest border border-gray-100 flex items-center shadow-sm hover:border-purple-200 transition-all"
          >
            {filter}
            <svg className="w-3.5 h-3.5 ml-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"/></svg>
          </button>
        ))}
        <button
          type="button"
          className="ml-auto text-purple-600 text-[10px] font-bold uppercase tracking-widest px-4 py-2 hover:bg-purple-50 rounded-xl transition-all"
        >
          Reset All
        </button>
      </div>

      <div className="flex justify-between items-center mb-8 px-2">
        <div className="flex items-center space-x-3">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sort by:</span>
          <div className="flex bg-gray-50/50 p-1 rounded-xl border border-gray-25">
            {['Best Match', 'Rating', 'Experience'].map(sort => (
              <button
                key={sort}
                type="button"
                className={`px-6 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${
                  sort === 'Best Match'
                    ? 'bg-white text-purple-600 shadow-sm border border-gray-50'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {sort}
              </button>
            ))}
          </div>
        </div>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest opacity-70">{providerCountLabel}</p>
      </div>

      {isLoading && (
        <div className="rounded-[2rem] border border-gray-50 bg-white p-8 text-center text-sm text-gray-500">
          Loading care providers...
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-[2rem] border border-rose-100 bg-rose-50 p-8 text-center text-sm text-rose-600">
          {error}
        </div>
      )}

      {!isLoading && !error && providers.length === 0 && (
        <div className="rounded-[2rem] border border-gray-50 bg-white p-8 text-center text-sm text-gray-500">
          No caregivers are currently available for this service. Try a different service or continue without selecting one.
        </div>
      )}

      {!isLoading && !error && providers.length > 0 && (
        <div className="space-y-8">
          {providers.map((provider, index) => {
            const providerId = provider._id || provider.id || `${index}`;
            const isSelected = selectedProviderId === providerId;
            const displayRating = Number(provider.rating) || 0;
            const ratingLabel = displayRating > 0 ? displayRating.toFixed(1) : 'New';
            const ratingCount = Number(provider.ratingCount) || 0;
            const ratingSubLabel =
              ratingCount > 0
                ? `${ratingCount} ${ratingCount === 1 ? 'Review' : 'Reviews'}`
                : 'Verified Rating';
            const providerName = provider.fullName || `${provider.firstName || 'Care'} ${provider.lastName || 'Provider'}`.trim();
            const avatarSeed = providerName;
            const serviceTags = Array.isArray(provider.servicesProvided) && provider.servicesProvided.length > 0
              ? provider.servicesProvided
              : ['Care Services'];
            const languageTags = Array.isArray(provider.spokenLanguages) && provider.spokenLanguages.length > 0
              ? provider.spokenLanguages
              : ['English'];
            const specializationTags = Array.isArray(provider.specializations) && provider.specializations.length > 0
              ? provider.specializations
              : [provider.specialty || 'Care Provider'];
            const currentSlots = getCurrentDayAvailability(provider.availability);
            const availabilityText = currentSlots.length
              ? `${todayLabel}: ${currentSlots.map((slot) => formatSlotLabel(slot)).join(', ')}`
              : `${todayLabel}: No availability`;
            const weeklyAvailability = getWeeklyAvailability(provider.availability);
            const availableDaysCount = weeklyAvailability.filter((entry) => entry.slots.length > 0).length;
            const isExpanded = expandedProviderId === providerId;
            const providerBio = provider.bio || provider.professionalBio || 'No biography details provided yet.';
            const certificateStatus = provider.pswCertificateStatus || 'pending';
            const backgroundCheckStatus = provider.backgroundCheckStatus || 'pending';
            const bookingSettings = provider.bookingSettings || {};

            return (
              <div
                key={providerId}
                className={`bg-white p-10 rounded-[2.5rem] border flex flex-col md:flex-row items-center relative overflow-hidden group transition-all duration-500 shadow-[0_20px_60px_rgba(0,0,0,0.02)] ${
                  isSelected
                    ? 'border-[#5915BD] bg-[#F9F7FF] shadow-[0_30px_70px_rgba(89,21,189,0.08)]'
                    : 'border-gray-50 hover:border-[#5915BD] hover:shadow-[0_30px_70px_rgba(89,21,189,0.08)]'
                }`}
              >
                {index === 0 && (
                  <div className="absolute top-0 left-10 bg-[#5915BD] px-5 py-2 rounded-b-2xl text-[9px] font-bold text-white uppercase tracking-[0.2em] shadow-lg shadow-purple-100 z-10">
                    Primary Choice
                  </div>
                )}

                {isSelected && (
                  <div className="absolute top-4 right-10 text-purple-600">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  </div>
                )}

                <div className="flex-shrink-0 relative mb-8 md:mb-0">
                  <button
                    type="button"
                    onClick={() => setProfileProvider(provider)}
                    className="w-32 h-32 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl relative group-hover:scale-105 transition-transform duration-500 focus:outline-none focus:ring-4 focus:ring-purple-100"
                    aria-label={`View profile for ${providerName}`}
                  >
                    {provider.photoUrl ? (
                      <img src={provider.photoUrl} className="w-full h-full object-cover" alt={providerName} />
                    ) : (
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(avatarSeed)}`} className="w-full h-full object-cover" alt={providerName} />
                    )}
                  </button>
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-8 h-8 rounded-2xl border-4 border-white flex items-center justify-center shadow-lg text-white">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                  </div>
                </div>

                <div className="md:ml-10 flex-1 w-full text-center md:text-left">
                  <div className="flex flex-col md:flex-row items-center md:items-baseline gap-3 mb-2">
                    <button
                      type="button"
                      onClick={() => setProfileProvider(provider)}
                      className="text-2xl font-bold text-gray-900 font-serif text-left hover:text-[#5915BD] transition-colors"
                    >
                      {providerName}
                    </button>
                    <span className="bg-emerald-50 text-emerald-600 text-[8px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-100 flex items-center shadow-sm">
                      Clinical Verified
                    </span>
                  </div>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-6">
                    {provider.specializations?.[0] || 'Care Provider'}
                  </p>

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

                  <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">
                    {serviceTags.slice(0, 2).map((tag) => (
                      <span key={tag} className="bg-[#F9F7FF] text-[#5915BD] text-[9px] font-bold px-4 py-2 rounded-xl border border-purple-50/50">
                        {tag}
                      </span>
                    ))}
                    {languageTags.slice(0, 2).map((tag) => (
                      <span key={`${tag}-language`} className="bg-gray-50 text-gray-600 text-[9px] font-bold px-4 py-2 rounded-xl border border-gray-100">
                        {tag}
                      </span>
                    ))}
                    <span className="bg-gray-50 text-gray-600 text-[9px] font-bold px-4 py-2 rounded-xl border border-gray-100">
                      {provider.yearsOfExperience || 0} yrs experience
                    </span>
                  </div>

                  <div className="mb-4 rounded-2xl bg-[#F9F7FF] border border-purple-50 px-4 py-3 text-left">
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#5915BD]">{availabilityText}</p>
                    <button
                      type="button"
                      onClick={() => setExpandedProviderId(isExpanded ? null : providerId)}
                      className="mt-3 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#5915BD]"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                      {isExpanded ? 'Hide weekly availability' : 'View weekly availability'}
                    </button>
                    {isExpanded && (
                      <div className="mt-4 grid gap-2">
                        {weeklyAvailability.map((entry) => (
                          <div key={entry.dayKey} className="flex flex-wrap items-start justify-between gap-3 rounded-xl bg-white px-3 py-2 border border-gray-100">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-700">{entry.dayLabel}</span>
                            <span className="text-[10px] text-gray-500">
                              {entry.slots.length ? entry.slots.map((slot) => formatSlotLabel(slot)).join(' • ') : 'Unavailable'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest flex items-center justify-center md:justify-start">
                    <span className="w-2 h-2 rounded-full bg-[#5915BD] mr-3 animate-pulse"></span>
                    Next Session: <span className="text-[#5915BD] ml-2">Available Today</span>
                  </p>
                </div>

                <div className="md:ml-10 w-full md:w-auto text-center md:text-right md:border-l border-gray-50 md:pl-10 pt-10 md:pt-0">
                  <div className="mb-8">
                    <p className="text-3xl font-bold text-gray-900 leading-none">${formatRate(serviceHourlyRate)}</p>
                    <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-[0.2em] font-bold">Hourly Rate</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        onProviderSelect(provider);
                      }}
                      className="px-10 py-5 rounded-2xl font-bold text-[11px] uppercase tracking-widest shadow-xl transition-all active:scale-[0.98] bg-[#5915BD] text-white shadow-purple-200 hover:-translate-y-1"
                    >
                      {isSelected ? (
                        <span className="inline-flex items-center justify-center gap-2">
                          Selected
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                        </span>
                      ) : 'Select PSW'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setProfileProvider(provider)}
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
        <button
          type="button"
          onClick={selectedProvider ? onContinue : undefined}
          disabled={!selectedProvider}
          className={`px-12 py-5 rounded-[1.5rem] font-bold flex items-center text-[10px] uppercase tracking-widest shadow-sm transition-all group ${
            selectedProvider
              ? 'bg-[#5915BD] border border-[#5915BD] text-white hover:shadow-md'
              : 'bg-white border border-gray-100 text-gray-300 cursor-not-allowed'
          }`}
        >
          Continue <svg className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>

      {profileProvider && profileDetails && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 sm:p-6 backdrop-blur-sm"
          onClick={() => setProfileProvider(null)}
        >
          <div
            className="flex h-[calc(100dvh-1.5rem)] w-full max-w-5xl flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-2xl ring-1 ring-black/5 sm:h-auto sm:max-h-[calc(100dvh-3rem)] sm:rounded-[2.5rem]"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="provider-profile-title"
          >
            <div className="shrink-0 border-b border-gray-100 bg-gradient-to-r from-[#F9F7FF] to-white px-4 py-5 sm:px-8 sm:py-7">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-4 sm:gap-5">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-[1.5rem] border-4 border-white shadow-xl sm:h-20 sm:w-20 sm:rounded-[1.75rem]">
                    {profileProvider.photoUrl ? (
                      <img src={profileProvider.photoUrl} alt={profileProvider.fullName || 'Care provider'} className="h-full w-full object-cover" />
                    ) : (
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profileProvider.fullName || profileProvider.firstName || 'Provider')}`}
                        alt={profileProvider.fullName || 'Care provider'}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#5915BD]">Provider Profile</p>
                    <h3 id="provider-profile-title" className="mt-2 truncate text-2xl font-bold text-gray-900 font-serif sm:text-3xl">
                      {profileProvider.fullName || `${profileProvider.firstName || 'Care'} ${profileProvider.lastName || 'Provider'}`.trim()}
                    </h3>
                    <div className="mt-3 flex flex-wrap items-center gap-2 sm:gap-3">
                      <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                        Clinical Verified
                      </span>
                      <span className="rounded-full border border-purple-100 bg-purple-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#5915BD]">
                        {Array.isArray(profileProvider.specializations) && profileProvider.specializations[0] ? profileProvider.specializations[0] : 'Care Provider'}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        {Number(profileProvider.yearsOfExperience || 0)} yrs experience
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setProfileProvider(null)}
                  className="shrink-0 rounded-2xl border border-gray-100 bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-[#5915BD] hover:border-purple-100 sm:px-4 sm:py-3 sm:text-xs"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-6 sm:px-8 sm:py-8">
              <div className="grid gap-6 lg:grid-cols-[1.35fr_0.9fr] lg:gap-8">
              <div className="space-y-8">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-[1.5rem] border border-gray-100 bg-gray-50 p-5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Rating</p>
                    <p className="mt-2 text-2xl font-bold text-gray-900">{Number(profileProvider.rating || 0) > 0 ? Number(profileProvider.rating).toFixed(1) : 'New'}</p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      {Number(profileProvider.ratingCount || 0) > 0 ? `${profileProvider.ratingCount} Reviews` : 'Verified Rating'}
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] border border-gray-100 bg-gray-50 p-5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Today</p>
                    <p className="mt-2 text-2xl font-bold text-gray-900">{profileDetails.currentSlots.length}</p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">Open slots</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-gray-100 bg-gray-50 p-5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Coverage</p>
                    <p className="mt-2 text-2xl font-bold text-gray-900">{profileDetails.availableDaysCount}/7</p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">Available days</p>
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-gray-100 bg-white p-6 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-gray-400">Clinical Bio</p>
                  <p className="mt-3 text-sm leading-7 text-gray-600">{profileDetails.providerBio}</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.75rem] border border-gray-100 bg-white p-6 shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-gray-400">Clearance</p>
                    <div className="mt-4 space-y-3">
                      {[
                        ['PSW certificate', profileDetails.certificateStatus],
                        ['Background check', profileDetails.backgroundCheckStatus],
                      ].map(([label, value]) => (
                        <div key={label} className="flex items-center justify-between gap-4 rounded-2xl bg-gray-50 px-4 py-3">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">{label}</span>
                          <span className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${getStatusTone(value)}`}>
                            {normalizeStatusLabel(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[1.75rem] border border-gray-100 bg-white p-6 shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-gray-400">Booking Rules</p>
                    <div className="mt-4 space-y-3 text-sm text-gray-600">
                      <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Minimum notice</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#5915BD]">
                          {profileDetails.bookingSettings.minimumNoticeHours ? `${profileDetails.bookingSettings.minimumNoticeHours} hrs` : '24 hrs'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Auto confirm</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#5915BD]">
                          {profileDetails.bookingSettings.autoConfirm ? 'Enabled' : 'Manual review'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-gray-400">Services & Languages</p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-gray-400">
                      {profileDetails.serviceTags.length} services · {profileDetails.languageTags.length} languages
                    </p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {profileDetails.serviceTags.map((tag) => (
                      <span key={tag} className="rounded-xl border border-purple-50 bg-[#F9F7FF] px-4 py-2 text-[9px] font-bold uppercase tracking-widest text-[#5915BD]">
                        {tag}
                      </span>
                    ))}
                    {profileDetails.languageTags.map((tag) => (
                      <span key={tag} className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-2 text-[9px] font-bold uppercase tracking-widest text-gray-600">
                        {tag}
                      </span>
                    ))}
                    {profileDetails.specializationTags.map((tag) => (
                      <span key={tag} className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2 text-[9px] font-bold uppercase tracking-widest text-emerald-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-gray-400">Your Sessions With This Provider</p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#5915BD]">
                      {providerBookings.length} {providerBookings.length === 1 ? 'booking' : 'bookings'}
                    </p>
                  </div>

                  {isLoadingBookings ? (
                    <p className="mt-4 text-sm text-gray-500">Loading your booking history...</p>
                  ) : providerBookings.length === 0 ? (
                    <p className="mt-4 rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-5 text-sm text-gray-500">
                      You have not booked a session with this provider yet.
                    </p>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {providerBookings.map((booking) => {
                        const statusStyles = getAppointmentStatusStyles(booking.status);
                        const bookingId = booking._id || booking.id;

                        return (
                          <div key={bookingId} className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-gray-900">{booking.service || 'Care Session'}</p>
                                <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                  {booking.date || 'Date pending'}{booking.time ? ` · ${booking.time}` : ''}
                                </p>
                                {booking.duration ? (
                                  <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                    Duration: {booking.duration} min
                                  </p>
                                ) : null}
                              </div>
                              <span className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${statusStyles.badgeClass}`}>
                                {statusStyles.label}
                              </span>
                            </div>
                            {booking.notes ? (
                              <p className="mt-3 border-t border-gray-100 pt-3 text-xs leading-6 text-gray-500">{booking.notes}</p>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-[1.75rem] border border-gray-100 bg-[#F9F7FF] p-6 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#5915BD]">Availability</p>
                  <p className="mt-3 text-sm font-semibold text-gray-900">{todayLabel} schedule</p>
                  <div className="mt-4 space-y-3">
                    <div className="rounded-2xl bg-white px-4 py-3 text-sm text-gray-700">
                      {profileDetails.currentSlots.length ? profileDetails.currentSlots.map((slot) => formatSlotLabel(slot)).join(' · ') : 'No availability today'}
                    </div>
                    {profileDetails.weeklyAvailability.map((entry) => (
                      <div key={entry.dayKey} className="flex items-start justify-between gap-4 rounded-2xl bg-white px-4 py-3 border border-purple-50">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-700">{entry.dayLabel}</span>
                        <span className="text-[10px] text-gray-500 text-right">
                          {entry.slots.length ? entry.slots.map((slot) => formatSlotLabel(slot)).join(' · ') : 'Unavailable'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-gray-100 bg-white p-6 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-gray-400">Quick Action</p>
                  <button
                    type="button"
                    onClick={() => {
                      onProviderSelect(profileProvider);
                      setProfileProvider(null);
                    }}
                    className="mt-4 w-full rounded-2xl px-5 py-4 text-[10px] font-bold uppercase tracking-[0.24em] shadow-lg transition-all bg-[#5915BD] text-white shadow-purple-100 hover:-translate-y-0.5"
                  >
                    {profileDetails.isSelected ? (
                      <span className="inline-flex items-center justify-center gap-2">
                        Selected
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                      </span>
                    ) : 'Select This Provider'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setProfileProvider(null)}
                    className="mt-3 w-full rounded-2xl border border-gray-100 bg-white px-5 py-4 text-[10px] font-bold uppercase tracking-[0.24em] text-gray-500 hover:border-purple-100 hover:text-[#5915BD]"
                  >
                    Back to results
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
  );
};

export default BookingStep2;
