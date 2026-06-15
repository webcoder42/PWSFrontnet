import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiChevronRight, HiArrowLeft } from 'react-icons/hi';

interface Breadcrumb {
  label: string;
  to?: string;
}

interface SettingsHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  backTo?: string;
  backLabel?: string;
  rightContent?: React.ReactNode;
}

const SettingsHeader: React.FC<SettingsHeaderProps> = ({
  title,
  description,
  breadcrumbs = [],
  backTo,
  backLabel = 'Back to Settings',
  rightContent
}) => {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      {(breadcrumbs.length > 0 || backTo) && (
        <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-2 text-[10px] sm:text-xs md:text-sm font-medium overflow-x-auto no-scrollbar whitespace-nowrap pb-1 sm:pb-0">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && <HiChevronRight className="size-3 sm:size-4 text-gray-400 shrink-0" />}
                {crumb.to ? (
                  <Link to={crumb.to} className="text-primary hover:underline flex items-center gap-1 shrink-0">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-gray-500 shrink-0">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </div>
          {backTo && (
            <button
              onClick={() => navigate(backTo)}
              className="flex items-center gap-2 text-[11px] sm:text-xs md:text-sm font-bold text-gray-500 hover:text-primary duration-300 bg-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-100 shadow-sm self-start sm:self-auto shrink-0"
            >
              <HiArrowLeft className="size-3 sm:size-4" />
              <span className="whitespace-nowrap">{backLabel}</span>
            </button>
          )}
        </div>
      )}

      <div className="mb-8 lg:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-4xl w-full">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 font-playfair mb-2 sm:mb-3 leading-tight tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-[11px] sm:text-sm md:text-base lg:text-lg text-gray-500 font-medium font-dm leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {rightContent && (
          <div className="shrink-0 w-full md:w-auto">
            {rightContent}
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsHeader;
