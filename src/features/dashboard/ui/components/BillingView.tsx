import type { DashboardTokens, DashboardAppId } from "../types";
import { AppBillingView } from "./app/AppBillingView";
import { UnifiedBillingView } from "./UnifiedBillingView";

type BillingViewProps = {
  readonly tokens: DashboardTokens;
  readonly activeAppId: DashboardAppId;
};

export const BillingView = ({ tokens, activeAppId }: BillingViewProps) => {

  // For software, show the unified card-based billing view
  if (activeAppId === "software") {
    return <UnifiedBillingView tokens={tokens} activeAppId={activeAppId} />;
  }

  // For app, show the dedicated billing experience
  if (activeAppId === "app") {
    return <AppBillingView tokens={tokens} />;
  }

  // For cloud, show the unified card-based billing view
  return <UnifiedBillingView tokens={tokens} activeAppId={activeAppId} />;
};

