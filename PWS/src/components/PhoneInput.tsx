import React, { useState, useEffect, useRef, useMemo } from 'react';
import { HiChevronDown } from 'react-icons/hi';
import { getCountries, getCountryCallingCode } from 'libphonenumber-js';

const countries = getCountries()
  .map((code) => ({
    code: `+${getCountryCallingCode(code)}`,
    countryCode: code,
    name: new Intl.DisplayNames(['en'], { type: 'region' }).of(code) || code,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

function getFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 0x1f1e6 + char.charCodeAt(0) - 65);
  return String.fromCodePoint(...codePoints);
}

interface PhoneInputProps {
  value: string;
  onChange: (phone: string) => void;
  countryCode: string;
  onCountryCodeChange: (code: string) => void;
  placeholder?: string;
  countryBtnClass?: string;
  inputClass?: string;
  dropdownClass?: string;
  itemClass?: string;
  activeItemClass?: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  countryCode,
  onCountryCodeChange,
  placeholder = '123-456-7890',
  countryBtnClass = 'w-24 sm:w-32 h-full bg-white border-2 border-primary/10 rounded-xl md:rounded-2xl flex items-center justify-between px-4 sm:px-5 cursor-pointer hover:border-primary/20 duration-300',
  inputClass = 'flex-1 bg-white border-2 border-primary/10 rounded-xl md:rounded-2xl p-4 sm:p-5 outline-none focus:border-primary duration-300 text-gray-900 font-medium placeholder:text-gray-300 text-sm sm:text-base shadow-sm',
  dropdownClass = 'absolute top-[calc(100%+8px)] left-0 w-64 sm:w-72 bg-white rounded-xl shadow-logs border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200',
  itemClass = 'flex items-center gap-3 p-3 cursor-pointer hover:bg-primary/5 duration-200 text-sm sm:text-base text-gray-600',
  activeItemClass = 'bg-primary/10 text-primary font-bold',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchRef.current) {
      searchRef.current.focus();
    }
    if (!isOpen) setSearch('');
  }, [isOpen]);

  const selected = useMemo(
    () => countries.find((c) => c.code === countryCode),
    [countryCode],
  );

  const filtered = useMemo(
    () => countries.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.code.includes(search) ||
        c.countryCode.toLowerCase().includes(search.toLowerCase()),
    ),
    [search],
  );

  return (
    <div className="flex gap-4 relative">
      <div className="relative shrink-0" ref={ref}>
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={countryBtnClass}
        >
          <span className="text-sm sm:text-base">
            {selected ? `${getFlagEmoji(selected.countryCode)} ${selected.code}` : '+1'}
          </span>
          <HiChevronDown className={`text-gray-400 duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
        {isOpen && (
          <div className={dropdownClass}>
            <div className="p-2 border-b border-gray-100">
              <input
                ref={searchRef}
                type="text"
                placeholder="Search country..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-primary/40 focus:bg-white duration-200"
              />
            </div>
            <div className="max-h-60 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="p-3 text-sm text-gray-400 text-center">No countries found</div>
              ) : (
                filtered.map((c) => (
                  <div
                    key={c.countryCode}
                    onClick={() => {
                      onCountryCodeChange(c.code);
                      setIsOpen(false);
                    }}
                    className={`${itemClass} ${
                      c.code === countryCode ? activeItemClass : ''
                    }`}
                  >
                    <span className="text-lg">{getFlagEmoji(c.countryCode)}</span>
                    <span className="font-bold">{c.code}</span>
                    <span className="text-xs text-gray-400 ml-auto truncate">{c.name}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      <input
        type="tel"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
    </div>
  );
};

export { getFlagEmoji, countries };
export default PhoneInput;
