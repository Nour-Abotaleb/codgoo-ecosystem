import { useAppSelector } from "@store/hooks";
import { selectTheme } from "@store/theme/theme-slice";

type SocialProvider = {
  readonly name: string;
  readonly icon: string;
};

type SocialProvidersProps = {
  readonly label: string;
  readonly providers: readonly SocialProvider[];
};

export const SocialProviders = ({ label, providers }: SocialProvidersProps) => {
  const theme = useAppSelector(selectTheme);
  const isDark = theme === "dark";

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full">
        <hr className={`transition-colors ${isDark ? "border-gray-700" : "border-slate-200"}`} />
        <span className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-4 text-base font-medium tracking-[0.08em] text-nowrap transition-colors ${
          isDark ? "bg-[#0F1217] text-gray-400" : "bg-white text-[color:var(--color-auth-helper)]"
        }`}>
          {label}
        </span>
      </div>

      <div className="flex flex-wrap justify-center gap-10 mt-4">
        {providers.map((provider) => (
          <button
            key={provider.name}
            type="button"
            className="flex items-center justify-center cursor-pointer"
          >
            <span className="flex items-center justify-center">
              <img src={provider.icon} alt="" className="w-8 h-8" loading="lazy" />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};


