import { useEffect, useRef, useState } from "react";

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

export const PhoneField = ({ label, name = "phone", defaultCountry = "US" }: PhoneFieldProps) => {
  const [countries, setCountries] = useState<CountryOption[]>(FALLBACK_COUNTRIES);
  const [selectedCountry, setSelectedCountry] = useState<string>(defaultCountry);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
  };

  const selected = countries.find((country) => country.code === selectedCountry) ?? countries[0];

  return (
    <label className="relative block text-left">
      <span className="pointer-events-none absolute left-5 top-0 -translate-y-[40%] bg-white px-2 text-base md:text-lg font-medium tracking-wide text-black">
        {label}
      </span>
      <div className="flex h-14 items-center gap-3 rounded-[16px] border border-[#E6E6E6] bg-white pe-4 text-sm text-slate-600 transition focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
        <input
          type="tel"
          name={name}
          placeholder="Phone number"
          className="w-full border-e border-[#E6E6E6] bg-transparent px-5 text-left text-sm text-slate-900 placeholder:text-[#6B6B6B] focus:outline-none"
          autoComplete="tel"
          inputMode="tel"
        />

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            className="flex h-10 items-center gap-2 rounded-full px-3 text-sm font-medium text-slate-800 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
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
              className={`h-4 w-4 text-slate-400 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path d="m4 6 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {isOpen ? (
            <div className="absolute right-0 z-20 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
              <ul className="max-h-64 overflow-y-auto py-2" role="listbox">
                {countries.map((country) => (
                  <li key={country.code}>
                    <button
                      type="button"
                      onClick={() => handleSelectCountry(country.code)}
                      className="flex w-full items-center justify-between gap-3 px-4 py-2 text-left text-sm text-slate-700 transition hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
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
                      <span className="text-xs text-slate-400">{country.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </label>
  );
};


