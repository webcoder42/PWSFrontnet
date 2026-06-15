import React, { useState } from 'react';
import { submitAppointmentRatingAPI } from '../../../utils/api';

const StarRow = ({ value, onChange, disabled }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        disabled={disabled}
        onClick={() => onChange(star)}
        className={`text-2xl transition-transform hover:scale-110 disabled:cursor-default ${
          star <= value ? 'text-amber-400' : 'text-gray-200'
        }`}
        aria-label={`${star} star${star > 1 ? 's' : ''}`}
      >
        ★
      </button>
    ))}
  </div>
);

const StarDisplay = ({ value }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <span key={star} className={`text-lg ${star <= value ? 'text-amber-400' : 'text-gray-200'}`}>
        ★
      </span>
    ))}
  </div>
);

export default function AppointmentRatingSection({ appointment, onUpdated }) {
  const isCompleted = (appointment?.status || '').toLowerCase() === 'completed';
  const existingRating = Number(appointment?.rating) || 0;
  const hasSubmitted = existingRating >= 1;

  const [rating, setRating] = useState(existingRating || 0);
  const [comment, setComment] = useState(appointment?.comment || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(hasSubmitted);

  if (!isCompleted) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating < 1) {
      setError('Please select a star rating.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const result = await submitAppointmentRatingAPI(appointment._id, {
        rating,
        comment,
      });
      if (result.success) {
        setSubmitted(true);
        onUpdated?.(result.data);
      } else {
        throw new Error(result.message || 'Failed to submit rating');
      }
    } catch (err) {
      setError(err.message || 'Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted || hasSubmitted) {
    const displayRating = submitted ? rating : existingRating;
    const displayComment = (submitted ? comment : appointment?.comment) || '';

    return (
      <div className="mt-8 p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100">
        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 mb-3">
          You submitted your rating
        </p>
        <StarDisplay value={displayRating} />
        <p className="mt-2 text-sm font-semibold text-gray-800">
          Your rating: {displayRating} / 5
        </p>
        {displayComment ? (
          <p className="mt-3 text-sm text-gray-600 leading-relaxed border-t border-emerald-100 pt-3">
            &ldquo;{displayComment}&rdquo;
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 p-6 rounded-2xl bg-purple-50/40 border border-purple-100"
    >
      <p className="text-[10px] font-bold uppercase tracking-widest text-purple-700 mb-1">
        Submit your rating
      </p>
      <p className="text-sm text-gray-600 mb-4">How was your care visit?</p>

      <StarRow value={rating} onChange={setRating} disabled={submitting} />

      <label className="block mt-5 text-xs font-semibold text-gray-600 mb-2">
        Comment (optional)
      </label>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        maxLength={500}
        rows={3}
        placeholder="Share your experience..."
        disabled={submitting}
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 focus:ring-2 focus:ring-purple-200 outline-none resize-none"
      />

      {error && <p className="mt-3 text-sm text-red-600 font-medium">{error}</p>}

      <button
        type="submit"
        disabled={submitting || rating < 1}
        className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-[#5915BD] to-[#7C3AED] text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? 'Submitting...' : 'Submit Rating'}
      </button>
    </form>
  );
}
