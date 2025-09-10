// src/components/ui/tabs.tsx
'use client';

import React, { useState, ReactNode, ReactElement } from 'react';
import clsx from 'clsx';

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactElement<TabPanelProps>[];
}

interface TabPanelProps {
  label: string;
  children: ReactNode;
}


export const Tabs: React.FC<TabsProps> = ({ children }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="w-full">
      {/* Tab List */}
      <div className="flex justify-center space-x-4 border-b border-gray-700">
        {children.map((child, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={clsx(
                'px-4 py-2 text-sm font-medium focus:outline-none transition',
                isActive
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-400 hover:text-blue-400'
              )}
            >
              {child.props.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="mt-6">
        {children[activeIndex]}
      </div>
    </div>
  );
};

export const TabPanel: React.FC<TabPanelProps> = ({ children }) => {
  return <div>{children}</div>;
};
