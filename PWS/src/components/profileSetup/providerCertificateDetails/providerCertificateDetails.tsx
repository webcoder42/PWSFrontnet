import React, { useRef } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { clsx } from 'clsx';
import { HiOutlineShieldCheck, HiOutlineUpload, HiOutlineMail } from 'react-icons/hi';
import type { ProviderProfileFormData } from '../../../types/profile';
import { fileToBase64 } from '../../../utils/image';

interface ProviderCertificateDetailsProps {
  formData: ProviderProfileFormData;
  setFormData: Dispatch<SetStateAction<ProviderProfileFormData>>;
}

const ProviderCertificateDetails: React.FC<ProviderCertificateDetailsProps> = ({ formData, setFormData }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = React.useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError('');
    if (file) {
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        setFileError(`File too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum size is 10MB.`);
        return;
      }
      const base64DataUrl = await fileToBase64(file);
      setFormData({
        ...formData,
        pswCertificate: base64DataUrl,
        pswCertificateName: file.name
      });
    }
  };

  return (
    <div className="space-y-8 sm:space-y-10">
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-xl sm:text-2xl md:text-[28px] font-bold text-gray-900 font-playfair tracking-tight leading-tight">Upload your PSW Certificate</h3>
        <p className="text-sm sm:text-base text-gray-400 font-medium leading-relaxed font-dm">A valid PSW Certificate is required to activate your account. All documents are reviewed within 24 hours.</p>
        
        <div className="inline-flex items-center gap-2 bg-primary-extralight px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-primary/10">
          <HiOutlineShieldCheck className="size-4 sm:size-5 text-primary" />
          <span className="text-[10px] sm:text-[13px] text-primary font-bold font-dm uppercase tracking-wider">Required for account activation</span>
        </div>
      </div>

      <div className="space-y-6">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={clsx(
            "w-full rounded-2xl md:rounded-3xl border-2 border-primary border-dashed bg-surface-pure p-6 sm:p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-primary-extralight duration-300",
            formData.pswCertificate ? "border-solid bg-primary-extralight" : ""
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
          
          {formData.pswCertificate ? (
            <div className="space-y-2">
              <p className="text-[15px] sm:text-lg font-bold text-gray-900 font-dm">File uploaded successfully!</p>
              <p className="text-[13px] sm:text-sm text-primary font-medium font-dm break-all">{formData.pswCertificateName || 'Certificate document'}</p>
            </div>
          ) : (
            <>
              <p className="text-[15px] sm:text-lg font-bold text-gray-900 font-dm mb-3">Drag & drop your certificate here</p>
              <p className="text-[11px] sm:text-[13px] text-gray-400 font-medium font-dm mb-4 sm:mb-6">or</p>
              
              <button 
                type="button" 
                className="bg-white border-2 border-primary text-primary px-6 sm:px-8 py-2 sm:py-2.5 rounded-full font-bold text-[13px] sm:text-sm font-dm hover:bg-primary hover:text-white duration-300 mb-4 sm:mb-6"
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
              >
                Browse files
              </button>
              
              <p className="text-[10px] sm:text-[12px] text-gray-400 font-medium font-dm">PDF, JPG or PNG · Max 10MB</p>
            </>
          )}
        </div>

        {fileError && (
          <p className="text-[13px] text-red-500 font-medium font-dm mt-2 text-center">{fileError}</p>
        )}

        <div className="flex items-center justify-center gap-4 py-2">
          <div className="h-px w-12 sm:w-16 bg-gray-200" />
          <span className="text-[11px] sm:text-[13px] text-gray-400 font-medium font-dm">or</span>
          <div className="h-px w-12 sm:w-16 bg-gray-200" />
        </div>

        <div className="border border-gray-200 rounded-xl md:rounded-2xl p-4 sm:p-5 flex items-center gap-4 bg-white shadow-sm">
          <div className="size-10 sm:size-12 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
            <HiOutlineMail className="size-5 sm:size-6 text-gray-400" />
          </div>
          <div>
            <h4 className="text-[13px] sm:text-[15px] font-bold text-gray-900 font-dm">Send by email</h4>
            <a href="mailto:info@essentialhelp.com" className="text-[12px] sm:text-[14px] text-primary font-medium font-dm mt-0.5 hover:underline underline-offset-2">info@essentialhelp.com</a>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <h4 className="text-[13px] sm:text-[15px] font-bold text-gray-900 font-dm">Document review process</h4>
        
        <div className="border border-gray-100/80 rounded-2xl md:rounded-3xl p-5 sm:p-8 bg-white shadow-sm overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-between min-w-[280px] sm:min-w-0">
            <div className="flex flex-col items-center gap-2.5 relative z-10">
              <div className="size-8 sm:size-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-[13px] sm:text-sm font-dm shadow-sm">1</div>
              <span className="text-[10px] sm:text-[13px] font-bold text-primary font-dm text-center">Upload</span>
            </div>
            
            <div className="flex-1 h-0.5 bg-gray-100 mx-1 sm:mx-2 -mt-6 sm:-mt-8 relative z-0" />
            
            <div className="flex flex-col items-center gap-2.5 relative z-10">
              <div className="size-8 sm:size-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 font-bold text-[13px] sm:text-sm font-dm border border-gray-100">2</div>
              <span className="text-[10px] sm:text-[13px] font-medium text-gray-400 font-dm text-center">Review</span>
            </div>
            
            <div className="flex-1 h-0.5 bg-gray-100 mx-1 sm:mx-2 -mt-6 sm:-mt-8 relative z-0" />
            
            <div className="flex flex-col items-center gap-2.5 relative z-10">
              <div className="size-8 sm:size-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 font-bold text-[13px] sm:text-sm font-dm border border-gray-100">3</div>
              <span className="text-[10px] sm:text-[13px] font-medium text-gray-400 font-dm text-center">Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderCertificateDetails;
