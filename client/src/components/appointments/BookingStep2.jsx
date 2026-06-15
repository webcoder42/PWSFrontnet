import React, { useEffect, useMemo, useState } from 'react';
import { formatRate, getServiceHourlyRate } from '../../utils/servicePricing';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const formatProvider = (provider) => ({
  ...provider,
  fullName: provider.fullName || `${provider.firstName || ''} ${provider.lastName || ''}`.trim() || 'Care Provider',
  rating: Number(provider.rating) || 0,
  ratingCount: Number(provider.ratingCount) || 0,
  spokenLanguages: Array.isArray(provider.spokenLanguages) && provider.spokenLanguages.length ? provider.spokenLanguages : ['English'],
  specializations: Array.isArray(provider.specializations) && provider.specializations.length ? provider.specializations : ['Personal Care Specialist'],
  yearsOfExperience: Number(provider.yearsOfExperience) || 5,
  availability: provider.availability || { monday: ['Availability soon'] },
});

const BookingStep2 = ({ selectedService, selectedProvider, onProviderSelect, onBack, onContinue }) => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const fetchProviders = async () => {
      setLoading(true);
      setError('');

      try {
        const serviceQuery = selectedService?.name ? `?service=${encodeURIComponent(selectedService.name)}` : '';
        const response = await fetch(`${API_BASE_URL}/auth/providers${serviceQuery}`);
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.message || 'Failed to fetch providers');
        }

        const data = Array.isArray(payload.data) ? payload.data.map(formatProvider) : [];

        if (!cancelled) {
          setProviders(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError('No providers are available right now. Please try again in a moment.');
          setProviders([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProviders();

    return () => {
      cancelled = true;
    };
  }, [selectedService]);

  const activeProvider = selectedProvider || providers[0];
  const serviceHourlyRate = useMemo(
    () => getServiceHourlyRate(selectedService),
    [selectedService]
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-3 font-serif tracking-tight">Choose a Care Provider</h2>
        <div className="flex items-center text-xs font-bold text-purple-600 uppercase tracking-widest bg-purple-50 px-4 py-2 rounded-xl w-fit border border-purple-100">
          Step 02 <span className="mx-2 opacity-30 text-gray-400">·</span> <span className="text-gray-400">Elite Caregiver Selection</span>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-md p-4 rounded-[2rem] border border-gray-50 mb-10 flex flex-wrap gap-4 items-center shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
        {['Availability', 'Rating', 'Gender', 'Language'].map(filter => (
          <button key={filter} className="bg-white px-6 py-3 rounded-2xl text-[10px] font-bold text-gray-700 uppercase tracking-widest border border-gray-100 flex items-center shadow-sm hover:border-purple-200 transition-all">
            {filter}
            <svg className="w-3.5 h-3.5 ml-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"/></svg>
          </button>
        ))}
        <button className="ml-auto text-purple-600 text-[10px] font-bold uppercase tracking-widest px-4 py-2 hover:bg-purple-50 rounded-xl transition-all">Reset All</button>
      </div>

      <div className="flex justify-between items-center mb-8 px-2">
        <div className="flex items-center space-x-3">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sort by:</span>
          <div className="flex bg-gray-50/50 p-1 rounded-xl border border-gray-25">
            {['Best Match', 'Rating', 'Experience'].map(sort => (
              <button key={sort} className={`px-6 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${
                sort === 'Best Match' ? 'bg-white text-purple-600 shadow-sm border border-gray-50' : 'text-gray-400 hover:text-gray-600'
              }`}>
                {sort}
              </button>
            ))}
          </div>
        </div>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest opacity-70">{providers.length} Provider{providers.length === 1 ? '' : 's'} Available</p>
      </div>

      {error && <p className="mb-6 text-sm text-amber-600">{error}</p>}

      {loading ? (
        <div className="rounded-[2rem] border border-gray-100 bg-white px-8 py-12 text-center shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
          <p className="text-sm font-semibold text-gray-700">Loading real providers...</p>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-gray-400">Fetching from your backend</p>
        </div>
      ) : providers.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-gray-200 bg-white px-8 py-12 text-center shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
          <p className="text-sm font-semibold text-gray-700">No providers are available right now.</p>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-gray-400">Please try again after the backend has providers synced.</p>
        </div>
      ) : (
      <div className="space-y-8">
        {providers.map((provider, index) => {
          const isSelected = activeProvider?._id === provider._id;
          const tags = [...(provider.specializations || ['Personal Care Specialist']).slice(0, 2)];
          if (!provider.spokenLanguages?.length) {
            tags.push('English');
          }
          if (provider.yearsOfExperience) {
            tags.push(`${provider.yearsOfExperience}+ yrs experience`);
          }

          const displayRating = Number(provider.rating) || 0;
          const ratingLabel = displayRating > 0 ? displayRating.toFixed(1) : 'New';
          const ratingCount = Number(provider.ratingCount) || 0;
          const ratingSubLabel =
            ratingCount > 0
              ? `${ratingCount} ${ratingCount === 1 ? 'Review' : 'Reviews'}`
              : 'Clinical Review Score';

          return (
            <div key={provider._id} className={`bg-white p-10 rounded-[2.5rem] border flex flex-col md:flex-row items-center relative overflow-hidden group hover:border-[#5915BD] transition-all duration-500 shadow-[0_20px_60px_rgba(0,0,0,0.02)] ${isSelected ? 'border-[#5915BD] shadow-[0_30px_70px_rgba(89,21,189,0.08)]' : 'border-gray-50 hover:shadow-[0_30px_70px_rgba(89,21,189,0.08)]'}`}>
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
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-6">Personal Support Worker</p>

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
                  Next Session: <span className="text-[#5915BD] ml-2">{provider.availability?.monday?.[0] || 'Availability soon'}</span>
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
                    className={`px-10 py-5 rounded-2xl font-bold text-[11px] uppercase tracking-widest transition-all active:scale-[0.98] ${isSelected ? 'bg-[#5915BD] text-white shadow-xl shadow-purple-200 hover:-translate-y-1' : 'bg-white border border-gray-100 text-[#5915BD] hover:border-purple-100'}`}
                  >
                    {isSelected ? 'Selected' : 'Secure Booking'}
                  </button>
                  <button onClick={() => onProviderSelect(provider)} className="py-4 text-[#5915BD] text-[9px] font-bold uppercase tracking-widest hover:bg-purple-50 rounded-2xl transition-all border border-transparent hover:border-purple-50">
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
        <button onClick={onContinue} disabled={!activeProvider} className={`px-12 py-5 rounded-[1.5rem] font-bold flex items-center text-[10px] uppercase tracking-widest shadow-sm transition-all group ${activeProvider ? 'bg-white border border-gray-100 text-[#5915BD] hover:shadow-md' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
          {activeProvider ? 'Continue' : 'Select a Provider'} <svg className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  );
};

export default BookingStep2;
