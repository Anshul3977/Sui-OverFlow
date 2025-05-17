import React from 'react';
import { motion } from 'framer-motion';
import { Tag, Star, DollarSign } from 'lucide-react';
import { PlayerRarity } from './PlayerCard';

interface MarketplaceCardProps {
  id: string;
  name: string;
  team: string;
  position: string;
  image: string;
  rarity: PlayerRarity;
  price: number;
  seller: string;
  onBuy: () => void;
}

const MarketplaceCard: React.FC<MarketplaceCardProps> = ({
  name,
  team,
  position,
  image,
  rarity,
  price,
  seller,
  onBuy,
}) => {
  const rarityConfig = {
    legendary: {
      borderColor: 'border-yellow-400',
      gradientClass: 'bg-gradient-to-br from-yellow-400/20 to-yellow-600/20',
      stars: 3
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

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <motion.div
      className={`card relative border-2 ${rarityConfig[rarity].borderColor}`}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className={`h-2 ${rarityConfig[rarity].gradientClass}`}></div>
      
      <div className="p-4">
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg mb-3">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 flex gap-0.5">
            {[...Array(rarityConfig[rarity].stars)].map((_, i) => (
              <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
            ))}
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
            <p className="text-white text-sm font-medium">{team}</p>
          </div>
        </div>
        
        <h3 className="font-bold text-slate-800 dark:text-white truncate">{name}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{position}</p>
        
        <div className="flex items-center justify-between mb-2 mt-3">
          <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
            <Tag size={12} className="mr-1" />
            <a 
              href={`/profile/${seller}`} 
              className="hover:text-indigo-400 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                // Add profile navigation logic
              }}
            >
              Seller: {truncateAddress(seller)}
            </a>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center">
            <DollarSign size={20} className="text-indigo-500 mr-1" />
            <span className="text-2xl font-bold text-slate-800 dark:text-white">{price} SUI</span>
          </div>
          
          <button
            className="btn btn-primary py-2 px-4"
            onClick={onBuy}
          >
            Buy Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MarketplaceCard;