import React from 'react';
import { Ticket as CricketBat } from 'lucide-react';
import { motion } from 'framer-motion';

const Logo: React.FC = () => {
  return (
    <motion.div 
      className="flex items-center justify-center w-10 h-10 bg-indigo-600 rounded-lg overflow-hidden"
      whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }}
    >
      <CricketBat size={20} className="text-white" />
    </motion.div>
  );
};

export default Logo;