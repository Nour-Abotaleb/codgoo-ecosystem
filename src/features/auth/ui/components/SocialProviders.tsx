type SocialProvider = {
  readonly name: string;
  readonly icon: string;
};

type SocialProvidersProps = {
  readonly label: string;
  readonly providers: readonly SocialProvider[];
};

export const SocialProviders = ({ label, providers }: SocialProvidersProps) => (
  <div className="flex flex-col items-center gap-4">
    <div className="relative w-full">
      <hr className="border-slate-200" />
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-base font-medium tracking-[0.08em] text-[#969696]">
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
            <img src={provider.icon} alt="" className="w-10 h-10 md:w-auto md:h-auto" loading="lazy" />
          </span>
        </button>
      ))}
    </div>
  </div>
);


