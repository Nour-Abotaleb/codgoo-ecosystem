import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "@store/hooks";
import { selectTheme } from "@store/theme/theme-slice";
import { useTranslation } from "react-i18next";

type CountryOption = {
  readonly code: string;
  readonly name: string;
  readonly dialCode: string;
  readonly flagUrl: string;
  readonly fallbackEmoji: string;
};

type PhoneFieldProps = {
  readonly label: string;
  readonly name?: string;
  readonly defaultCountry?: string;
  readonly error?: string;
};

const getFlagEmoji = (countryCode: string) =>
  countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));

const getFlagUrl = (countryCode: string) =>
  `https://flagcdn.com/${countryCode.toLowerCase()}.svg`;

const FALLBACK_COUNTRIES: CountryOption[] = [
  { code: "US", name: "United States", dialCode: "+1", flagUrl: getFlagUrl("US"), fallbackEmoji: "🇺🇸" },
  { code: "GB", name: "United Kingdom", dialCode: "+44", flagUrl: getFlagUrl("GB"), fallbackEmoji: "🇬🇧" },
  { code: "CA", name: "Canada", dialCode: "+1", flagUrl: getFlagUrl("CA"), fallbackEmoji: "🇨🇦" },
  { code: "DE", name: "Germany", dialCode: "+49", flagUrl: getFlagUrl("DE"), fallbackEmoji: "🇩🇪" },
  { code: "FR", name: "France", dialCode: "+33", flagUrl: getFlagUrl("FR"), fallbackEmoji: "🇫🇷" },
  { code: "EG", name: "Egypt", dialCode: "+20", flagUrl: getFlagUrl("EG"), fallbackEmoji: "🇪🇬" },
];

