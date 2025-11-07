import { ReactNode } from "react";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter } from "react-router-dom";

import { i18n } from "@shared/config/i18n";
import { ThemeProvider } from "@store";

type AppProvidersProps = {
  readonly children: ReactNode;
};

export const AppProviders = ({ children }: AppProvidersProps) => (
  <ThemeProvider>
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>{children}</BrowserRouter>
    </I18nextProvider>
  </ThemeProvider>
);

