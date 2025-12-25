import { useState, useEffect } from "react";
import { useTabNavigation } from "@shared/components";

/**
 * Custom hook to manage tab state with back button integration
 * @param initialTab - The initial tab value
 * @returns [activeTab, setActiveTab] - Current tab and setter function
 */
export function useTabState<T extends string | number>(initialTab: T): [T, (tab: T) => void] {
  const [activeTab, setActiveTabState] = useState<T>(initialTab);
  const { setCurrentTab, resetTabs, currentTab } = useTabNavigation();

  // Register tab changes with the navigation context
  useEffect(() => {
    setCurrentTab(activeTab);
  }, [activeTab, setCurrentTab]);

  // Listen for tab changes from the back button
  useEffect(() => {
    if (currentTab !== null && currentTab !== activeTab) {
      setActiveTabState(currentTab as T);
    }
  }, [currentTab]);

  // Reset tabs when component unmounts
  useEffect(() => {
    return () => {
      resetTabs();
    };
  }, [resetTabs]);

  return [activeTab, setActiveTabState];
}
