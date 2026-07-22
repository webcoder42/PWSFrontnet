import React, { useState, useEffect } from 'react';
import { fetchAdminPswByIdAPI, verifyAdminPswAPI } from '../../../utils/adminApi';

const DAY_LABELS = { monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu', friday: 'Fri', saturday: 'Sat', sunday: 'Sun' };

const certConfig = {
  approved: { label: 'Verified', bg: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  pending: { label: 'Pending', bg: 'bg-amber-50 text-amber-600 border-amber-100' },
  rejected: { label: 'Rejected', bg: 'bg-rose-50 text-rose-600 border-rose-100' },
};

const PswDetailModal = ({ pswId, onClose, onUpdate }) => {
  const [psw, setPsw] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [previewDoc, setPreviewDoc] = useState(null);
  const [blobUrl, setBlobUrl] = useState(null);
  const [isPdf, setIsPdf] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    if (!pswId) return;
    setLoading(true);
    fetchAdminPswByIdAPI(pswId)
      .then((res) => setPsw(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [pswId]);

  useEffect(() => {
    if (!previewDoc || !previewDoc.url) {
      setBlobUrl(null);
      setIsPdf(false);
      setFetchError(false);
      return;
    }

    const url = previewDoc.url;
    const isImage = url.match(/\.(jpg|jpeg|png|gif|webp)(\?|$)/i);

    if (isImage) {
      setIsPdf(false);
      setBlobUrl(url);
      return;
    }

    setPdfLoading(true);
    setFetchError(false);
    
    let active = true;
    let localBlobUrl = null;

    fetch(url)
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch file');
        const contentType = res.headers.get('content-type');
        const blob = await res.blob();
        
        if (!active) return;

        let finalBlob = blob;
        let isDocPdf = contentType && contentType.includes('pdf');
        
        const isPdfExt = url.toLowerCase().includes('.pdf') || 
                          (previewDoc.fileName && previewDoc.fileName.toLowerCase().endsWith('.pdf')) ||
                          url.includes('/provider-certificates/') || 
                          url.includes('/provider-background-checks/');
        
        if (isPdfExt || isDocPdf) {
          isDocPdf = true;
          finalBlob = new Blob([blob], { type: 'application/pdf' });
        }

        localBlobUrl = URL.createObjectURL(finalBlob);
        setBlobUrl(localBlobUrl);
        setIsPdf(isDocPdf);
      })
      .catch((err) => {
        console.error('Error fetching preview document:', err);
        if (!active) return;
        setFetchError(true);
        setBlobUrl(url);
        setIsPdf(url.toLowerCase().includes('.pdf') || (previewDoc.fileName && previewDoc.fileName.toLowerCase().endsWith('.pdf')));
      })
      .finally(() => {
        if (active) {
          setPdfLoading(false);
        }
      });

    return () => {
      active = false;
      if (localBlobUrl) {
        URL.revokeObjectURL(localBlobUrl);
      }
    };
  }, [previewDoc]);

  const handleVerifyDoc = async (type, docId, status) => {
    if (!pswId || !docId) return;
    setActionLoading(true);
    try {
      const payload = type === 'certificate'
        ? { certificateStatus: status, certificateId: docId }
        : { backgroundCheckStatus: status, backgroundCheckId: docId };
      const res = await verifyAdminPswAPI(pswId, payload);
      setPsw((prev) => ({
        ...prev,
        pswCertificates: res.data.pswCertificates || prev.pswCertificates,
        backgroundChecks: res.data.backgroundChecks || prev.backgroundChecks,
        pswCertificateStatus: res.data.pswCertificateStatus || prev.pswCertificateStatus,
        backgroundCheckStatus: res.data.backgroundCheckStatus || prev.backgroundCheckStatus,
      }));
      if (onUpdate) onUpdate(pswId, status);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const DocActions = ({ type, doc }) => (
    <div className="flex items-center gap-1.5 mt-2">
      {doc.status !== 'approved' && (
        <button
          onClick={() => handleVerifyDoc(type, doc._id, 'approved')}
          disabled={actionLoading}
          className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center hover:bg-emerald-200 transition-all disabled:opacity-50"
          title="Verify"
        >
          <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </button>
      )}
      {doc.status !== 'rejected' && (
        <button
          onClick={() => handleVerifyDoc(type, doc._id, 'rejected')}
          disabled={actionLoading}
          className="w-6 h-6 bg-rose-100 rounded-full flex items-center justify-center hover:bg-rose-200 transition-all disabled:opacity-50"
          title="Reject"
        >
          <svg className="w-3.5 h-3.5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );

  if (!pswId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Loading PSW details...</p>
          </div>
        ) : !psw ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-rose-500 text-sm font-bold">Failed to load PSW details</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="relative p-10 pb-0">
              <button onClick={onClose} className="absolute top-8 right-8 w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                <img
                  src={psw.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${psw.seed || psw.name}`}
                  className="w-36 h-36 rounded-[2rem] shadow-lg border-4 border-white object-cover shrink-0"
                  alt={psw.name}
                />
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl font-bold font-serif text-gray-900 mb-1">{psw.name}</h2>
                  <p className="text-purple-600 text-[10px] font-bold uppercase tracking-widest mb-3">{psw.role}</p>
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <div className="bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
                      <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Rating</p>
                      <p className="font-bold text-gray-900 text-sm">★ {psw.rating}</p>
                    </div>
                    <div className="bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
                      <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Experience</p>
                      <p className="font-bold text-gray-900 text-sm">{psw.yearsOfExperience} yrs</p>
                    </div>
                    <div className="bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
                      <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Hourly Rate</p>
                      <p className="font-bold text-gray-900 text-sm">${psw.hourlyRate}/hr</p>
                    </div>
                    <div className={`px-4 py-2 rounded-2xl border ${certConfig[psw.pswCertificateStatus]?.bg || certConfig.pending.bg}`}>
                      <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Certificate</p>
                      <p className={`font-bold text-sm ${certConfig[psw.pswCertificateStatus]?.text || certConfig.pending.text}`}>
                        {certConfig[psw.pswCertificateStatus]?.label || 'Pending'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Personal & Bio */}
              <div className="space-y-8">
                {/* Bio */}
                {psw.bio && (
                  <div className="bg-gray-25 p-6 rounded-[2rem] border border-gray-50">
                    <p className="text-[10px] font-bold text-purple-600 uppercase tracking-widest mb-3">Bio</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{psw.bio}</p>
                  </div>
                )}

                {/* Personal Info */}
                <div className="bg-white p-6 rounded-[2rem] border border-gray-50 shadow-sm">
                  <p className="text-[10px] font-bold text-purple-600 uppercase tracking-widest mb-4">Personal Information</p>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Email</span>
                      <span className="text-sm font-bold text-gray-900">{psw.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Phone</span>
                      <span className="text-sm font-bold text-gray-900">{psw.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Gender</span>
                      <span className="text-sm font-bold text-gray-900">{psw.gender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Language</span>
                      <span className="text-sm font-bold text-gray-900">{psw.language}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Spoken Languages</span>
                      <span className="text-sm font-bold text-gray-900">{psw.spokenLanguages?.length ? psw.spokenLanguages.join(', ') : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Service Radius</span>
                      <span className="text-sm font-bold text-gray-900">{psw.serviceRadiusKm} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Gender Preference</span>
                      <span className="text-sm font-bold text-gray-900">{psw.patientGenderPreference}</span>
                    </div>
                  </div>
                </div>

                {/* Specializations & Services */}
                <div className="bg-white p-6 rounded-[2rem] border border-gray-50 shadow-sm">
                  <p className="text-[10px] font-bold text-purple-600 uppercase tracking-widest mb-4">Skills & Services</p>
                  {psw.specializations?.length > 0 && (
                    <div className="mb-4">
                      <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mb-2">Specializations</p>
                      <div className="flex flex-wrap gap-2">
                        {psw.specializations.map((s, i) => (
                          <span key={i} className="bg-purple-50 text-purple-600 text-[9px] font-bold px-3 py-1.5 rounded-lg border border-purple-100">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {psw.servicesProvided?.length > 0 && (
                    <div>
                      <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mb-2">Services Provided</p>
                      <div className="flex flex-wrap gap-2">
                        {psw.servicesProvided.map((s, i) => (
                          <span key={i} className="bg-blue-50 text-blue-600 text-[9px] font-bold px-3 py-1.5 rounded-lg border border-blue-100">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {psw.physicalCapabilities?.length > 0 && (
                    <div className="mt-4">
                      <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mb-2">Physical Capabilities</p>
                      <div className="flex flex-wrap gap-2">
                        {psw.physicalCapabilities.map((c, i) => (
                          <span key={i} className="bg-emerald-50 text-emerald-600 text-[9px] font-bold px-3 py-1.5 rounded-lg border border-emerald-100">{c}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Documents, Availability & Transport */}
              <div className="space-y-8">
                {/* Certificates & Docs */}
                <div className="bg-white p-6 rounded-[2rem] border border-gray-50 shadow-sm">
                  <p className="text-[10px] font-bold text-purple-600 uppercase tracking-widest mb-4">Certificates & Background Check</p>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-25 p-4 rounded-2xl border border-gray-50">
                      <p className="text-[9px] font-bold text-gray-900 uppercase tracking-widest mb-3">PSW Certificates</p>
                      {Array.isArray(psw.pswCertificates) && psw.pswCertificates.length > 0 ? (
                        <div className="space-y-2">
                          {psw.pswCertificates.map((doc, idx) => (
                            <div key={doc._id || idx} className="bg-white p-3 rounded-xl border border-gray-100">
                              <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                  <p className="text-[10px] font-bold text-gray-900 truncate">{doc.fileName || 'Certificate'}</p>
                                  {doc.uploadedAt && (
                                    <p className="text-[8px] text-gray-400">{new Date(doc.uploadedAt).toLocaleDateString()}</p>
                                  )}
                                </div>
                                <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest shrink-0 ml-2 ${certConfig[doc.status]?.bg || certConfig.pending.bg}`}>
                                  {certConfig[doc.status]?.label || 'Pending'}
                                </span>
                                {doc.url && (
                                  <button onClick={() => setPreviewDoc(doc)} className="text-[8px] text-purple-600 font-bold underline ml-2 shrink-0 hover:text-purple-800 cursor-pointer">
                                    View
                                  </button>
                                )}
                              </div>
                              <DocActions type="certificate" doc={doc} />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[10px] text-gray-400">No certificates uploaded</p>
                      )}
                    </div>

                    <div className="bg-gray-25 p-4 rounded-2xl border border-gray-50">
                      <p className="text-[9px] font-bold text-gray-900 uppercase tracking-widest mb-3">Background Checks</p>
                      {Array.isArray(psw.backgroundChecks) && psw.backgroundChecks.length > 0 ? (
                        <div className="space-y-2">
                          {psw.backgroundChecks.map((doc, idx) => (
                            <div key={doc._id || idx} className="bg-white p-3 rounded-xl border border-gray-100">
                              <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                  <p className="text-[10px] font-bold text-gray-900 truncate">{doc.fileName || 'Background Check'}</p>
                                  {doc.uploadedAt && (
                                    <p className="text-[8px] text-gray-400">{new Date(doc.uploadedAt).toLocaleDateString()}</p>
                                  )}
                                </div>
                                <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest shrink-0 ml-2 ${certConfig[doc.status]?.bg || certConfig.pending.bg}`}>
                                  {certConfig[doc.status]?.label || 'Pending'}
                                </span>
                                {doc.url && (
                                  <button onClick={() => setPreviewDoc(doc)} className="text-[8px] text-purple-600 font-bold underline ml-2 shrink-0 hover:text-purple-800 cursor-pointer">
                                    View
                                  </button>
                                )}
                              </div>
                              <DocActions type="backgroundCheck" doc={doc} />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[10px] text-gray-400">No background check documents uploaded</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Availability */}
                <div className="bg-white p-6 rounded-[2rem] border border-gray-50 shadow-sm">
                  <p className="text-[10px] font-bold text-purple-600 uppercase tracking-widest mb-4">Availability</p>
                  {psw.availability && Object.keys(psw.availability).length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(psw.availability).filter(([, slots]) => Array.isArray(slots) && slots.length > 0).map(([day, slots]) => (
                        <div key={day} className="bg-gray-25 p-3 rounded-xl border border-gray-50">
                          <p className="text-[8px] font-bold text-gray-900 uppercase mb-1">{DAY_LABELS[day] || day.slice(0, 3)}</p>
                          <p className="text-[8px] text-gray-500 font-medium">{slots.map((s) => `${s.start || s.startTime || ''}-${s.end || s.endTime || ''}`).join(', ')}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-gray-400">No availability set</p>
                  )}
                </div>

                {/* Transportation */}
                {psw.transportation && (
                  <div className="bg-white p-6 rounded-[2rem] border border-gray-50 shadow-sm">
                    <p className="text-[10px] font-bold text-purple-600 uppercase tracking-widest mb-4">Transportation</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Mode</span>
                        <span className="text-sm font-bold text-gray-900">{psw.transportation.mode || 'N/A'}</span>
                      </div>
                      {psw.transportation.licenseNumber && (
                        <div className="flex justify-between">
                          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">License</span>
                          <span className="text-sm font-bold text-gray-900">{psw.transportation.licenseNumber}</span>
                        </div>
                      )}
                      {psw.transportation.hasInsurance && (
                        <div className="flex justify-between">
                          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Insurance</span>
                          <span className="text-sm font-bold text-emerald-600">Active</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Address */}
                {psw.address && (
                  <div className="bg-white p-6 rounded-[2rem] border border-gray-50 shadow-sm">
                    <p className="text-[10px] font-bold text-purple-600 uppercase tracking-widest mb-4">Address</p>
                    <p className="text-sm font-bold text-gray-900">
                      {[psw.address.street, psw.address.city, psw.address.state, psw.address.postalCode].filter(Boolean).join(', ')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-100 p-6 rounded-b-[2.5rem] flex justify-center">
              <button onClick={onClose} className="text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:text-purple-600 transition-all">
                Close
              </button>
            </div>
          </>
        )}
      </div>

      {previewDoc && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setPreviewDoc(null)}>
          <div className="bg-white rounded-[2rem] w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <p className="text-sm font-bold text-gray-900 truncate">{previewDoc.fileName || 'Document'}</p>
              <button onClick={() => setPreviewDoc(null)} className="size-8 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all shrink-0 ml-4">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-4 flex items-center justify-center bg-gray-50 h-[65vh] w-full overflow-hidden relative">
              {pdfLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 z-10">
                  <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-3"></div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Preparing Document Preview...</p>
                </div>
              )}
              {fetchError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10 p-6 text-center">
                  <svg className="w-12 h-12 text-rose-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-sm font-bold text-gray-900 mb-1">Failed to load preview</p>
                  <p className="text-xs text-gray-500 mb-4">This document cannot be previewed inline.</p>
                  <a
                    href={previewDoc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl hover:bg-purple-700 transition-all inline-flex items-center gap-1.5"
                  >
                    <span>Download File</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  </a>
                </div>
              )}
              {previewDoc.url ? (
                previewDoc.url.match(/\.(jpg|jpeg|png|gif|webp)(\?|$)/i) ? (
                  <img src={previewDoc.url} alt={previewDoc.fileName || 'Document'} className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-sm" />
                ) : (
                  blobUrl && (
                    <iframe
                      src={blobUrl}
                      title={previewDoc.fileName || 'Document'}
                      className="w-full h-[60vh] rounded-lg bg-white shadow-sm border border-gray-100"
                      frameBorder="0"
                    />
                  )
                )
              ) : (
                <p className="text-gray-400 text-sm">No document URL available</p>
              )}
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-100">
              <a
                href={blobUrl || previewDoc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl hover:bg-purple-700 transition-all cursor-pointer"
              >
                Open in New Tab
              </a>
              <button onClick={() => setPreviewDoc(null)} className="px-4 py-2 bg-gray-50 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-100 transition-all cursor-pointer">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PswDetailModal;