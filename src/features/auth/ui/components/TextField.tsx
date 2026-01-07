import { useAppSelector } from "@store/hooks";
import { selectTheme } from "@store/theme/theme-slice";
import { useTranslation } from "react-i18next";

type TextFieldProps = {
  readonly name: string;
  readonly type?: string;
  readonly label?: string;
  readonly placeholder: string;
  readonly autoComplete?: string;
  readonly autoFocus?: boolean;
  readonly required?: boolean;
  readonly error?: string;
};

export const TextField = ({
  name,
  type = "text",
  label,
  placeholder,
  autoComplete,
  autoFocus,
  required,
  error,
}: TextFieldProps) => {
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
          isDark ? "bg-[#0F1217]  text-white" : "bg-white text-black"
        }`}>
          {label ?? placeholder}
        </span>
        <div className={`flex h-14 items-center overflow-hidden rounded-[20px] border text-sm transition ${
          error ? 'border-red-500' : isDark ? 'border-gray-700' : 'border-[color:var(--color-auth-border)]'
        } ${isDark ? 'bg-[#0f1217]' : 'bg-white'}`}>
          <input
            id={name}
            name={name}
            type={type}
            placeholder={placeholder}
            autoComplete={autoComplete}
            autoFocus={autoFocus}
            required={required}
            style={autofillStyles}
            className={`h-full w-full border-none bg-transparent px-5 text-sm md:text-base focus:outline-none transition-colors ${
              isDark ? 'text-white placeholder:text-black' : 'text-slate-700 placeholder:text-[color:var(--color-auth-placeholder)]'
            }`}
          />
        </div>
      </label>
      {error && (
        <p className={`text-sm text-red-600 ${isRTL ? 'text-right' : 'text-left'}`}>{error}</p>
      )}
    </div>
  );
};


