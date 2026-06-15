import React from 'react';
import { HiOutlinePhone } from 'react-icons/hi';

interface ECallButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

const ECallButton: React.FC<ECallButtonProps> = ({ onClick, disabled = false }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center rounded-full bg-primary text-white size-10 shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      aria-label="Start e-call"
      title="Start e-call"
    >
      <HiOutlinePhone className="size-5" />
    </button>
  );
};

export default ECallButton;
