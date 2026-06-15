import React, { useRef } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { clsx } from 'clsx';
import { HiOutlineInformationCircle, HiOutlineUpload, HiOutlineGlobeAlt, HiArrowRight } from 'react-icons/hi';
import type { ProviderProfileFormData } from '../../../types/profile';
import { fileToBase64 } from '../../../utils/image';

interface ProviderBackcheckDetailsProps {
  formData: ProviderProfileFormData;
  setFormData: Dispatch<SetStateAction<ProviderProfileFormData>>;
}

const ProviderBackcheckDetails: React.FC<ProviderBackcheckDetailsProps> = ({ formData, setFormData }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64DataUrl = await fileToBase64(file);
      setFormData({
        ...formData,
        backgroundCheck: base64DataUrl,
        backgroundCheckName: file.name
      });
    }
  };

  return (
    <div className="space-y-8 sm:space-y-10">
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-xl sm:text-2xl md:text-[28px] font-bold text-gray-900 font-playfair tracking-tight leading-tight">Upload your background check</h3>
        <p className="text-sm sm:text-base text-gray-400 font-medium leading-relaxed font-dm">A clean background check is required for all PSWs to ensure client safety.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl md:rounded-2xl p-4 sm:p-5 flex gap-3 sm:gap-4 shadow-sm">
        <div className="size-5 sm:size-6 rounded-full bg-primary-extralight flex items-center justify-center text-primary shrink-0 mt-0.5">
          <HiOutlineInformationCircle className="size-3.5 sm:size-4" />
        </div>
        <div className="space-y-1">
          <h4 className="text-[13px] sm:text-[14px] font-bold text-gray-900 font-dm">What is a background check?</h4>
          <p className="text-[12px] sm:text-[13px] text-gray-400 font-medium font-dm leading-relaxed">
            A criminal record check from a certified provider confirming no history of abuse or criminal activity. Must be issued within the last 12 months.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div
          onClick={() => fileInputRef.current?.click()}
          className={clsx(
            "w-full rounded-2xl md:rounded-3xl border-2 border-primary border-dashed bg-surface-pure p-6 sm:p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-primary-extralight duration-300",
            formData.backgroundCheck ? "border-solid bg-primary-extralight" : ""
          )}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileUpload}
          />

          <HiOutlineUpload className="size-10 sm:size-12 text-primary mb-4 sm:mb-6" />

          {formData.backgroundCheck ? (
            <div className="space-y-2">
              <p className="text-[15px] sm:text-lg font-bold text-gray-900 font-dm">File uploaded successfully!</p>
              <p className="text-[13px] sm:text-sm text-primary font-medium font-dm break-all">{formData.backgroundCheckName || 'Background check document'}</p>
            </div>
          ) : (
            <>
              <p className="text-[15px] sm:text-lg font-bold text-gray-900 font-dm mb-3">Upload your background check document</p>
              <p className="text-[11px] sm:text-[13px] text-gray-400 font-medium font-dm mb-4 sm:mb-6">or</p>

              <button
                type="button"
                className="bg-white border-2 border-primary text-primary px-6 sm:px-8 py-2 sm:py-2.5 rounded-full font-bold text-[13px] sm:text-sm font-dm hover:bg-primary hover:text-white duration-300 mb-4 sm:mb-6"
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
              >
                Browse files
              </button>

              <p className="text-[10px] sm:text-[12px] text-gray-400 font-medium font-dm">PDF, JPG or PNG · Max 10MB · Must be dated within the last 12 months</p>
            </>
          )}
        </div>

        <div className="flex items-center justify-center gap-4 py-2">
          <div className="h-px w-12 sm:w-16 bg-gray-200" />
          <span className="text-[11px] sm:text-[13px] text-gray-400 font-medium font-dm">or</span>
          <div className="h-px w-12 sm:w-16 bg-gray-200" />
        </div>

        <div className="border border-gray-100/80 rounded-2xl md:rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white shadow-sm">
          <div className="size-10 sm:size-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <HiOutlineGlobeAlt className="size-5 sm:size-6 text-blue-500" />
          </div>
          <div>
            <h4 className="text-[13px] sm:text-[15px] font-bold text-gray-900 font-dm">Don't have a background check yet?</h4>
            <p className="text-[11px] sm:text-[13px] text-gray-400 font-medium font-dm mt-1 leading-relaxed">Visit www.backcheck.com to get yours online (results in 2-3 business days)</p>
            <a href="#" className="inline-flex items-center gap-1.5 text-[12px] sm:text-[14px] text-primary font-bold font-dm mt-3 hover:underline underline-offset-2">
              Visit Backcheck <HiArrowRight className="size-3.5 sm:size-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderBackcheckDetails;
