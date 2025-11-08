import type { DashboardTokens } from "../types";

type UtilityPanelsProps = {
  readonly tokens: DashboardTokens;
};

export const UtilityPanels = ({ tokens }: UtilityPanelsProps) => (
  <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
    <section className={`${tokens.cardBase} rounded-[32px] px-7 py-6`}>
      <h2 className="text-xl font-semibold">Manage Your Security</h2>
      <p className={`mt-3 text-sm ${tokens.subtleText}`}>
        Choose the domain you would like to secure and manage your certificates.
      </p>

      <div className="mt-6 space-y-4">
        <label className="flex flex-col gap-2 text-sm font-medium">
          <span className={tokens.subtleText}>Choose Domain</span>
          <div
            className={`${tokens.surfaceMuted} flex items-center justify-between gap-3 rounded-full px-4 py-3`}
          >
            <input
              className="w-full bg-transparent text-sm outline-none"
              placeholder="Domain Name"
            />
            <span className={`${tokens.chipClass} ${tokens.buttonFilled} px-3`}>
              Search
            </span>
          </div>
        </label>
      </div>
    </section>

    <section className={`${tokens.cardBase} rounded-[32px] px-7 py-6`}>
      <h2 className="text-xl font-semibold">Build Your Website</h2>
      <p className={`mt-3 text-sm ${tokens.subtleText}`}>
        Choose a domain to begin building your new site with our guided setup.
      </p>
      <div className="mt-6 space-y-4">
        <label className="flex flex-col gap-2 text-sm font-medium">
          <span className={tokens.subtleText}>Choose Domain</span>
          <div
            className={`${tokens.surfaceMuted} flex items-center gap-3 rounded-full px-4 py-3`}
          >
            <input
              className="w-full bg-transparent text-sm outline-none"
              placeholder="Domain Name"
            />
            <span className={`${tokens.chipClass} ${tokens.buttonFilled} px-3`}>
              Start
            </span>
          </div>
        </label>
      </div>
    </section>
  </div>
);


