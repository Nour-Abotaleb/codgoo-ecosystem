import type { DashboardTokens, ProductItem } from "../types";
import { PlaceholderIcon } from "./PlaceholderIcon";

type ProductsTableProps = {
  readonly products: readonly ProductItem[];
  readonly tokens: DashboardTokens;
};

export const ProductsTable = ({
  products,
  tokens
}: ProductsTableProps) => (
  <section className={`${tokens.cardBase} rounded-[32px] px-7 py-6`}>
    <header className="flex flex-wrap items-center justify-between gap-4">
      <h2 className="text-xl font-semibold">Your Active Products/Services</h2>
      <button
        type="button"
        className={`${tokens.buttonGhost} inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide`}
      >
        See All
      </button>
    </header>

    <div className={`mt-6 divide-y ${tokens.divider}`}>
      <div
        className={`grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,120px)] gap-4 px-2 text-xs font-semibold uppercase tracking-widest ${tokens.subtleText}`}
      >
        <span>Server Name</span>
        <span>Host</span>
        <span>Cost</span>
        <span>Renewal Date</span>
        <span className="text-right">Manage</span>
      </div>

      {products.map((product) => (
        <div
          key={product.id}
          className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,120px)] items-center gap-4 px-2 py-4 text-sm"
        >
          <div className="flex items-center gap-3">
            <PlaceholderIcon label={product.server} tokens={tokens} />
            <span className="font-medium">{product.server}</span>
          </div>
          <span className={tokens.subtleText}>{product.type}</span>
          <span className="font-semibold">{product.cost}</span>
          <span className={tokens.subtleText}>{product.renewal}</span>
          <div className="flex justify-end">
            <button
              type="button"
              className={`${tokens.buttonGhost} rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide`}
            >
              Manage
            </button>
          </div>
        </div>
      ))}
    </div>
  </section>
);


