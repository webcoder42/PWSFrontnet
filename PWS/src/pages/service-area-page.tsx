import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineLocationMarker,
  HiOutlineLightBulb,
  HiCheck,
  HiCheckCircle,
} from 'react-icons/hi';
import { MdMyLocation } from 'react-icons/md';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { clsx } from 'clsx';

import DashboardSidebar from '../components/dashboard/dashboardSidebar/dashboardSidebar';
import DashboardHeader from '../components/dashboard/dashboardHeader/dashboardHeader';
import SettingsHeader from '../components/dashboard/settings/settingsHeader/settingsHeader';
import { geocodeLocation, useProviderPreferences } from '../hooks/useProviderPreferences';

// Fix Leaflet default icon issue with bundlers
import 'leaflet/dist/leaflet.css';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });

const DEFAULT_CENTER: [number, number] = [43.7315, -79.7624];

// Custom home/store marker icon (teardrop arrow shape)
const homeIcon = L.divIcon({
  className: '',
  html: `<div style="
    width: 36px; height: 36px;
    background: #EF4444;
    border: 3px solid white;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    box-shadow: 0 2px 10px rgba(239,68,68,0.4);
    display: flex; align-items: center; justify-content: center;
  ">
    <span style="transform: rotate(45deg); color: white; font-size: 16px; font-weight: bold;">&#8593;</span>
  </div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -40],
});

function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function FlyToCenter({ center }: { center: [number, number] }) {
  const map = useMap();
  map.flyTo(center, map.getZoom(), { duration: 1 });
  return null;
}

const ServiceAreaPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { rawUser, providerProfile, address, saveProviderProfile } = useProviderPreferences();
  const [radius, setRadius] = useState(15);
  const [location, setLocation] = useState('Brampton, ON');
  const [searchQuery, setSearchQuery] = useState('Brampton, ON');
  const [markerPos, setMarkerPos] = useState<[number, number]>(DEFAULT_CENTER);
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [homePos, setHomePos] = useState<[number, number] | null>(null);
  const [homeLabel, setHomeLabel] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    const savedRadius = Number(providerProfile.serviceRadiusKm);
    if (!Number.isNaN(savedRadius) && savedRadius > 0) {
      setRadius(savedRadius);
    }

    const city = typeof address.city === 'string' ? address.city : '';
    const province = typeof address.province === 'string' ? address.province : '';
    const street = typeof address.street === 'string' ? address.street : '';
    const label = [street, city, province].filter(Boolean).join(', ') || `${city}, ${province}`.replace(/^, |, $/g, '');
    if (label.trim()) {
      setLocation(label);
      setSearchQuery(label);
    }

    const coords = address?.geojson?.coordinates;
    if (Array.isArray(coords) && coords.length === 2) {
      const pos: [number, number] = [coords[1], coords[0]];
      setMarkerPos(pos);
      setMapCenter(pos);
    }

    // Extract home/store location from user's saved address
    const rawAddr = (rawUser?.address || {}) as Record<string, unknown>;
    const geoObj = rawAddr?.geojson as Record<string, unknown> | undefined;
    const storedCoords = geoObj?.coordinates as [number, number] | undefined;
    if (Array.isArray(storedCoords) && storedCoords.length === 2) {
      setHomePos([storedCoords[1], storedCoords[0]]);
    }
    const sStreet = typeof rawAddr.street === 'string' ? rawAddr.street : '';
    const sCity = typeof rawAddr.city === 'string' ? rawAddr.city : '';
    setHomeLabel([sStreet, sCity].filter(Boolean).join(', '));
  }, [providerProfile, address, rawUser]);

  const reverseGeocodeLatLng = useCallback(async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      if (data && data.address) {
        const addr = data.address;
        const houseNumber = addr.house_number || '';
        const roadName = addr.road || addr.pedestrian || addr.path || '';
        const street = [houseNumber, roadName].filter(Boolean).join(' ');
        const majorCity = addr.city || addr.town || addr.municipality || '';
        const state = addr.state || '';
        const parts: string[] = [];
        if (street) parts.push(street);
        if (majorCity) parts.push(majorCity);
        else if (state) parts.push(state);
        const cleanAddress = parts.join(', ') || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        setLocation(cleanAddress);
        setSearchQuery(cleanAddress);
      } else {
        setLocation(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        setSearchQuery(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      setLocation(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      setSearchQuery(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    }
  }, []);

  const handleMapClick = useCallback((lat: number, lng: number) => {
    setMarkerPos([lat, lng]);
    setMapCenter([lat, lng]);
    reverseGeocodeLatLng(lat, lng);
  }, [reverseGeocodeLatLng]);

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setMarkerPos([latitude, longitude]);
        setMapCenter([latitude, longitude]);
        await reverseGeocodeLatLng(latitude, longitude);
        setIsLoadingLocation(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Unable to retrieve your location. Please check your browser permissions.");
        setIsLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  const handleLocationChange = () => {
    if (location.trim()) {
      setSearchQuery(location);
      geocodeLocation(location).then((geo) => {
        if (geo?.coordinates) {
          const pos: [number, number] = [geo.coordinates[1], geo.coordinates[0]];
          setMarkerPos(pos);
          setMapCenter(pos);
        }
      });
    }
  };

  const handleConfirm = async () => {
    setIsSaving(true);
    try {
      const geocoded = await geocodeLocation(searchQuery || location);
      const existingStreet = typeof address.street === 'string' ? address.street : '';
      const existingPostal = typeof address.postalCode === 'string' ? address.postalCode : '';

      await saveProviderProfile(
        { serviceRadiusKm: radius },
        {
          address: {
            street: geocoded?.street || existingStreet || location,
            city: geocoded?.city || (typeof address.city === 'string' ? address.city : ''),
            province: geocoded?.province || (typeof address.province === 'string' ? address.province : ''),
            postalCode: geocoded?.postalCode || existingPostal,
            ...(geocoded
              ? {
                  geojson: {
                    type: 'Point',
                    coordinates: geocoded.coordinates,
                  },
                }
              : markerPos
                ? {
                    geojson: {
                      type: 'Point',
                      coordinates: [markerPos[1], markerPos[0]],
                    },
                  }
                : {}),
          },
        },
      );

      if (geocoded?.displayName) {
        setLocation(geocoded.displayName);
        setSearchQuery(geocoded.displayName);
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 5000);
    } catch (error) {
      console.error(error);
      alert('Could not save service area. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-surface-alt font-dm overflow-hidden">
      <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 lg:ml-72 flex flex-col h-screen overflow-hidden">
        <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} />

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-4 sm:p-8 lg:p-12 pb-24">


            <SettingsHeader
              title="Service Area"
              description="Please specify your preferred service area location you would like to work in."
              breadcrumbs={[
                { label: 'Settings', to: '/settings' },
                { label: 'Preferences', to: '/settings/preferences' },
                { label: 'Service Area' }
              ]}
              backTo="/settings/preferences"
              backLabel="Back to Preferences"
            />

            <div className="bg-white rounded-2xl sm:rounded-4xl border border-gray-100 shadow-sm overflow-hidden">

              <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[550px] w-full bg-gray-100">
                <MapContainer
                  key={`${mapCenter[0]}-${mapCenter[1]}`}
                  center={mapCenter}
                  zoom={13}
                  style={{ width: '100%', height: '100%' }}
                  doubleClickZoom={true}
                  scrollWheelZoom={true}
                  className="z-0"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MapClickHandler onMapClick={handleMapClick} />
                  <Marker
                    position={markerPos}
                    draggable={true}
                    ref={markerRef}
                    eventHandlers={{
                      dragend: () => {
                        const m = markerRef.current;
                        if (m) {
                          const pos = m.getLatLng();
                          setMarkerPos([pos.lat, pos.lng]);
                          setMapCenter([pos.lat, pos.lng]);
                          reverseGeocodeLatLng(pos.lat, pos.lng);
                        }
                      },
                    }}
                  />
                  {homePos && (
                    <Marker
                      position={homePos}
                      icon={homeIcon}
                      draggable={false}
                    >
                    </Marker>
                  )}
                  <FlyToCenter center={mapCenter} />
                </MapContainer>

                <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 md:bottom-10 md:right-10">
                  <button
                    onClick={handleCurrentLocation}
                    disabled={isLoadingLocation}
                    title="Click on the map to select a location, or use current location"
                    className={clsx(
                      "size-10 sm:size-12 md:size-14 bg-primary text-white rounded-xl sm:rounded-2xl shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 duration-300 active:scale-95 group z-[1000]",
                      isLoadingLocation && "animate-pulse"
                    )}
                  >
                    <MdMyLocation className="size-5 sm:size-6 md:size-7 group-hover:rotate-12 duration-300" />
                  </button>
                </div>
              </div>

                {homePos && (
                  <div className="flex items-center gap-6 px-5 sm:px-10 md:px-14 py-3 sm:py-4 bg-gray-50 border-b border-gray-100 text-[11px] sm:text-xs font-bold font-dm text-gray-500">
                    <div className="flex items-center gap-2">
                      <div className="size-3 rounded-full bg-primary border-2 border-white shadow-sm" />
                      <span>Service Area</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="size-3 rounded-sm bg-red-500 border-2 border-white shadow-sm" style={{ transform: 'rotate(45deg)' }} />
                      <span>Your Location{homeLabel ? ` (${homeLabel})` : ''}</span>
                    </div>
                  </div>
                )}

              <div className="p-5 sm:p-10 md:p-14 space-y-8 sm:space-y-12">

                {saveSuccess && (
                  <div className="bg-emerald-50 border border-emerald-100 p-4 sm:p-6 rounded-xl sm:rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 animate-in zoom-in duration-300">
                    <HiCheckCircle className="size-6 sm:size-8 text-emerald-500 shrink-0" />
                    <div className="space-y-0.5 sm:space-y-1">
                      <h4 className="text-emerald-900 font-bold font-dm text-sm sm:text-base">Area Updated</h4>
                      <p className="text-emerald-700 text-[10px] sm:text-sm font-medium font-dm leading-relaxed">Your service preferences have been saved successfully.</p>
                    </div>
                  </div>
                )}


                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 font-dm">Service Radius</h3>
                    <div className="px-3 sm:px-5 py-1 sm:py-2 bg-primary/5 text-primary rounded-lg sm:rounded-xl font-black text-xs sm:text-base md:text-lg">
                      {radius} km
                    </div>
                  </div>

                  <div className="relative pt-4 sm:pt-6">
                    <input
                      type="range"
                      min="5"
                      max="50"
                      value={radius}
                      onChange={(e) => setRadius(parseInt(e.target.value))}
                      className="w-full h-2 sm:h-2.5 bg-gray-100 rounded-full appearance-none cursor-pointer 
                        [&::-webkit-slider-thumb]:appearance-none 
                        [&::-webkit-slider-thumb]:size-5 sm:[&::-webkit-slider-thumb]:size-8 
                        [&::-webkit-slider-thumb]:bg-white 
                        [&::-webkit-slider-thumb]:border-[3px] sm:[&::-webkit-slider-thumb]:border-[4px] 
                        [&::-webkit-slider-thumb]:border-primary 
                        [&::-webkit-slider-thumb]:rounded-full 
                        [&::-webkit-slider-thumb]:shadow-xl 
                        [&::-webkit-slider-thumb]:hover:scale-110 
                        [&::-webkit-slider-thumb]:duration-300
                        [&::-moz-range-thumb]:size-5 sm:[&::-moz-range-thumb]:size-8 
                        [&::-moz-range-thumb]:bg-white 
                        [&::-moz-range-thumb]:border-[3px] sm:[&::-moz-range-thumb]:border-[4px] 
                        [&::-moz-range-thumb]:border-primary 
                        [&::-moz-range-thumb]:rounded-full 
                        [&::-moz-range-thumb]:shadow-xl 
                        [&::-moz-range-thumb]:hover:scale-110 
                        [&::-moz-range-thumb]:duration-300"
                      style={{
                        background: `linear-gradient(to right, #6a0dad 0%, #6a0dad ${(radius - 5) / 45 * 100}%, #f3f4f6 ${(radius - 5) / 45 * 100}%, #f3f4f6 100%)`
                      }}
                    />
                    <div className="flex justify-between mt-3 sm:mt-5 text-[9px] sm:text-[10px] md:text-xs font-black text-gray-400 font-dm uppercase tracking-[0.1em] sm:tracking-[0.2em]">
                      <span>5 km</span>
                      <span>50 km</span>
                    </div>
                  </div>
                </div>


                <div className="space-y-4 sm:space-y-5">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 font-dm">City/Location</h3>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <div className="flex-1 relative group">
                      <HiOutlineLocationMarker className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 size-5 sm:size-6 text-primary" />
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleLocationChange()}
                        placeholder="Search for a city or address..."
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl sm:rounded-2xl py-4 sm:py-6 pl-12 sm:pl-16 pr-4 sm:pr-6 font-bold text-gray-900 outline-none focus:border-primary/20 focus:ring-4 focus:ring-primary/5 duration-300 font-dm text-sm sm:text-base md:text-lg"
                      />
                    </div>
                    <button
                      onClick={handleLocationChange}
                      className="px-6 sm:px-10 py-4 sm:py-6 bg-primary/5 text-primary font-bold rounded-xl sm:rounded-2xl hover:bg-primary/10 duration-300 active:scale-95 text-base sm:text-lg"
                    >
                      Change
                    </button>
                  </div>
                </div>


                <div className="bg-cyan-50/40 border border-cyan-100 p-5 sm:p-6 rounded-xl sm:rounded-2xl flex gap-4 sm:gap-5">
                  <div className="size-10 sm:size-12 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-cyan-100 flex items-center justify-center shrink-0">
                    <HiOutlineLightBulb className="size-6 sm:size-7 text-cyan-500" />
                  </div>
                  <p className="text-[10px] sm:text-sm md:text-base text-cyan-900 font-medium font-dm leading-relaxed">
                    Click on the map to select your location, or drag the marker to fine-tune. Single click selects a location, double click zooms in. Your service radius determines how far you're willing to travel from your base location.
                  </p>
                </div>


                <div className="pt-2 sm:pt-4">
                  <button
                    onClick={handleConfirm}
                    disabled={isSaving || saveSuccess}
                    className={clsx(
                      "w-full py-4 sm:py-6 bg-gradient-primary text-white font-bold text-lg sm:text-xl md:text-2xl rounded-full shadow-2xl shadow-primary/30 hover:shadow-primary/40 hover:scale-[1.01] duration-300 active:scale-95 flex items-center justify-center gap-3 sm:gap-4",
                      (isSaving || saveSuccess) && "opacity-70 cursor-not-allowed"
                    )}
                  >
                    {isSaving ? (
                      <div className="size-5 sm:size-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : saveSuccess ? (
                      <HiCheckCircle className="size-6 sm:size-8" />
                    ) : (
                      <HiCheck className="size-6 sm:size-8" />
                    )}
                    {isSaving ? 'Updating...' : saveSuccess ? 'Success!' : 'Confirm Service Area'}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default ServiceAreaPage;
