import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { I18nextProvider } from "react-i18next";
import { HashRouter } from "react-router-dom";

import { i18n } from "@shared/config/i18n";
import { ThemeProvider, store } from "@store";
import { TabNavigationProvider } from "@shared/components";

type AppProvidersProps = {
  readonly children: ReactNode;
};

export const AppProviders = ({ children }: AppProvidersProps) => (
  <Provider store={store}>
    <ThemeProvider>
      <I18nextProvider i18n={i18n}>
        <HashRouter>
          <TabNavigationProvider>
            {children}
          </TabNavigationProvider>
        </HashRouter>
      </I18nextProvider>
    </ThemeProvider>
  </Provider>
);

