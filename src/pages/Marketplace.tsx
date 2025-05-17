import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, TrendingUp, ArrowUpDown, Tag } from 'lucide-react';
import MarketplaceCard from '../components/MarketplaceCard';

const Marketplace: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRarity, setFilterRarity] = useState<'all' | 'legendary' | 'rare' | 'common'>('all');
  const [filterPosition, setFilterPosition] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('default');
  const [showFilters, setShowFilters] = useState(false);

  // Mock marketplace listings
  const listings = [
    {
      id: '1',
      name: 'MS Dhoni',
      team: 'Chennai Super Kings',
      position: 'Wicket-keeper',
      image: 'https://images.pexels.com/photos/3628912/pexels-photo-3628912.jpeg',
      rarity: 'legendary' as const,
      price: 25.5,
      seller: '0x7f34374a3468c1d6bc6e9ab9fb6319bb',
    },
    {
      id: '2',
      name: 'Ben Stokes',
      team: 'Rajasthan Royals',
      position: 'All-rounder',
      image: 'https://images.pexels.com/photos/15799366/pexels-photo-15799366.jpeg',
      rarity: 'rare' as const,
      price: 12.8,
      seller: '0x9a12bc3d4e5f6789abcdef0123456789',
    },
    {
      id: '3',
      name: 'David Warner',
      team: 'Delhi Capitals',
      position: 'Batsman',
      image: 'https://images.pexels.com/photos/15799367/pexels-photo-15799367.jpeg',
      rarity: 'rare' as const,
      price: 15.2,
      seller: '0xabcdef0123456789abcdef0123456789',
    },
    {
      id: '4',
      name: 'Pat Cummins',
      team: 'Kolkata Knight Riders',
      position: 'Bowler',
      image: 'https://images.pexels.com/photos/9815925/pexels-photo-9815925.jpeg',
      rarity: 'common' as const,
      price: 8.5,
      seller: '0x123456789abcdef0123456789abcdef',
    },
  ];

  // Filter and sort listings
  const filteredListings = listings.filter(listing => {
    if (searchQuery && !listing.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filterRarity !== 'all' && listing.rarity !== filterRarity) {
      return false;
    }
    if (filterPosition !== 'all' && listing.position !== filterPosition) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rarity':
        const rarityOrder = { legendary: 0, rare: 1, common: 2 };
        return rarityOrder[a.rarity] - rarityOrder[b.rarity];
      default:
        return 0;
    }
  });

  const positions = ['Batsman', 'Bowler', 'All-rounder', 'Wicket-keeper'];
  const rarities = ['legendary', 'rare', 'common'];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <motion.h1 
          className="text-3xl font-bold text-white mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          NFT Marketplace
        </motion.h1>
        <motion.p 
          className="text-slate-400"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Buy and sell player cards using SUI tokens
        </motion.p>
      </div>

      <motion.div 
        className="bg-slate-800 p-4 rounded-xl border border-slate-700 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search players..."
              className="w-full bg-slate-700 text-white pl-10 pr-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <select
              className="bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Sort By</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rarity">Rarity</option>
            </select>
            
            <button
              className="btn btn-outline text-white px-3 py-2 flex items-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>
        
        {showFilters && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-700"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <div>
              <p className="text-sm text-slate-400 mb-2">Position</p>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-3 py-1 rounded-full text-sm ${
                    filterPosition === 'all'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                  onClick={() => setFilterPosition('all')}
                >
                  All
                </button>
                {positions.map((position) => (
                  <button
                    key={position}
                    className={`px-3 py-1 rounded-full text-sm ${
                      filterPosition === position
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                    onClick={() => setFilterPosition(position)}
                  >
                    {position}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-sm text-slate-400 mb-2">Rarity</p>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-3 py-1 rounded-full text-sm ${
                    filterRarity === 'all'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                  onClick={() => setFilterRarity('all')}
                >
                  All
                </button>
                {rarities.map((rarity) => (
                  <button
                    key={rarity}
                    className={`px-3 py-1 rounded-full text-sm ${
                      filterRarity === rarity
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                    onClick={() => setFilterRarity(rarity as 'legendary' | 'rare' | 'common')}
                  >
                    {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      <div className="flex justify-between items-center mb-6">
        <p className="text-slate-400">{filteredListings.length} listings found</p>
        <button className="btn btn-primary">
          <Tag size={18} />
          <span>List Card for Sale</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {filteredListings.map((listing) => (
          <MarketplaceCard
            key={listing.id}
            {...listing}
            onBuy={() => console.log(`Buy card ${listing.id}`)}
          />
        ))}
      </div>

      <motion.div 
        className="bg-slate-800 rounded-xl p-6 border border-slate-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp size={20} className="text-green-500" />
          <h3 className="text-xl font-bold text-white">Market Stats</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-700 rounded-lg p-4">
            <p className="text-sm text-slate-400 mb-1">24h Volume</p>
            <p className="text-2xl font-bold text-white">1,245 SUI</p>
            <span className="text-xs text-green-400">+12.5%</span>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-4">
            <p className="text-sm text-slate-400 mb-1">Floor Price</p>
            <p className="text-2xl font-bold text-white">8.5 SUI</p>
            <span className="text-xs text-red-400">-2.3%</span>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-4">
            <p className="text-sm text-slate-400 mb-1">Listed Cards</p>
            <p className="text-2xl font-bold text-white">324</p>
            <span className="text-xs text-green-400">+5.8%</span>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-4">
            <p className="text-sm text-slate-400 mb-1">Unique Owners</p>
            <p className="text-2xl font-bold text-white">156</p>
            <span className="text-xs text-green-400">+3.2%</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Marketplace;