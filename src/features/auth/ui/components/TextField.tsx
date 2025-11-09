type TextFieldProps = {
  readonly name: string;
  readonly type?: string;
  readonly label?: string;
  readonly placeholder: string;
  readonly autoComplete?: string;
  readonly autoFocus?: boolean;
};

export const TextField = ({
  name,
  type = "text",
  label,
  placeholder,
  autoComplete,
  autoFocus,
}: TextFieldProps) => (
  <label htmlFor={name} className="relative block text-left">
    <span className="pointer-events-none absolute left-5 top-0 -translate-y-[40%] bg-white px-2 text-base md:text-lg font-medium tracking-wide text-black">
      {label ?? placeholder}
    </span>
    <input
      id={name}
      name={name}
      type={type}
      placeholder={placeholder}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      className="h-14 w-full rounded-[16px] border border-[color:var(--color-auth-border)] bg-white px-5 text-sm text-slate-700 transition placeholder:text-[color:var(--color-auth-placeholder)] focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
    />
  </label>
);


