import React from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { HiChevronDown } from 'react-icons/hi';
import type { ProfileFormData } from '../../../types/profile';

interface FamilyRelationProps {
  formData: ProfileFormData;
  setFormData: Dispatch<SetStateAction<ProfileFormData>>;
}

const FamilyRelation: React.FC<FamilyRelationProps> = ({ formData, setFormData }) => {
  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h3 className="text-xl sm:text-3xl font-bold text-gray-900 font-playfair tracking-tight leading-tight">How are they related to you?</h3>
        <p className="text-sm sm:text-lg text-gray-400 font-medium leading-relaxed font-dm text-balance">Please specify your relationship to the person receiving care.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-dm font-bold text-gray-900 uppercase tracking-widest ml-1 opacity-60">Relationship</label>
          <div className="relative">
            <select
              value={formData.familyRelation || ''}
              onChange={(e) => setFormData({ ...formData, familyRelation: e.target.value })}
              className="mt-2 w-full bg-white border-2 border-primary/10 rounded-xl md:rounded-2xl p-4 sm:p-5 outline-none focus:border-primary duration-300 text-gray-900 font-medium appearance-none text-base cursor-pointer"
            >
              <option value="" disabled>Select relation</option>
              <option value="Mother">Mother</option>
              <option value="Father">Father</option>
              <option value="Spouse/Partner">Spouse/Partner</option>
              <option value="Grandmother">Grandmother</option>
              <option value="Grandfather">Grandfather</option>
              <option value="Sibling">Sibling</option>
              <option value="Other">Other</option>
            </select>
            <HiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 mt-1 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyRelation;
