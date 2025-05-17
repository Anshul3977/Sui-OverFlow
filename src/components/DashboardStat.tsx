import React from 'react';
import { motion } from 'framer-motion';

interface DashboardStatProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: number;
    isPositive: boolean;
  };
  bgClass?: string;
}

const DashboardStat: React.FC<DashboardStatProps> = ({
  title,
  value,
  icon,
  change,
  bgClass = 'bg-slate-800',
}) => {
  return (
    <motion.div
      className={`${bgClass} rounded-xl p-5 border border-slate-700/50`}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-400 text-sm mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-white">{value}</h3>
          
          {change && (
            <div className="flex items-center mt-2">
              <span className={`text-xs ${change.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {change.isPositive ? '↑' : '↓'} {Math.abs(change.value)}%
              </span>
              <span className="text-xs text-slate-400 ml-1">from last week</span>
            </div>
          )}
        </div>
        
        <div className="p-3 bg-slate-700/50 rounded-lg">
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardStat;