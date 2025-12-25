# Tab Navigation with Back Button

This guide explains how the back button now handles tab navigation in addition to browser history.

## How It Works

When you have tabs in your component:
- **Tab 3 → Back Button** → Goes to Tab 2
- **Tab 2 → Back Button** → Goes to Tab 1  
- **Tab 1 → Back Button** → Goes back in browser history

## Quick Start

### Option 1: Using the `useTabState` Hook (Recommended)

Replace your regular `useState` for tabs with `useTabState`:

```tsx
import { useTabState } from "@shared/hooks/useTabState";

// Before:
const [activeTab, setActiveTab] = useState("overview");

// After:
const [activeTab, setActiveTab] = useTabState("overview");
```

That's it! The back button will now automatically navigate through your tabs.

### Option 2: Manual Integration

If you need more control, use the `useTabNavigation` hook directly:

```tsx
import { useTabNavigation } from "@shared/components";

const [activeTab, setActiveTab] = useState("overview");
const { setCurrentTab, resetTabs } = useTabNavigation();

// Register tab changes
useEffect(() => {
  setCurrentTab(activeTab);
}, [activeTab, setCurrentTab]);

// Clean up on unmount
useEffect(() => {
  return () => {
    resetTabs();
  };
}, [resetTabs]);
```

## Example

Here's a complete example from `ProjectDetailsView.tsx`:

```tsx
import { useTabState } from "@shared/hooks/useTabState";

type TabId = "overview" | "tasks" | "invoices" | "attachments";

export const ProjectDetailsView = () => {
  const [activeTab, setActiveTab] = useTabState<TabId>("overview");

  return (
    <div>
      {/* Tab buttons */}
      <button onClick={() => setActiveTab("overview")}>Overview</button>
      <button onClick={() => setActiveTab("tasks")}>Tasks</button>
      <button onClick={() => setActiveTab("invoices")}>Invoices</button>
      
      {/* Tab content */}
      {activeTab === "overview" && <OverviewContent />}
      {activeTab === "tasks" && <TasksContent />}
      {activeTab === "invoices" && <InvoicesContent />}
    </div>
  );
};
```

## Components Already Updated

- ✅ `ProjectDetailsView` - Software dashboard project details with tabs

## Components That Can Be Updated

You can apply this pattern to any component with tabs:
- `OrderView` - Service tabs (domains, hosting, etc.)
- `BillingView` - Billing tabs (invoices, quotes, etc.)
- `MarketplaceDetailView` - Marketplace item tabs
- `TaskDetailView` - Task screen tabs
- Any other component with tab navigation

## Technical Details

### Context Provider

The `TabNavigationProvider` is already set up in `AppProviders.tsx` and wraps your entire app.

### How the Back Button Works

1. When you click the back button, it first checks if there's tab history
2. If there are previous tabs, it navigates to the previous tab
3. If you're on the first tab, it navigates back in browser history

### API Reference

#### `useTabState<T>(initialTab: T)`
- **Parameters**: `initialTab` - The initial tab value
- **Returns**: `[activeTab, setActiveTab]` - Current tab and setter function
- **Type**: Works with string or number tab values

#### `useTabNavigation()`
- **Returns**:
  - `currentTab` - The current active tab
  - `tabHistory` - Array of tab history
  - `setCurrentTab(tab)` - Register a tab change
  - `goToPreviousTab()` - Navigate to previous tab (returns boolean)
  - `resetTabs()` - Clear tab history

## Notes

- Tab history is automatically cleared when you navigate away from a page
- The back button will be disabled if there's no history to go back to
- Tab navigation works seamlessly with browser history navigation
