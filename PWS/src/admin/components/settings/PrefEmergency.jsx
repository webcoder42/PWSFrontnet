import React, { useEffect, useState } from 'react';
import Breadcrumb from './Breadcrumb';
import { useUser } from '../../../context/UserContext';
import { updateUserProfileAPI } from '../../../utils/api';

const emptyContact = { name: '', relationship: '', phone: '', email: '' };

const PrefEmergency = ({ setView }) => {
  const { rawUser, setUser } = useUser();
  const [contacts, setContacts] = useState([emptyContact, emptyContact]);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const existing = rawUser?.recipientProfile?.emergencyContacts;
    if (Array.isArray(existing)) {
      setContacts([
        {
          name: String(existing[0]?.name || ''),
          relationship: String(existing[0]?.relationship || ''),
          phone: String(existing[0]?.phone || ''),
          email: String(existing[0]?.email || ''),
        },
        {
          name: String(existing[1]?.name || ''),
          relationship: String(existing[1]?.relationship || ''),
          phone: String(existing[1]?.phone || ''),
          email: String(existing[1]?.email || ''),
        }
      ]);
    }
  }, [rawUser]);

  const updateField = (index, field, value) => {
    setContacts((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleSave = async () => {
    if (!rawUser?._id) {
      setError('Unable to save emergency contact without a signed-in user.');
      return;
    }

    setIsSaving(true);
    setMessage('');
    setError('');

    const emergencyContacts = contacts
      .map((contact) => ({
        name: contact.name.trim(),
        relationship: contact.relationship.trim(),
        phone: contact.phone.trim(),
        email: contact.email.trim(),
      }))
      .filter((contact) => contact.name || contact.relationship || contact.phone || contact.email);

    try {
      const response = await updateUserProfileAPI(rawUser._id, {
        recipientProfile: {
          emergencyContacts,
        },
      });

      const updatedUser = {
        ...rawUser,
        ...(response?.data ?? response ?? {}),
      };
      setUser(updatedUser);
      setMessage('Emergency contact saved successfully.');
    } catch (err) {
      setError(err?.message || 'Failed to save emergency contact.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto pb-20">
      <Breadcrumb current="Emergency Contact" sub={{ name: 'Preferences', view: 'preferences' }} setView={setView} />
      <h2 className="text-4xl font-bold text-[#1a113b] mb-2 font-serif">Emergency Contact</h2>
      <p className="text-gray-500 text-sm mb-8">In case of an emergency, we'll contact this person on your behalf. Please provide accurate information.</p>

      <div className="bg-[#fff1f2] border border-[#ffe4e6] rounded-2xl p-5 flex items-center gap-4 mb-8">
        <div className="text-[#e11d48]">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
        </div>
        <p className="text-sm text-[#be123c] font-medium">This contact will ONLY be reached in case of a medical emergency during a care session.</p>
      </div>

      <div className="space-y-6 mb-12">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-900 ml-1">Contact's full name</label>
          <input
            type="text"
            value={contacts[0].name}
            onChange={(e) => updateField(0, 'name', e.target.value)}
            placeholder="Enter contact's full name"
            className="w-full px-6 py-4 bg-white border border-[#8b5cf6] rounded-2xl text-sm outline-none focus:ring-2 focus:ring-purple-200 transition-all shadow-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-900 ml-1">Relationship to you</label>
          <input
            type="text"
            value={contacts[0].relationship}
            onChange={(e) => updateField(0, 'relationship', e.target.value)}
            placeholder="Relationship to you"
            className="w-full px-6 py-4 bg-white border border-[#8b5cf6] rounded-2xl text-sm outline-none focus:ring-2 focus:ring-purple-200 transition-all shadow-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-900 ml-1">Phone number</label>
          <input
            type="text"
            value={contacts[0].phone}
            onChange={(e) => updateField(0, 'phone', e.target.value)}
            placeholder="123-456-7890"
            className="w-full px-6 py-4 bg-white border border-[#8b5cf6] rounded-2xl text-sm outline-none focus:ring-2 focus:ring-purple-200 transition-all shadow-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-900 ml-1">Email address</label>
          <input
            type="email"
            value={contacts[0].email}
            onChange={(e) => updateField(0, 'email', e.target.value)}
            placeholder="contact@example.com"
            className="w-full px-6 py-4 bg-white border border-[#8b5cf6] rounded-2xl text-sm outline-none focus:ring-2 focus:ring-purple-200 transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="space-y-4 mb-12">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900 ml-1">Add a second emergency contact</h3>
            <p className="text-xs text-gray-500 ml-1">Optional contact for backup communication.</p>
          </div>
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Optional</span>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-900 ml-1">Contact's full name</label>
            <input
              type="text"
              value={contacts[1].name}
              onChange={(e) => updateField(1, 'name', e.target.value)}
              placeholder="Enter contact's full name"
              className="w-full px-6 py-4 bg-white border border-[#8b5cf6] rounded-2xl text-sm outline-none focus:ring-2 focus:ring-purple-200 transition-all shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-900 ml-1">Relationship to you</label>
            <input
              type="text"
              value={contacts[1].relationship}
              onChange={(e) => updateField(1, 'relationship', e.target.value)}
              placeholder="Relationship to you"
              className="w-full px-6 py-4 bg-white border border-[#8b5cf6] rounded-2xl text-sm outline-none focus:ring-2 focus:ring-purple-200 transition-all shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-900 ml-1">Phone number</label>
            <input
              type="text"
              value={contacts[1].phone}
              onChange={(e) => updateField(1, 'phone', e.target.value)}
              placeholder="123-456-7890"
              className="w-full px-6 py-4 bg-white border border-[#8b5cf6] rounded-2xl text-sm outline-none focus:ring-2 focus:ring-purple-200 transition-all shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-900 ml-1">Email address</label>
            <input
              type="email"
              value={contacts[1].email}
              onChange={(e) => updateField(1, 'email', e.target.value)}
              placeholder="contact@example.com"
              className="w-full px-6 py-4 bg-white border border-[#8b5cf6] rounded-2xl text-sm outline-none focus:ring-2 focus:ring-purple-200 transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={isSaving}
        className={`w-full mt-10 py-5 rounded-[2rem] font-bold text-base transition-colors ${isSaving ? 'bg-[#c4b5fd] text-white cursor-not-allowed' : 'bg-[#8b5cf6] hover:bg-[#7c3aed] text-white'}`}
      >
        {isSaving ? 'Saving...' : 'Save Changes'}
      </button>

      {message ? <p className="mt-4 text-sm text-emerald-600">{message}</p> : null}
      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
    </div>
  );
};

export default PrefEmergency;
