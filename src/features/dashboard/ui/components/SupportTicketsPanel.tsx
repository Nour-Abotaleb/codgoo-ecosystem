import type { DashboardTokens, TicketItem } from "../types";

type SupportTicketsPanelProps = {
  readonly tickets: readonly TicketItem[];
  readonly tokens: DashboardTokens;
};

export const SupportTicketsPanel = ({
  tickets,
  tokens
}: SupportTicketsPanelProps) => (
  <section className={`${tokens.cardBase} rounded-[32px] px-7 py-6`}>
    <header className="flex items-center justify-between">
      <h2 className="text-xl font-semibold">Recent Support Tickets</h2>
      <button
        type="button"
        className={`${tokens.buttonGhost} rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide`}
      >
        See All
      </button>
    </header>

    <div className="mt-6 space-y-4">
      {tickets.map((ticketItem) => (
        <div
          key={ticketItem.id}
          className={`${tokens.surfaceMuted} rounded-3xl px-5 py-6`}
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold">{ticketItem.id}</span>
            <span className={`${tokens.chipClass} ${tokens.buttonFilled}`}>
              {ticketItem.tag}
            </span>
          </div>
          <p className="mt-3 text-base font-semibold">{ticketItem.title}</p>
          <div className={`mt-5 flex items-center gap-4 text-xs ${tokens.subtleText}`}>
            <span>{ticketItem.date}</span>
            <span className="h-1 w-1 rounded-full bg-current opacity-60" />
            <span>{ticketItem.time}</span>
          </div>
        </div>
      ))}
    </div>

    <button
      type="button"
      className={`mt-6 w-full rounded-full px-6 py-3 text-sm font-semibold ${tokens.buttonFilled}`}
    >
      Open New Ticket
    </button>
  </section>
);


