import React, { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { ProviderProfileFormData } from '../../../types/profile';
import { 
  HiOutlineLocationMarker, 
  HiOutlineLightBulb, 
} from 'react-icons/hi';
import { MdMyLocation } from 'react-icons/md';
import { clsx } from 'clsx';

interface ProviderLocationDetailsProps {
  formData: ProviderProfileFormData;
  setFormData: Dispatch<SetStateAction<ProviderProfileFormData>>;
}

const ProviderLocationDetails: React.FC<ProviderLocationDetailsProps> = ({ formData, setFormData }) => {
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [searchQuery, setSearchQuery] = useState(
    [formData.streetAddress, formData.city].filter(Boolean).join(', ') || 'Canada'
  );

  const getClientsNearby = (radius: number) => {
    if (radius === 0) return 0;
    return Math.floor(radius * 13.6);
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          
          if (data && data.address) {
            const addr = data.address;
            const street = addr.road || addr.pedestrian || addr.path || addr.suburb || '';
            const majorCity = addr.city || addr.town || addr.municipality || addr.state || '';
            const province = addr.state_code || addr.state || '';
            const postalCode = addr.postcode || '';

            setFormData({
              ...formData,
              streetAddress: street,
              city: majorCity,
              province: province,
              postalCode: postalCode
            });
            
            const cleanSearch = [street, majorCity].filter(Boolean).join(', ');
            setSearchQuery(cleanSearch);
          }
        } catch (error) {
          console.error("Geocoding error:", error);
        } finally {
          setIsLoadingLocation(false);
        }
      },
      () => {
        alert("Unable to retrieve location");
        setIsLoadingLocation(false);
      }
    );
  };

  const handleUpdateMap = () => {
    const newQuery = [formData.streetAddress, formData.city].filter(Boolean).join(', ');
    if (newQuery) setSearchQuery(newQuery);
  };

  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(searchQuery)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="flex flex-col w-full h-full">
      {/* Title Section - Internal Padding */}
      <div className="p-6 sm:p-10 md:p-14 pb-8 sm:pb-10 space-y-3 sm:space-y-4">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 font-playfair tracking-tight leading-tight">Where are you based?</h3>
        <p className="text-sm sm:text-base text-gray-500 font-medium leading-relaxed font-dm">
          Your location and service radius determine which clients can find and book you.
        </p>
      </div>

      {/* Map Section - Edge-to-Edge */}
      <div className="relative h-[250px] sm:h-[350px] md:h-[400px] w-full bg-gray-50">
        <iframe
          key={searchQuery}
          title="Location Map"
          width="100%"
          height="100%"
          frameBorder="0"
          src={mapUrl}
          className="contrast-[1.1] brightness-[1.02]"
        />
        
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6">
          <button 
            onClick={handleCurrentLocation}
            disabled={isLoadingLocation}
            className={clsx(
              "size-10 sm:size-12 md:size-14 bg-primary text-white rounded-xl sm:rounded-2xl shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 duration-300 active:scale-95 group z-10",
              isLoadingLocation && "animate-pulse"
            )}
          >
            <MdMyLocation className="size-5 sm:size-6 md:size-7 group-hover:rotate-12 duration-300" />
          </button>
        </div>
      </div>

      {/* Settings Section - Internal Padding */}
      <div className="p-5 sm:p-10 md:p-14 space-y-10 sm:space-y-14">
        
        {/* Radius Selection */}
        <div className="space-y-5 sm:space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 font-dm">Service Radius</h3>
            <div className="px-3 sm:px-5 py-1 sm:py-2 bg-primary/5 text-primary rounded-lg sm:rounded-xl font-black text-xs sm:text-base md:text-lg">
              {formData.serviceRadius || 25} km
            </div>
          </div>
          
          <div className="relative pt-4 sm:pt-6">
            <input 
              type="range" 
              min="5" 
              max="100" 
              step="5"
              value={formData.serviceRadius || 25} 
              onChange={(e) => setFormData({ ...formData, serviceRadius: parseInt(e.target.value) })}
              className="w-full h-2 sm:h-2.5 bg-gray-100 rounded-full appearance-none cursor-pointer 
              [&::-webkit-slider-thumb]:appearance-none 
              [&::-webkit-slider-thumb]:size-6 sm:[&::-webkit-slider-thumb]:size-8 
              [&::-webkit-slider-thumb]:bg-white 
              [&::-webkit-slider-thumb]:border-[3px] sm:[&::-webkit-slider-thumb]:border-[4px] 
              [&::-webkit-slider-thumb]:border-primary 
              [&::-webkit-slider-thumb]:rounded-full 
              [&::-webkit-slider-thumb]:shadow-xl 
              [&::-webkit-slider-thumb]:hover:scale-110 
              [&::-webkit-slider-thumb]:duration-300
              [&::-moz-range-thumb]:size-6 sm:[&::-moz-range-thumb]:size-8 
              [&::-moz-range-thumb]:bg-white 
              [&::-moz-range-thumb]:border-[3px] sm:[&::-moz-range-thumb]:border-[4px] 
              [&::-moz-range-thumb]:border-primary 
              [&::-moz-range-thumb]:rounded-full 
              [&::-moz-range-thumb]:shadow-xl 
              [&::-moz-range-thumb]:hover:scale-110 
              [&::-moz-range-thumb]:duration-300"
              style={{
                background: `linear-gradient(to right, #6a0dad 0%, #6a0dad ${(formData.serviceRadius - 5) / 95 * 100}%, #f3f4f6 ${(formData.serviceRadius - 5) / 95 * 100}%, #f3f4f6 100%)`
              }}
            />
            <div className="flex justify-between mt-3 sm:mt-5 text-[10px] sm:text-xs font-black text-gray-400 font-dm uppercase tracking-[0.1em] sm:tracking-[0.2em]">
              <span>5 km</span>
              <span>100 km</span>
            </div>
          </div>
        </div>

        {/* Address Fields */}
        <div className="space-y-6 sm:space-y-8">
          <div className="space-y-2 sm:space-y-3">
            <label className="text-[10px] sm:text-xs md:text-sm font-black text-gray-900 font-dm uppercase tracking-widest">Street Address</label>
            <div className="relative group">
              <HiOutlineLocationMarker className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 size-5 sm:size-6 text-primary" />
              <input
                type="text"
                placeholder="123 Queen St."
                value={formData.streetAddress || ''}
                onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                onBlur={handleUpdateMap}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl sm:rounded-2xl py-4 sm:py-6 pl-12 sm:pl-16 pr-4 sm:pr-6 font-bold text-gray-900 outline-none focus:border-primary/20 focus:ring-4 focus:ring-primary/5 duration-300 font-dm text-sm sm:text-base md:text-lg shadow-sm hover:border-gray-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            <div className="space-y-2 sm:space-y-3">
              <label className="text-[10px] sm:text-xs md:text-sm font-black text-gray-900 font-dm uppercase tracking-widest">City</label>
              <input
                type="text"
                placeholder="Toronto"
                value={formData.city || ''}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                onBlur={handleUpdateMap}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl sm:rounded-2xl py-4 sm:py-5 px-5 sm:px-6 font-bold text-gray-900 outline-none focus:border-primary/20 focus:ring-4 focus:ring-primary/5 duration-300 font-dm text-sm sm:text-base shadow-sm hover:border-gray-200"
              />
            </div>
            <div className="space-y-2 sm:space-y-3">
              <label className="text-[10px] sm:text-xs md:text-sm font-black text-gray-900 font-dm uppercase tracking-widest">Province</label>
              <input
                type="text"
                placeholder="ON"
                value={formData.province || ''}
                onChange={(e) => setFormData({ ...formData, province: e.target.value.toUpperCase() })}
                onBlur={handleUpdateMap}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl sm:rounded-2xl py-4 sm:py-5 px-5 sm:px-6 font-bold text-gray-900 outline-none focus:border-primary/20 focus:ring-4 focus:ring-primary/5 duration-300 font-dm uppercase text-sm sm:text-base shadow-sm hover:border-gray-200"
              />
            </div>
            <div className="space-y-2 sm:space-y-3">
              <label className="text-[10px] sm:text-xs md:text-sm font-black text-gray-900 font-dm uppercase tracking-widest">Postal Code</label>
              <input
                type="text"
                placeholder="A1B 2C3"
                value={formData.postalCode || ''}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value.toUpperCase() })}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl sm:rounded-2xl py-4 sm:py-5 px-5 sm:px-6 font-bold text-gray-900 outline-none focus:border-primary/20 focus:ring-4 focus:ring-primary/5 duration-300 font-dm uppercase text-sm sm:text-base shadow-sm hover:border-gray-200"
              />
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-cyan-50/40 border border-cyan-100 p-5 sm:p-7 rounded-xl sm:rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <div className="size-10 sm:size-12 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-cyan-100 flex items-center justify-center shrink-0">
            <HiOutlineLightBulb className="size-6 sm:size-7 text-cyan-500" />
          </div>
          <div className="space-y-0.5 sm:space-y-1">
             <h5 className="text-cyan-900 font-bold font-dm text-xs sm:text-sm">Visibility Tip</h5>
             <p className="text-[10px] sm:text-sm text-cyan-800 font-medium font-dm leading-relaxed">
              ~{getClientsNearby(formData.serviceRadius || 25)} families are looking for care in your area. A 25km+ radius is recommended for optimal matching.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderLocationDetails;
