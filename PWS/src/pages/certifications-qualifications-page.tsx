import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineUpload,
  HiOutlineDocumentText,
  HiOutlineTrash,
  HiCheckCircle,
  HiOutlineInformationCircle,
  HiXCircle,
  HiClock,
} from 'react-icons/hi';

import { clsx } from 'clsx';
import DashboardSidebar from '../components/dashboard/dashboardSidebar/dashboardSidebar';
import DashboardHeader from '../components/dashboard/dashboardHeader/dashboardHeader';
import SettingsHeader from '../components/dashboard/settings/settingsHeader/settingsHeader';
import { useProviderPreferences } from '../hooks/useProviderPreferences';
import { fileToBase64 } from '../utils/image';
import { uploadImageAPI } from '../utils/api';

const statusConfig: Record<string, { label: string; icon: any; bg: string; text: string }> = {
  approved: { label: 'Verified', icon: HiCheckCircle, bg: 'bg-emerald-50', text: 'text-emerald-600' },
  pending: { label: 'Pending', icon: HiClock, bg: 'bg-amber-50', text: 'text-amber-600' },
  rejected: { label: 'Rejected', icon: HiXCircle, bg: 'bg-rose-50', text: 'text-rose-600' },
};

const CertificationsQualificationsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { providerProfile, saveProviderProfile } = useProviderPreferences();
  const [activeTab, setActiveTab] = useState<'certificate' | 'backcheck'>('certificate');

  const [pswCertificates, setPswCertificates] = useState<any[]>([]);
  const [backgroundChecks, setBackgroundChecks] = useState<any[]>([]);

  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const [backcheckFile, setBackcheckFile] = useState<File | null>(null);
  const [isBackcheckUploading, setIsBackcheckUploading] = useState(false);
  const [backcheckUploadProgress, setBackcheckUploadProgress] = useState(0);
  const [backcheckUploadSuccess, setBackcheckUploadSuccess] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backcheckInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const certs = Array.isArray(providerProfile.pswCertificates) ? providerProfile.pswCertificates : [];
    const bgs = Array.isArray(providerProfile.backgroundChecks) ? providerProfile.backgroundChecks : [];
    setPswCertificates(certs);
    setBackgroundChecks(bgs);
  }, [providerProfile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadSuccess(false);
      setUploadProgress(0);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      setUploadSuccess(false);
      setUploadProgress(0);
    }
  };

  const getDocuments = () => activeTab === 'certificate' ? pswCertificates : backgroundChecks;

  const uploadDocument = async (
    selectedFile: File,
    folder: 'mypsw/provider-certificates' | 'mypsw/provider-background-checks',
    field: 'pswCertificateUrl' | 'backgroundCheckUrl',
    arrayField: 'pswCertificates' | 'backgroundChecks',
    setProgress: (value: number) => void,
    setUploading: (value: boolean) => void,
    setSuccess: (value: boolean) => void,
  ) => {
    setUploading(true);
    setProgress(0);
    try {
      const fileBase64 = await fileToBase64(selectedFile);
      setProgress(35);
      const uploadRes = await uploadImageAPI(fileBase64, folder);
      setProgress(75);
      const secureUrl = uploadRes?.data?.secureUrl;
      if (!secureUrl) throw new Error('Upload URL missing');

      const newDoc = {
        url: secureUrl,
        status: 'pending',
        uploadedAt: new Date().toISOString(),
        fileName: selectedFile.name,
      };

      const currentDocs = activeTab === 'certificate' ? [...pswCertificates] : [...backgroundChecks];
      currentDocs.push(newDoc);

      await saveProviderProfile({
        [field]: secureUrl,
        [arrayField]: currentDocs,
        [`${arrayField === 'pswCertificates' ? 'pswCertificateStatus' : 'backgroundCheckStatus'}`]: 'pending',
      });

      if (activeTab === 'certificate') {
        setPswCertificates(currentDocs);
      } else {
        setBackgroundChecks(currentDocs);
      }

      setProgress(100);
      setSuccess(true);
    } catch (error) {
      console.error(error);
      alert('Document upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const simulateUpload = () => {
    if (!file) return;
    void uploadDocument(
      file,
      'mypsw/provider-certificates',
      'pswCertificateUrl',
      'pswCertificates',
      setUploadProgress,
      setIsUploading,
      setUploadSuccess,
    );
  };

  const uploadBackcheck = () => {
    if (!backcheckFile) return;
    void uploadDocument(
      backcheckFile,
      'mypsw/provider-background-checks',
      'backgroundCheckUrl',
      'backgroundChecks',
      setBackcheckUploadProgress,
      setIsBackcheckUploading,
      setBackcheckUploadSuccess,
    );
  };

  const removeFile = () => {
    setFile(null);
    setUploadProgress(0);
    setUploadSuccess(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const cfg = statusConfig[status] || statusConfig.pending;
    const Icon = cfg.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${cfg.bg} ${cfg.text}`}>
        <Icon className="size-3" /> {cfg.label}
      </span>
    );
  };

  return (
    <div className="flex h-screen w-full bg-surface-alt font-dm overflow-hidden">
      <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 lg:ml-72 flex flex-col h-screen overflow-hidden">
        <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} />

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-4 sm:p-8 lg:p-12 pb-16 sm:pb-24">
            <SettingsHeader
              title="Certifications & Qualifications"
              description="Manage and upload your professional certifications and background checks to maintain your provider status."
              breadcrumbs={[
                { label: 'Settings', to: '/settings' },
                { label: 'Preferences', to: '/settings/preferences' },
                { label: 'Certifications & Qualifications' }
              ]}
              backTo="/settings/preferences"
              backLabel="Back to Preferences"
            />

            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="mb-8 sm:mb-10">
                <div className="flex items-center gap-3 p-1.5 bg-white border border-gray-100 rounded-full shadow-sm w-fit">
                  <button
                    onClick={() => setActiveTab('certificate')}
                    className={clsx(
                      "px-4 sm:px-8 py-2 sm:py-3 rounded-full text-[10px] sm:text-sm font-bold font-dm duration-300",
                      activeTab === 'certificate' ? "bg-gradient-primary text-white shadow-md shadow-primary/20" : "text-gray-500 hover:text-primary hover:bg-primary/5"
                    )}
                  >
                    Certificate
                  </button>
                  <button
                    onClick={() => setActiveTab('backcheck')}
                    className={clsx(
                      "px-4 sm:px-8 py-2 sm:py-3 rounded-full text-[10px] sm:text-sm font-bold font-dm duration-300",
                      activeTab === 'backcheck' ? "bg-gradient-primary text-white shadow-md shadow-primary/20" : "text-gray-500 hover:text-primary hover:bg-primary/5"
                    )}
                  >
                    Backcheck
                  </button>
                </div>
              </div>

              {/* History Section */}
              {getDocuments().length > 0 && (
                <div className="mb-8">
                  <h4 className="text-sm font-bold text-gray-900 mb-4">Upload History</h4>
                  <div className="space-y-3">
                    {getDocuments().map((doc: any, idx: number) => (
                      <div key={doc._id || idx} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="size-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 shrink-0">
                          <HiOutlineDocumentText className="size-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{doc.fileName || 'Document'}</p>
                          <p className="text-[10px] text-gray-400">{doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : ''}</p>
                        </div>
                        <StatusBadge status={doc.status} />
                        {doc.url && (
                          <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-purple-600 font-bold underline hover:text-purple-800 shrink-0">
                            View
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'certificate' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="mb-8">
                    <h3 className="text-xl sm:text-2xl capitalize font-bold text-gray-900 font-playfair mb-2">Upload your PSW Certificate</h3>
                    <p className="text-xs sm:text-sm md:text-base text-gray-400 font-medium font-dm leading-relaxed">
                      A valid PSW Certificate is required to activate your account. All documents are reviewed within 24 hours.
                    </p>
                  </div>

                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={clsx(
                      "bg-white rounded-2xl sm:rounded-4xl border-2 p-6 sm:p-16 md:p-24 flex flex-col items-center text-center group duration-300 relative overflow-hidden",
                      isDragging ? "border-primary bg-primary/[0.02]" : "border-primary/20 hover:border-primary/40",
                      file ? "cursor-default" : "cursor-pointer"
                    )}
                  >
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                    {!file ? (
                      <div onClick={() => fileInputRef.current?.click()} className="relative z-10 flex flex-col items-center w-full">
                        <div className="size-14 sm:size-20 bg-primary/5 rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 sm:mb-8 group-hover:scale-110 duration-500">
                          <HiOutlineUpload className="size-8 sm:size-10 text-primary" />
                        </div>
                        <h4 className="text-lg sm:text-xl font-bold text-gray-900 font-dm mb-3">Drag & drop your certificate here</h4>
                        <div className="flex items-center gap-4 w-full justify-center mb-8">
                          <div className="h-px flex-1 bg-gray-100 max-w-10" />
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">or</span>
                          <div className="h-px flex-1 bg-gray-100 max-w-10" />
                        </div>
                        <button className="px-8 sm:px-12 py-3 sm:py-4 border-2 border-primary text-primary rounded-xl font-bold text-sm sm:text-base hover:bg-gradient-primary hover:text-white duration-300 shadow-sm active:scale-[0.98]">
                          Browse files
                        </button>
                        <p className="mt-6 text-xs sm:text-sm text-gray-400 font-medium font-dm">
                          PDF, JPG or PNG · Max 10MB
                        </p>
                      </div>
                    ) : (
                      <div className="relative z-10 flex flex-col items-center w-full max-w-md animate-in zoom-in duration-300">
                        <div className="w-full bg-surface-vibrant rounded-xl sm:rounded-2xl p-5 sm:p-8 flex items-center gap-3 sm:gap-4 border border-primary/10 shadow-sm mb-6 sm:mb-8">
                          <div className="size-10 sm:size-16 bg-white rounded-lg sm:rounded-xl flex items-center justify-center text-primary shadow-sm shrink-0">
                            <HiOutlineDocumentText className="size-5 sm:size-8" />
                          </div>
                          <div className="flex-1 min-w-0 text-left">
                            <h5 className="text-sm sm:text-base font-bold text-gray-900 font-dm truncate">{file.name}</h5>
                            <p className="text-xs text-gray-400 font-medium font-dm">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                          </div>
                          {!isUploading && !uploadSuccess && (
                            <button
                              onClick={removeFile}
                              className="size-8 sm:size-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 duration-300 shrink-0"
                            >
                              <HiOutlineTrash className="size-4 sm:size-5" />
                            </button>
                          )}
                          {uploadSuccess && (
                            <HiCheckCircle className="size-6 sm:size-8 text-green-500 shrink-0" />
                          )}
                        </div>

                        {isUploading && (
                          <div className="w-full space-y-3 mb-8">
                            <div className="flex justify-between text-xs sm:text-sm font-bold text-gray-600 font-dm">
                              <span>Uploading...</span>
                              <span>{uploadProgress}%</span>
                            </div>
                            <div className="h-2 sm:h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-primary duration-300 ease-out" style={{ width: `${uploadProgress}%` }} />
                            </div>
                          </div>
                        )}

                        {!isUploading && !uploadSuccess && (
                          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
                            <button
                              onClick={simulateUpload}
                              className="flex-1 bg-gradient-primary text-white py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base shadow-lg shadow-primary/20 hover:shadow-xl duration-300"
                            >
                              Confirm Upload
                            </button>
                            <button
                              onClick={removeFile}
                              className="px-8 py-4 bg-white border border-gray-100 text-gray-500 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base hover:bg-gray-50 duration-300"
                            >
                              Cancel
                            </button>
                          </div>
                        )}

                        {uploadSuccess && (
                          <div className="flex flex-col items-center">
                            <div className="bg-green-50 text-green-600 px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 mb-6">
                              <HiCheckCircle className="size-5" /> Successfully Uploaded
                            </div>
                            <button
                              onClick={removeFile}
                              className="text-primary font-bold text-sm hover:underline underline-offset-4"
                            >
                              Upload another document
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'backcheck' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="mb-8">
                    <h3 className="text-xl sm:text-2xl capitalize font-bold text-gray-900 font-playfair mb-2">Upload your background check</h3>
                    <p className="text-xs sm:text-sm md:text-base text-gray-400 font-medium font-dm leading-relaxed">
                      A clean background check is required for all PSWs to ensure client safety.
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-4 sm:p-7 flex gap-3 sm:gap-6 mb-6 sm:mb-8 shadow-sm">
                    <div className="size-9 sm:size-12 bg-primary/5 rounded-lg sm:rounded-xl flex items-center justify-center text-primary shrink-0">
                      <HiOutlineInformationCircle className="size-5 sm:size-7" />
                    </div>
                    <div>
                      <h5 className="text-xs sm:text-base font-bold text-gray-900 font-dm mb-1">What is a background check?</h5>
                      <p className="text-[10px] sm:text-[13px] text-gray-500 font-medium font-dm leading-relaxed">
                        A Vulnerable Sector Check (VSC) is a police record check that includes a search of the pardoned sex offender database. It is a mandatory requirement for healthcare professionals working with vulnerable populations.
                      </p>
                    </div>
                  </div>

                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      const droppedFile = e.dataTransfer.files?.[0];
                      if (droppedFile) setBackcheckFile(droppedFile);
                    }}
                    className={clsx(
                      "bg-white rounded-2xl sm:rounded-4xl border-2 p-6 sm:p-16 md:p-24 flex flex-col items-center text-center group duration-300 relative overflow-hidden",
                      isDragging ? "border-primary bg-primary/[0.02]" : "border-primary/20 hover:border-primary/40",
                      backcheckFile ? "cursor-default" : "cursor-pointer"
                    )}
                  >
                    <input
                      type="file"
                      ref={backcheckInputRef}
                      onChange={(e) => {
                        const selectedFile = e.target.files?.[0];
                        if (selectedFile) setBackcheckFile(selectedFile);
                      }}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    {!backcheckFile ? (
                      <div onClick={() => backcheckInputRef.current?.click()} className="relative z-10 flex flex-col items-center w-full">
                        <div className="size-14 sm:size-20 bg-primary/5 rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 sm:mb-8 group-hover:scale-110 duration-500">
                          <HiOutlineUpload className="size-8 sm:size-10 text-primary" />
                        </div>
                        <h4 className="text-lg sm:text-xl font-bold text-gray-900 font-dm mb-3">Upload your background check document</h4>
                        <div className="flex items-center gap-4 w-full justify-center mb-8">
                          <div className="h-px flex-1 bg-gray-100 max-w-10" />
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">or</span>
                          <div className="h-px flex-1 bg-gray-100 max-w-10" />
                        </div>
                        <button className="px-8 sm:px-12 py-3 sm:py-4 border-2 border-primary text-primary rounded-xl font-bold text-sm sm:text-base hover:bg-gradient-primary hover:text-white duration-300 shadow-sm active:scale-[0.98]">
                          Browse files
                        </button>
                        <p className="mt-6 text-xs sm:text-sm text-gray-400 font-medium font-dm">
                          PDF, JPG or PNG · Max 10MB · Must be dated within the last 12 months
                        </p>
                      </div>
                    ) : (
                      <div className="relative z-10 flex flex-col items-center w-full max-w-md animate-in zoom-in duration-300">
                        <div className="w-full bg-surface-vibrant rounded-xl sm:rounded-2xl p-5 sm:p-8 flex items-center gap-3 sm:gap-4 border border-primary/10 shadow-sm mb-6 sm:mb-8">
                          <div className="size-10 sm:size-16 bg-white rounded-lg sm:rounded-xl flex items-center justify-center text-primary shadow-sm shrink-0">
                            <HiOutlineDocumentText className="size-5 sm:size-8" />
                          </div>
                          <div className="flex-1 min-w-0 text-left">
                            <h5 className="text-sm sm:text-base font-bold text-gray-900 font-dm truncate">{backcheckFile.name}</h5>
                            <p className="text-xs text-gray-400 font-medium font-dm">{(backcheckFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                          </div>
                          {!isBackcheckUploading && !backcheckUploadSuccess && (
                            <button
                              onClick={() => setBackcheckFile(null)}
                              className="size-8 sm:size-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 duration-300 shrink-0"
                            >
                              <HiOutlineTrash className="size-4 sm:size-5" />
                            </button>
                          )}
                          {backcheckUploadSuccess && (
                            <HiCheckCircle className="size-6 sm:size-8 text-green-500 shrink-0" />
                          )}
                        </div>

                        {isBackcheckUploading && (
                          <div className="w-full space-y-3 mb-8">
                            <div className="flex justify-between text-xs sm:text-sm font-bold text-gray-600 font-dm">
                              <span>Uploading...</span>
                              <span>{backcheckUploadProgress}%</span>
                            </div>
                            <div className="h-2 sm:h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-primary duration-300 ease-out" style={{ width: `${backcheckUploadProgress}%` }} />
                            </div>
                          </div>
                        )}

                        {!isBackcheckUploading && !backcheckUploadSuccess && (
                          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
                            <button
                              onClick={uploadBackcheck}
                              className="flex-1 bg-gradient-primary text-white py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base shadow-lg shadow-primary/20 hover:shadow-xl duration-300"
                            >
                              Confirm Upload
                            </button>
                            <button
                              onClick={() => setBackcheckFile(null)}
                              className="px-8 py-4 bg-white border border-gray-100 text-gray-500 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base hover:bg-gray-50 duration-300"
                            >
                              Cancel
                            </button>
                          </div>
                        )}

                        {backcheckUploadSuccess && (
                          <div className="flex flex-col items-center">
                            <div className="bg-green-50 text-green-600 px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 mb-6">
                              <HiCheckCircle className="size-5" /> Successfully Uploaded
                            </div>
                            <button
                              onClick={() => {
                                setBackcheckFile(null);
                                setBackcheckUploadSuccess(false);
                                setBackcheckUploadProgress(0);
                              }}
                              className="text-primary font-bold text-sm hover:underline underline-offset-4"
                            >
                              Upload another document
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CertificationsQualificationsPage;