import React from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { clsx } from 'clsx';
import { HiInformationCircle, HiOutlineIdentification } from 'react-icons/hi';
import { MdOutlineDirectionsCar, MdOutlineDirectionsBus, MdOutlinePedalBike } from 'react-icons/md';
import type { ProviderProfileFormData } from '../../../types/profile';

const PhysicalCapabilitiesOptions = [
  'Lift up to 50 lbs',
  'Assist with pivot transfers',
  'Operate mechanical lifts',
  'Push manual wheelchairs',
  'Stand for extended periods',
  'Comfortable climbing stairs'
];

interface ProviderCapabilitiesDetailsProps {
  formData: ProviderProfileFormData;
  setFormData: Dispatch<SetStateAction<ProviderProfileFormData>>;
}

const ProviderCapabilitiesDetails: React.FC<ProviderCapabilitiesDetailsProps> = ({ formData, setFormData }) => {

  const update = (field: Partial<ProviderProfileFormData>) => setFormData(prev => ({ ...prev, ...field }));

  const toggleCapability = (cap: string) => {
    const current = formData.physicalCapabilities || [];
    update({
      physicalCapabilities: current.includes(cap)
        ? current.filter(c => c !== cap)
        : [...current, cap]
    });
  };

  const heightUnit = formData.heightUnit ?? 'ft';
  const heightValue = formData.heightValue ?? 66;
  const weightUnit = formData.weightUnit ?? 'lbs';
  const weightValue = formData.weightValue ?? 150;

  const heightMin = heightUnit === 'ft' ? 48 : 120;
  const heightMax = heightUnit === 'ft' ? 84 : 215;
  const heightPct = ((heightValue - heightMin) / (heightMax - heightMin)) * 100;

  const weightMin = weightUnit === 'lbs' ? 80 : 35;
  const weightMax = weightUnit === 'lbs' ? 250 : 115;
  const weightPct = ((weightValue - weightMin) / (weightMax - weightMin)) * 100;

  const displayHeight = heightUnit === 'ft'
    ? `${Math.floor(heightValue / 12)}'${heightValue % 12}"`
    : `${heightValue} cm`;

  return (
    <div className="space-y-8 sm:space-y-10">
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-xl sm:text-2xl md:text-[28px] font-bold text-gray-900 font-playfair tracking-tight leading-tight">Your capabilities & transport</h3>
        <p className="text-sm sm:text-base text-gray-400 font-medium leading-relaxed font-dm">This helps us match you with clients whose physical needs align with what you can safely provide.</p>
      </div>

      <div className="space-y-8">
        <div className="space-y-3">
          <div className="space-y-1">
            <h4 className="text-[13px] sm:text-[15px] font-bold text-gray-900 font-dm">Physical capabilities</h4>
            <span className="text-[11px] sm:text-[13px] text-gray-400 font-medium font-dm block">Select all that apply to you</span>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {PhysicalCapabilitiesOptions.map((cap, i) => {
              const isSelected = (formData.physicalCapabilities || []).includes(cap);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleCapability(cap)}
                  className={clsx(
                    'px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-[12px] sm:text-[13px] font-bold font-dm duration-300 border',
                    isSelected ? 'bg-primary-extralight border-primary text-primary' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                  )}
                >
                  {cap}
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-primary-extralight rounded-2xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 border border-primary/10">
          <HiInformationCircle className="size-5 sm:size-6 text-primary shrink-0" />
          <p className="text-xs sm:text-sm text-primary/80 font-medium font-dm leading-relaxed">
            Your physical stats help match you with clients who need appropriate physical support. Never shown publicly.
          </p>
        </div>

        <div className="border border-gray-100/80 rounded-2xl md:rounded-3xl p-5 sm:p-8 md:p-10 space-y-8 shadow-sm bg-white">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] sm:text-sm font-bold text-primary/60 uppercase tracking-widest font-dm flex items-center">
              Height
              <span className="text-primary ml-3 lowercase tracking-normal bg-primary/5 px-3 py-1.5 rounded-md text-sm sm:text-base border border-primary/10">
                {displayHeight}
              </span>
            </h4>
            <div className="flex bg-gray-50 border border-gray-100 rounded-full p-1 shadow-inner">
              <button
                type="button"
                onClick={() => update({ heightUnit: 'cm', heightValue: heightUnit === 'ft' ? Math.round(heightValue * 2.54) : heightValue })}
                className={clsx('px-4 lg:px-5 py-1.5 rounded-full text-xs font-bold font-dm duration-300', heightUnit === 'cm' ? 'bg-white shadow-sm text-gray-900 border border-gray-100/50' : 'text-gray-400')}
              >cm</button>
              <button
                type="button"
                onClick={() => update({ heightUnit: 'ft', heightValue: heightUnit === 'cm' ? Math.round(heightValue / 2.54) : heightValue })}
                className={clsx('px-4 lg:px-5 py-1.5 rounded-full text-xs font-bold font-dm duration-300', heightUnit === 'ft' ? 'bg-white shadow-sm text-gray-900 border border-gray-100/50' : 'text-gray-400')}
              >ft</button>
            </div>
          </div>

          <div className="px-2 space-y-4">
            <input
              type="range"
              min={heightMin}
              max={heightMax}
              value={heightValue}
              onChange={(e) => update({ heightValue: parseInt(e.target.value) })}
              className="w-full h-3 rounded-full appearance-none outline-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-8 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[5px] [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg active:[&::-webkit-slider-thumb]:scale-110 active:[&::-webkit-slider-thumb]:cursor-grabbing [&::-webkit-slider-thumb]:duration-200"
              style={{ background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${heightPct}%, #e2dcfc ${heightPct}%, #e2dcfc 100%)` }}
            />
            <div className="flex justify-between items-center text-[10px] sm:text-sm font-bold text-gray-300 font-dm px-1">
              {heightUnit === 'ft' ? (
                <><span>4'0"</span><span>5'0"</span><span>6'0"</span><span>7'0"</span></>
              ) : (
                <><span>120</span><span>150</span><span>180</span><span>215</span></>
              )}
            </div>
          </div>
        </div>

        <div className="border border-gray-100/80 rounded-2xl md:rounded-3xl p-5 sm:p-8 md:p-10 space-y-8 shadow-sm bg-white">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] sm:text-sm font-bold text-primary/60 uppercase tracking-widest font-dm flex items-center">
              Weight
              <span className="text-primary ml-3 lowercase tracking-normal bg-primary/5 px-3 py-1.5 rounded-md text-sm sm:text-base border border-primary/10">
                {weightValue} {weightUnit}
              </span>
            </h4>
            <div className="flex bg-gray-50 border border-gray-100 rounded-full p-1 shadow-inner">
              <button
                type="button"
                onClick={() => update({ weightUnit: 'kg', weightValue: weightUnit === 'lbs' ? Math.round(weightValue / 2.205) : weightValue })}
                className={clsx('px-4 lg:px-5 py-1.5 rounded-full text-xs font-bold font-dm duration-300', weightUnit === 'kg' ? 'bg-white shadow-sm text-gray-900 border border-gray-100/50' : 'text-gray-400')}
              >kg</button>
              <button
                type="button"
                onClick={() => update({ weightUnit: 'lbs', weightValue: weightUnit === 'kg' ? Math.round(weightValue * 2.205) : weightValue })}
                className={clsx('px-4 lg:px-5 py-1.5 rounded-full text-xs font-bold font-dm duration-300', weightUnit === 'lbs' ? 'bg-white shadow-sm text-gray-900 border border-gray-100/50' : 'text-gray-400')}
              >lbs</button>
            </div>
          </div>

          <div className="px-2 space-y-4">
            <input
              type="range"
              min={weightMin}
              max={weightMax}
              value={weightValue}
              onChange={(e) => update({ weightValue: parseInt(e.target.value) })}
              className="w-full h-3 rounded-full appearance-none outline-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-8 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[5px] [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg active:[&::-webkit-slider-thumb]:scale-110 active:[&::-webkit-slider-thumb]:cursor-grabbing [&::-webkit-slider-thumb]:duration-200"
              style={{ background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${weightPct}%, #e2dcfc ${weightPct}%, #e2dcfc 100%)` }}
            />
            <div className="flex justify-between items-center text-[10px] sm:text-sm font-bold text-gray-300 font-dm px-1">
              {weightUnit === 'lbs' ? (
                <><span>80</span><span>120</span><span>160</span><span>200</span><span>240</span></>
              ) : (
                <><span>35</span><span>55</span><span>75</span><span>95</span><span>115</span></>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-[13px] sm:text-[15px] font-bold text-gray-900 font-dm">Transportation</h4>

          <div className="border border-gray-200 bg-white rounded-2xl md:rounded-3xl shadow-sm overflow-hidden flex flex-col">

            <div className={clsx('flex flex-col duration-300', formData.hasVehicle ? 'bg-surface-pure' : 'bg-white')}>
              <div
                className="flex items-center justify-between p-4 sm:p-5 cursor-pointer"
                onClick={() => update({ hasVehicle: !formData.hasVehicle })}
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <MdOutlineDirectionsCar className="size-5 sm:size-6 text-[#e85d04]" />
                  <span className="text-[14px] sm:text-[15px] font-bold text-gray-900 font-dm">I have my own vehicle</span>
                </div>
                <div className={clsx('w-11 sm:w-12 h-6 sm:h-7 rounded-full relative duration-300', formData.hasVehicle ? 'bg-primary' : 'bg-gray-200')}>
                  <div className={clsx('absolute top-1 bottom-1 w-4 sm:w-5 bg-white rounded-full duration-300 shadow-sm', formData.hasVehicle ? 'right-1' : 'left-1')} />
                </div>
              </div>
              {formData.hasVehicle && (
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 animate-in slide-in-from-top-2 fade-in duration-300">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 ml-8 sm:ml-10">
                    <div className="flex items-center gap-2">
                      <HiOutlineIdentification className="size-4 sm:size-5 text-gray-400" />
                      <span className="text-[12px] sm:text-[13px] font-bold text-gray-900 font-dm whitespace-nowrap">Driver's license # (optional)</span>
                    </div>
                    <input
                      type="text"
                      value={formData.driversLicense || ''}
                      onChange={(e) => update({ driversLicense: e.target.value })}
                      placeholder="e.g. A1234-56789"
                      className="w-full max-w-[220px] border border-gray-200 rounded-lg p-2 sm:p-2.5 text-[13px] sm:text-[14px] font-medium font-dm outline-none focus:border-primary focus:ring-1 focus:ring-primary duration-300 bg-white"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="h-px bg-gray-100" />

            <div
              className={clsx('flex items-center justify-between p-4 sm:p-5 cursor-pointer duration-300', formData.usesPublicTransit ? 'bg-surface-pure' : 'bg-white')}
              onClick={() => update({ usesPublicTransit: !formData.usesPublicTransit })}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <MdOutlineDirectionsBus className="size-5 sm:size-6 text-[#eab308]" />
                <span className="text-[14px] sm:text-[15px] font-bold text-gray-900 font-dm">I use public transit</span>
              </div>
              <div className={clsx('w-11 sm:w-12 h-6 sm:h-7 rounded-full relative duration-300', formData.usesPublicTransit ? 'bg-primary' : 'bg-gray-200')}>
                <div className={clsx('absolute top-1 bottom-1 w-4 sm:w-5 bg-white rounded-full duration-300 shadow-sm', formData.usesPublicTransit ? 'right-1' : 'left-1')} />
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            <div
              className={clsx('flex items-center justify-between p-4 sm:p-5 cursor-pointer duration-300', formData.usesBicycle ? 'bg-surface-pure' : 'bg-white')}
              onClick={() => update({ usesBicycle: !formData.usesBicycle })}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <MdOutlinePedalBike className="size-5 sm:size-6 text-blue-500" />
                <span className="text-[14px] sm:text-[15px] font-bold text-gray-900 font-dm">I travel by bicycle</span>
              </div>
              <div className={clsx('w-11 sm:w-12 h-6 sm:h-7 rounded-full relative duration-300', formData.usesBicycle ? 'bg-primary' : 'bg-gray-200')}>
                <div className={clsx('absolute top-1 bottom-1 w-4 sm:w-5 bg-white rounded-full duration-300 shadow-sm', formData.usesBicycle ? 'right-1' : 'left-1')} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderCapabilitiesDetails;
