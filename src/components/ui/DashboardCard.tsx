// components/ui/DashboardCard.tsx
'use client';

import { motion } from 'framer-motion';

interface DashboardCardProps {
  title: string;
  description?: string;
  date?: string;
  time?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function DashboardCard({
  title,
  description,
  date,
  time,
  className = '',
  children,
}: DashboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`bg-gray-900 p-4 rounded-2xl shadow-xl border border-gray-700 ${className}`}
    >
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      {description && <p className="text-sm text-gray-400 mt-1">{description}</p>}
      {(date || time) && (
        <div className="mt-2 text-sm text-gray-300">
          {date && <p>Date: {date}</p>}
          {time && <p>Time: {time}</p>}
        </div>
      )}
      {children && <div className="mt-4">{children}</div>}
    </motion.div>
  );
}
