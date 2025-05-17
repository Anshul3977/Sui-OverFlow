import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Ticket as CricketBat, TrendingUp } from 'lucide-react';
import PlayerCard, { PlayerRarity } from '../components/PlayerCard';

// Mock data
const mockPlayers = [
  {
    id: '1',
    name: 'Virat Kohli',
    team: 'Royal Challengers',
    position: 'Batsman',
    image: 'https://images.pexels.com/photos/3628912/pexels-photo-3628912.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rarity: 'legendary' as PlayerRarity,
    stats: {
      runs: 874,
      average: 49.8,
      catches: 12
    }
  },
  {
    id: '2',
    name: 'Jasprit Bumrah',
    team: 'Mumbai Indians',
    position: 'Bowler',
    image: 'https://images.pexels.com/photos/15799366/pexels-photo-15799366/free-photo-of-cricket-bowler-about-to-release-the-ball.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rarity: 'rare' as PlayerRarity,
    stats: {
      wickets: 28,
      average: 22.3
    }
  },
  {
    id: '3',
    name: 'Jos Buttler',
    team: 'Rajasthan Royals',
    position: 'Wicket-keeper',
    image: 'https://images.pexels.com/photos/15799367/pexels-photo-15799367/free-photo-of-a-cricket-batsman-with-his-bat-up.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rarity: 'rare' as PlayerRarity,
    stats: {
      runs: 723,
      average: 45.2,
      catches: 18
    }
  },
  {
    id: '4',
    name: 'Rohit Sharma',
    team: 'Mumbai Indians',
    position: 'Batsman',
    image: 'https://images.pexels.com/photos/9815925/pexels-photo-9815925.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rarity: 'legendary' as PlayerRarity,
    stats: {
      runs: 812,
      average: 47.6,
      catches: 9
    }
  },
  {
    id: '5',
    name: 'Rashid Khan',
    team: 'Gujarat Titans',
    position: 'Bowler',
    image: 'https://images.pexels.com/photos/11724894/pexels-photo-11724894.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rarity: 'rare' as PlayerRarity,
    stats: {
      wickets: 32,
      average: 18.7
    }
  },
  {
    id: '6',
    name: 'KL Rahul',
    team: 'Lucknow Supergiants',
    position: 'Batsman',
    image: 'https://images.pexels.com/photos/9815886/pexels-photo-9815886.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rarity: 'common' as PlayerRarity,
    stats: {
      runs: 684,
      average: 42.3,
      catches: 4
    }
  },
  {
    id: '7',
    name: 'Hardik Pandya',
    team: 'Mumbai Indians',
    position: 'All-rounder',
    image: 'https://images.pexels.com/photos/11724972/pexels-photo-11724972.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rarity: 'common' as PlayerRarity,
    stats: {
      runs: 428,
      wickets: 14,
      average: 31.2
    }
  },
  {
    id: '8',
    name: 'Kane Williamson',
    team: 'Sunrisers Hyderabad',
    position: 'Batsman',
    image: 'https://images.pexels.com/photos/3866505/pexels-photo-3866505.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rarity: 'common' as PlayerRarity,
    stats: {
      runs: 546,
      average: 38.9,
      catches: 7
    }
  }
];

const Collection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRarity, setFilterRarity] = useState<PlayerRarity | 'all'>('all');
  const [filterPosition, setFilterPosition] = useState<string | 'all'>('all');
  const [sortBy, setSortBy] = useState<string>('default');
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort the players
  const filteredPlayers = mockPlayers.filter(player => {
    // Search filter
    if (searchQuery && !player.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Rarity filter
    if (filterRarity !== 'all' && player.rarity !== filterRarity) {
      return false;
    }
    
    // Position filter
    if (filterPosition !== 'all' && player.position !== filterPosition) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    // Sorting
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'rarity':
        // Sort by rarity (legendary > rare > common)
        const rarityOrder = { legendary: 0, rare: 1, common: 2 };
        return rarityOrder[a.rarity] - rarityOrder[b.rarity];
      default:
        return 0;
    }
  });

  const positions = ['Batsman', 'Bowler', 'Wicket-keeper', 'All-rounder'];
  const rarities = ['legendary', 'rare', 'common'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <motion.h1 
          className="text-3xl font-bold text-white mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          My Collection
        </motion.h1>
        <motion.p 
          className="text-slate-400"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Manage your player cards and build your dream team
        </motion.p>
      </div>

      <motion.div 
        className="bg-slate-800 p-4 rounded-xl border border-slate-700 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
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
              <option value="name">Name (A-Z)</option>
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
                    onClick={() => setFilterRarity(rarity as PlayerRarity)}
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
        <p className="text-slate-400">{filteredPlayers.length} cards found</p>
        <div className="flex gap-2">
          <button className="btn btn-primary">
            <CricketBat size={18} />
            <span>Draft New Card</span>
          </button>
        </div>
      </div>

      {filteredPlayers.length === 0 ? (
        <div className="bg-slate-800 rounded-xl p-8 text-center border border-slate-700">
          <div className="flex justify-center mb-4">
            <CricketBat size={48} className="text-slate-600" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Cards Found</h3>
          <p className="text-slate-400 mb-4">Try adjusting your search or filters</p>
          <button 
            className="btn btn-primary"
            onClick={() => {
              setSearchQuery('');
              setFilterRarity('all');
              setFilterPosition('all');
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredPlayers.map((player) => (
            <PlayerCard 
              key={player.id}
              {...player}
              onClick={() => console.log(`Selected player ${player.id}`)}
            />
          ))}
        </motion.div>
      )}

      <motion.div 
        className="mt-8 bg-slate-800 rounded-xl p-6 border border-slate-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp size={20} className="text-green-500" />
          <h3 className="text-xl font-bold text-white">Collection Stats</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-700 rounded-lg p-4">
            <p className="text-sm text-slate-400 mb-1">Total Value</p>
            <p className="text-2xl font-bold text-white">65.2 SUI</p>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-4">
            <p className="text-sm text-slate-400 mb-1">Legendary Cards</p>
            <p className="text-2xl font-bold text-white">
              {mockPlayers.filter(p => p.rarity === 'legendary').length} / {mockPlayers.length}
            </p>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-4">
            <p className="text-sm text-slate-400 mb-1">Teams Represented</p>
            <p className="text-2xl font-bold text-white">5</p>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-4">
            <p className="text-sm text-slate-400 mb-1">Collection Power</p>
            <div className="flex items-center">
              <p className="text-2xl font-bold text-white">876</p>
              <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">+12%</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Collection;