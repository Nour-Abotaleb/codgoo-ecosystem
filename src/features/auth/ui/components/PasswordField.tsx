import { useState } from "react";
import { useAppSelector } from "@store/hooks";
import { selectTheme } from "@store/theme/theme-slice";
import { useTranslation } from "react-i18next";

type PasswordFieldProps = {
  readonly name: string;
  readonly label: string;
  readonly placeholder: string;
  readonly autoComplete?: string;
  readonly required?: boolean;
  readonly error?: string;
};

export const PasswordField = ({
  name,
  label,
  placeholder,
  autoComplete,
  required,
  error,
}: PasswordFieldProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const theme = useAppSelector(selectTheme);
  const isDark = theme === "dark";
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  // Autofill styles to override browser defaults
  const autofillStyles = {
    WebkitBoxShadow: isDark ? '0 0 0 1000px #0f1217 inset' : '0 0 0 1000px white inset',
    WebkitTextFillColor: isDark ? 'white' : '#0f1217',
    caretColor: isDark ? 'white' : '#0f1217',
  } as React.CSSProperties;

  return (
    <div className="relative block text-left">
      <label htmlFor={name} className="relative block">
        <span className={`pointer-events-none absolute ${isRTL ? 'right-5' : 'left-5'} top-0 -translate-y-[40%] px-2 text-base md:text-lg font-medium tracking-wide transition-colors ${
          isDark ? "bg-[#0F1217] text-white" : "bg-white text-black"
        }`}>
          {label}
        </span>
        <div className={`flex h-14 items-center overflow-hidden rounded-[20px] border text-sm transition focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 ${
          error ? 'border-red-500' : isDark ? 'border-gray-700' : 'border-[color:var(--color-auth-border)]'
        } ${isDark ? 'bg-[#0f1217]' : 'bg-white'}`}>
          <input
            id={name}
            name={name}
            type={isVisible ? "text" : "password"}
            placeholder={placeholder}
            autoComplete={autoComplete}
            required={required}
            style={autofillStyles}
            className={`h-full w-full border-none bg-transparent px-5 text-sm md:text-base focus:outline-none transition-colors ${
              isDark ? 'text-white placeholder:text-gray-500' : 'text-slate-700 placeholder:text-[color:var(--color-auth-placeholder)]'
            }`}
          />
          <button
            type="button"
            onClick={() => setIsVisible((prev) => !prev)}
            className={`${isRTL ? 'ml-4' : 'mr-4'} flex h-12 w-12 items-center justify-center transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
              isDark ? 'text-gray-400 hover:text-gray-200' : 'text-slate-500 hover:text-slate-700'
            }`}
            aria-label={isVisible ? "Hide password" : "Show password"}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              {isVisible ? (
                <>
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" />
                  <path d="m15 9-6 6" />
                  <path d="m9 9 6 6" />
                </>
              ) : (
                <>
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" />
                  <circle cx="12" cy="12" r="3.5" />
                </>
              )}
            </svg>
          </button>
        </div>
      </label>
      {error && (
        <p className={`mt-1 text-sm text-red-600 ${isRTL ? 'text-right' : 'text-left'}`}>{error}</p>
      )}
    </div>
  );
};


