import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";

type TabNavigationContextType = {
  currentTab: string | number | null;
  tabHistory: (string | number)[];
  setCurrentTab: (tab: string | number) => void;
  goToPreviousTab: () => boolean;
  resetTabs: () => void;
};

const TabNavigationContext = createContext<TabNavigationContextType | undefined>(undefined);

export const TabNavigationProvider = ({ children }: { children: ReactNode }) => {
  const [currentTab, setCurrentTabState] = useState<string | number | null>(null);
  const [tabHistory, setTabHistory] = useState<(string | number)[]>([]);

  const setCurrentTab = useCallback((tab: string | number) => {
    setTabHistory((prev) => {
      // Only add to history if it's different from the current tab
      if (prev.length === 0 || prev[prev.length - 1] !== tab) {
        return [...prev, tab];
      }
      return prev;
    });
    setCurrentTabState(tab);
  }, []);

  const goToPreviousTab = useCallback(() => {
    if (tabHistory.length > 1) {
      // Remove current tab from history
      const newHistory = [...tabHistory];
      newHistory.pop();
      const previousTab = newHistory[newHistory.length - 1];
      
      setTabHistory(newHistory);
      setCurrentTabState(previousTab);
      return true;
    }
    return false;
  }, [tabHistory]);

  const resetTabs = useCallback(() => {
    setCurrentTabState(null);
    setTabHistory([]);
  }, []);

  return (
    <TabNavigationContext.Provider
      value={{
        currentTab,
        tabHistory,
        setCurrentTab,
        goToPreviousTab,
        resetTabs,
      }}
    >
      {children}
    </TabNavigationContext.Provider>
  );
};

export const useTabNavigation = () => {
  const context = useContext(TabNavigationContext);
  if (context === undefined) {
    throw new Error("useTabNavigation must be used within a TabNavigationProvider");
  }
  return context;
};
