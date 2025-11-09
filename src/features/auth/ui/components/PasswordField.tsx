import { useState } from "react";

type PasswordFieldProps = {
  readonly name: string;
  readonly label: string;
  readonly placeholder: string;
  readonly autoComplete?: string;
};

export const PasswordField = ({
  name,
  label,
  placeholder,
  autoComplete,
}: PasswordFieldProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <label htmlFor={name} className="relative block text-left">
      <span className="pointer-events-none absolute left-5 top-0 -translate-y-[40%] bg-white px-2 text-base md:text-lg font-medium tracking-wide text-black">
        {label}
      </span>
      <div className="flex h-14 items-center overflow-hidden rounded-[16px] border border-[color:var(--color-auth-border)] bg-white text-sm text-slate-700 transition focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
        <input
          id={name}
          name={name}
          type={isVisible ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="h-full w-full border-none bg-transparent px-5 text-sm text-[color:var(--color-auth-placeholder)] placeholder:text-[color:var(--color-auth-placeholder)] focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setIsVisible((prev) => !prev)}
          className="mr-4 flex h-12 w-12 items-center justify-center text-slate-500 transition hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
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
  );
};


