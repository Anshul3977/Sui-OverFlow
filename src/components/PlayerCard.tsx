import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Activity } from 'lucide-react';

export type PlayerRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface PlayerCardProps {
  id: string;
  name: string;
  team: string;
  position: string;
  image: string;
  rarity: PlayerRarity;
  stats: {
    runs?: number;
    wickets?: number;
    catches?: number;
    average?: number;
  };
  selectedForTeam?: boolean;
  onClick?: () => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  name,
  team,
  position,
  image,
  rarity,
  stats,
  selectedForTeam,
  onClick,
}) => {
  const [showAllStats, setShowAllStats] = useState(false);

  const rarityConfig = {
    legendary: {
      borderColor: 'border-yellow-400',
      gradientClass: 'bg-gradient-to-br from-yellow-400/20 to-yellow-600/20',
      stars: 3
    },
    epic: {
      borderColor: 'border-purple-400',
      gradientClass: 'bg-gradient-to-br from-purple-400/20 to-purple-600/20',
      stars: 2
    },
    rare: {
      borderColor: 'border-indigo-400',
      gradientClass: 'bg-gradient-to-br from-indigo-400/20 to-indigo-600/20',
      stars: 2
    },
    common: {
      borderColor: 'border-slate-400',
      gradientClass: 'bg-gradient-to-br from-slate-400/20 to-slate-600/20',
      stars: 1
    }
  };

  const config = rarityConfig[rarity] || rarityConfig.common;

  return (
    <motion.div
      className={`card relative border-2 ${config.borderColor} ${selectedForTeam ? 'ring-2 ring-emerald-500' : ''}`}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
    >
      <div className={`h-2 ${config.gradientClass}`}></div>
      
      <div className="p-4">
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg mb-3">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 flex gap-0.5">
            {[...Array(config.stars)].map((_, i) => (
              <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
            ))}
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
            <p className="text-white text-sm font-medium">{team}</p>
          </div>
        </div>
        
        <h3 className="font-bold text-slate-800 dark:text-white">{name}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{position}</p>
        
        {/* Key Stats Display - Always show Runs and Wickets */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-slate-100 dark:bg-slate-700/50 p-2 rounded">
            <p className="text-xs text-slate-500 dark:text-slate-400">Runs</p>
            <p className="font-bold text-lg text-black dark:text-slate-200">{stats.runs ?? 0}</p>
          </div>
          <div className="bg-slate-100 dark:bg-slate-700/50 p-2 rounded">
            <p className="text-xs text-slate-500 dark:text-slate-400">Wickets</p>
            <p className="font-bold text-lg text-black dark:text-slate-200">{stats.wickets ?? 0}</p>
          </div>
        </div>
        
        {/* Additional Stats on Click */}
        {showAllStats && (
          <motion.div
            className="bg-slate-100 dark:bg-slate-700/50 p-2 rounded mb-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-xs text-slate-500 dark:text-slate-400">Catches</p>
            <p className="font-medium text-black dark:text-slate-200">{stats.catches ?? 0}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Average</p>
            <p className="font-medium text-black dark:text-slate-200">{stats.average ?? 0}</p>
          </motion.div>
        )}
        
        <button 
          className="w-full text-sm text-indigo-500 hover:text-indigo-400 transition-colors flex items-center justify-center gap-1"
          onClick={(e) => {
            e.stopPropagation();
            setShowAllStats(!showAllStats);
          }}
        >
          <Activity size={14} />
          {showAllStats ? 'Hide Stats' : 'View All Stats'}
        </button>
      </div>
      
      {selectedForTeam && (
        <div className="absolute top-4 left-4 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">
          Selected
        </div>
      )}
    </motion.div>
  );
};

export default PlayerCard;