export const PhoneField = ({ label, name = "phone", defaultCountry = "US", error }: PhoneFieldProps) => {
  const [countries, setCountries] = useState<CountryOption[]>(FALLBACK_COUNTRIES);
  const [selectedCountry, setSelectedCountry] = useState<string>(defaultCountry);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const theme = useAppSelector(selectTheme);
  const isDark = theme === "dark";
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  useEffect(() => {
    let isMounted = true;

    const loadCountries = async () => {
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=cca2,name,idd,flags"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch countries");
        }

        const data: Array<{
          cca2: string;
          name?: { common?: string; official?: string };
          idd?: { root?: string; suffixes?: string[] };
          flags?: { svg?: string; png?: string };
        }> = await response.json();

        if (!isMounted) {
          return;
        }

        const normalized = data
          .map<CountryOption | null>((country) => {
            const code = country.cca2?.toUpperCase();
            const root = country.idd?.root ?? "";
            const suffixes = country.idd?.suffixes ?? [];

            if (!code || !root) {
              return null;
            }

            const dialCode = suffixes.length > 0 ? `${root}${suffixes[0]}` : root;
            const nameValue = country.name?.common ?? country.name?.official ?? code;

            return {
              code,
              name: nameValue,
              dialCode,
              flagUrl: country.flags?.svg ?? country.flags?.png ?? getFlagUrl(code),
              fallbackEmoji: getFlagEmoji(code),
            };
          })
          .filter(Boolean) as CountryOption[];

        const unique = Array.from(
          new Map(normalized.map((country) => [country.code, country])).values()
        ).sort((a, b) => a.name.localeCompare(b.name));

        if (unique.length > 0) {
          setCountries(unique);
          setSelectedCountry((prev) =>
            unique.some((country) => country.code === prev) ? prev : unique[0].code
          );
        }
      } catch {
        setCountries(FALLBACK_COUNTRIES);
        setSelectedCountry((prev) =>
          FALLBACK_COUNTRIES.some((country) => country.code === prev)
            ? prev
            : FALLBACK_COUNTRIES[0].code
        );
      }
    };

    void loadCountries();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectCountry = (code: string) => {
    setSelectedCountry(code);
    setIsOpen(false);
    // Update the hidden input when country changes
    if (phoneInputRef.current) {
      const form = phoneInputRef.current.form;
      const hiddenInput = form?.querySelector(`input[name="${name}_full"]`) as HTMLInputElement;
      if (hiddenInput) {
        const phoneNumber = phoneInputRef.current.value;
        const newSelected = countries.find((country) => country.code === code) ?? countries[0];
        hiddenInput.value = phoneNumber ? `${newSelected.dialCode}${phoneNumber}` : "";
      }
    }
  };

  const selected = countries.find((country) => country.code === selectedCountry) ?? countries[0];

  // Autofill styles to override browser defaults
  const autofillStyles = {
    WebkitBoxShadow: isDark ? '0 0 0 1000px #0f1217 inset' : '0 0 0 1000px white inset',
    WebkitTextFillColor: isDark ? 'white' : '#0f1217',
    caretColor: isDark ? 'white' : '#0f1217',
  } as React.CSSProperties;

  return (
    <div className="relative block text-left">
      <label className="relative block">
        <span className={`pointer-events-none absolute ${isRTL ? 'right-5' : 'left-5'} top-0 -translate-y-[40%] px-2 text-base md:text-lg font-medium tracking-wide transition-colors ${
          isDark ? "bg-[#0f1217] text-white" : "bg-white text-black"
        }`}>
          {label}
        </span>
        <div className={`flex h-14 items-center gap-3 rounded-[20px] border pe-4 text-sm transition ${
          error ? 'border-red-500' : isDark ? 'border-gray-700' : 'border-[color:var(--color-auth-border)]'
        } ${isDark ? 'bg-[#0f1217]' : 'bg-white'}`}>
        <input
          ref={phoneInputRef}
          type="tel"
          name={name}
          placeholder="Phone number"
          style={autofillStyles}
          className={`w-full border-e bg-transparent px-5 text-left text-sm md:text-base focus:outline-none transition-colors ${
            isDark 
              ? 'border-gray-700 text-white placeholder:text-gray-500' 
              : 'border-[color:var(--color-auth-border)] text-slate-900 placeholder:text-[color:var(--color-auth-placeholder)]'
          }`}
          autoComplete="tel"
          inputMode="tel"
          onChange={(e) => {
            // Store the full phone number (dial code + number) in a hidden input
            const hiddenInput = e.currentTarget.form?.querySelector(`input[name="${name}_full"]`) as HTMLInputElement;
            if (hiddenInput) {
              const phoneNumber = e.currentTarget.value;
              hiddenInput.value = phoneNumber ? `${selected.dialCode}${phoneNumber}` : "";
            }
          }}
        />
        {/* Hidden input to store the full phone number with dial code */}
        <input type="hidden" name={`${name}_full`} />

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            className={`flex h-10 items-center gap-2 rounded-full px-3 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
              isDark 
                ? 'text-white hover:bg-gray-700' 
                : 'text-slate-800 hover:bg-slate-100'
            }`}
            onClick={() => setIsOpen((prev) => !prev)}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
          >
            {selected?.flagUrl ? (
              <img
                src={selected.flagUrl}
                alt={`${selected.name} flag`}
                className="h-6 w-6 rounded-full object-cover"
                loading="lazy"
              />
            ) : (
              <span className="text-lg">{selected?.fallbackEmoji}</span>
            )}
            <span>{selected?.dialCode ?? ""}</span>
            <svg
              viewBox="0 0 16 16"
              className={`h-4 w-4 transition-transform ${
                isOpen ? "rotate-180" : ""
              } ${isDark ? 'text-gray-400' : 'text-slate-400'}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path d="m4 6 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {isOpen ? (
            <div className={`absolute right-0 z-20 mt-2 w-64 overflow-hidden rounded-[20px] border shadow-xl transition-colors ${
              isDark 
                ? 'border-gray-700 bg-[#1a1f2e]' 
                : 'border-slate-200 bg-white'
            }`}>
              <ul className="max-h-64 overflow-y-auto py-2" role="listbox">
                {countries.map((country) => (
                  <li key={country.code}>
                    <button
                      type="button"
                      onClick={() => handleSelectCountry(country.code)}
                      className={`flex w-full items-center justify-between gap-3 px-4 py-2 text-left text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
                        isDark 
                          ? 'text-white hover:bg-gray-700' 
                          : 'text-slate-700 hover:bg-indigo-50'
                      }`}
                      role="option"
                      aria-selected={country.code === selectedCountry}
                    >
                      <span className="flex items-center gap-3">
                        {country.flagUrl ? (
                          <img
                            src={country.flagUrl}
                            alt={`${country.name} flag`}
                            className="h-5 w-7 rounded-sm object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <span className="text-lg">{country.fallbackEmoji}</span>
                        )}
                        <span className="font-medium">{country.dialCode}</span>
                      </span>
                      <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-400'}`}>{country.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
      </label>
      {error && (
        <p className={` text-sm text-red-600 ${isRTL ? 'text-right' : 'text-left'}`}>{error}</p>
      )}
    </div>
  );
};


