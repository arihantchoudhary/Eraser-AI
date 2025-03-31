"use client";

import React, { useState, createContext, useContext } from "react";
import { cn } from "../../lib/utils";

type TabsContextType = {
  activeTab: string;
  setActiveTab: (id: string) => void;
};

const TabsContext = createContext<TabsContextType | undefined>(undefined);

function useTabs() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs provider");
  }
  return context;
}

interface TabsProps {
  defaultValue: string;
  className?: string;
  children: React.ReactNode;
}

function Tabs({ defaultValue, className, children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn("w-full", className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}

function TabsList({ className, children }: TabsListProps) {
  return (
    <div
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-600",
        className
      )}
    >
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

function TabsTrigger({ value, className, children }: TabsTriggerProps) {
  const { activeTab, setActiveTab } = useTabs();
  const isActive = activeTab === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => setActiveTab(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all",
        "focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        isActive ? "bg-white text-blue-700 shadow-sm" : "hover:bg-gray-200 hover:text-gray-800",
        className
      )}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

function TabsContent({ value, className, children }: TabsContentProps) {
  const { activeTab } = useTabs();
  
  if (activeTab !== value) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      className={cn(
        "mt-2 focus:outline-none",
        className
      )}
    >
      {children}
    </div>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
