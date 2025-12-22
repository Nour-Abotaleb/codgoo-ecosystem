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
}: TextFieldProps) => (
  <div className="relative block text-left">
    <label htmlFor={name} className="relative block">
      <span className="pointer-events-none absolute left-5 top-0 -translate-y-[40%] bg-white px-2 text-base md:text-lg font-medium tracking-wide text-black">
        {label ?? placeholder}
      </span>
      <div className={`flex h-14 items-center overflow-hidden rounded-[16px] border bg-white text-sm text-slate-700 transition focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 ${error ? 'border-red-500' : 'border-[color:var(--color-auth-border)]'}`}>
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          required={required}
          className="h-full w-full border-none bg-transparent px-5 text-sm md:text-base text-slate-700 placeholder:text-[color:var(--color-auth-placeholder)] focus:outline-none"
        />
      </div>
    </label>
    {error && (
      <p className="mt-1 text-sm text-red-600">{error}</p>
    )}
  </div>
);


