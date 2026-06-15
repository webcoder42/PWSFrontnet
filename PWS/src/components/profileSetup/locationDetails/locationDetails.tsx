import React, { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { clsx } from 'clsx';
import { HiLocationMarker } from 'react-icons/hi';
import type { ProfileFormData } from '../../../types/profile';

interface LocationDetailsProps {
  formData: ProfileFormData;
  setFormData: Dispatch<SetStateAction<ProfileFormData>>;
  isFamilyMember?: boolean;
}

const LocationDetails: React.FC<LocationDetailsProps> = ({ formData, setFormData, isFamilyMember }) => {
  const [isLocating, setIsLocating] = useState(false);

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();

          if (data && data.address) {
            const address = data.address;
            setFormData((prev: ProfileFormData) => ({
              ...prev,
              streetAddress: address.road ? `${address.house_number || ''} ${address.road}`.trim() : prev.streetAddress,
              city: address.city || address.town || address.village || prev.city,
              province: address.state || address.province || prev.province,
              postalCode: address.postcode || prev.postalCode
            }));
          }
        } catch (error) {
          console.error("Error fetching location data", error);
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert('Unable to retrieve your location. Please check your browser permissions.');
        setIsLocating(false);
      }
    );
  };

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h3 className="text-xl sm:text-3xl font-bold text-gray-900 font-playfair tracking-tight leading-tight">{isFamilyMember ? "Where are they located?" : "Where are you located?"}</h3>
        <p className="text-sm sm:text-lg text-gray-400 font-medium leading-relaxed font-dm text-balance">We use {isFamilyMember ? "their" : "your"} location to find the nearest available PSWs and optimize care schedule.</p>
      </div>

      <div className="space-y-8">
        <div className="relative w-full h-40 sm:h-56 bg-gray-100 rounded-xl md:rounded-2xl overflow-hidden border border-primary/10 shadow-inner group">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2886.4384984501614!2d-79.3870568!3d43.653226!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b34d2a33d602f%3A0xdf1690069f1bd2c9!2sToronto%2C%20ON!5e0!3m2!1sen!2sca!4v1700000000000!5m2!1sen!2sca"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 grayscale contrast-125 opacity-90 group-hover:grayscale-0 group-hover:opacity-100 duration-500"
          ></iframe>

          <button
            onClick={handleCurrentLocation}
            disabled={isLocating}
            className={clsx(
              'absolute bottom-5 right-5 bg-white px-4 sm:px-5 py-2 sm:py-3 rounded-full shadow-lg shadow-gray-200/50 text-xs sm:text-sm font-bold text-gray-700 flex items-center gap-2 hover:shadow-xl hover:scale-105 duration-300 active:scale-95 font-dm z-10 border border-gray-100/50',
              isLocating && 'opacity-75 cursor-not-allowed'
            )}
          >
            <span>{isLocating ? 'Locating...' : 'Use current location'}</span>
            <HiLocationMarker className={clsx("size-4", isLocating ? "text-gray-400 animate-pulse" : "text-red-500")} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-dm font-bold text-gray-900 uppercase tracking-widest ml-1 opacity-60">Street address</label>
            <input
              type="text"
              placeholder={isFamilyMember ? "Enter their street address" : "Enter your street address"}
              value={formData.streetAddress}
              onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
              className="mt-2 w-full bg-white border-2 border-primary/10 rounded-xl md:rounded-2xl p-4 sm:p-5 outline-none focus:border-primary duration-300 text-gray-900 font-medium placeholder:text-gray-300 text-sm sm:text-base"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-dm font-bold text-gray-900 uppercase tracking-widest ml-1 opacity-60">Postal code</label>
            <input
              type="text"
              placeholder="A1B 2C3"
              value={formData.postalCode}
              onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
              className="mt-2 w-full bg-white border-2 border-primary/10 rounded-xl md:rounded-2xl p-4 sm:p-5 outline-none focus:border-primary duration-300 text-gray-900 font-medium placeholder:text-gray-300 text-sm sm:text-base"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-dm font-bold text-gray-900 uppercase tracking-widest ml-1 mb-2 opacity-60">City</label>
              <input
                type="text"
                placeholder="Toronto"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="mt-2 w-full bg-white border-2 border-primary/10 rounded-xl md:rounded-2xl p-4 sm:p-5 outline-none focus:border-primary duration-300 text-gray-900 font-medium placeholder:text-gray-300 text-sm sm:text-base"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-dm font-bold text-gray-900 uppercase tracking-widest ml-1 opacity-60">Province</label>
              <input
                type="text"
                placeholder="ON"
                value={formData.province}
                onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                className="mt-2 w-full bg-white border-2 border-primary/10 rounded-xl md:rounded-2xl p-4 sm:p-5 outline-none focus:border-primary duration-300 text-gray-900 font-medium placeholder:text-gray-300 text-sm sm:text-base"
              />
            </div>
          </div>
        </div>

        <div className="bg-surface-alt rounded-2xl p-4 sm:p-5 flex items-center gap-4 border border-primary/10">
          <div className="bg-primary/5 p-2 rounded-full shrink-0">
            <HiLocationMarker className="size-5 text-primary" />
          </div>
          <p className="text-xs sm:text-sm text-primary font-bold font-dm leading-relaxed">
            PSWs within 25km of {isFamilyMember ? "their" : "your"} address will be shown. You can adjust this range in Settings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LocationDetails;
