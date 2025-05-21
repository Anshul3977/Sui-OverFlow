import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Ticket as CricketBat, TrendingUp } from 'lucide-react';
import PlayerCard, { PlayerRarity } from '../components/PlayerCard';

const Collection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRarity, setFilterRarity] = useState<PlayerRarity | 'all'>('all');
  const [filterPosition, setFilterPosition] = useState<string | 'all'>('all');
  const [sortBy, setSortBy] = useState<string>('default');
  const [showFilters, setShowFilters] = useState(false);
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const address = '0x8913ee17391e7d92d11221bf571c8ef7f51820f5ff08b3a44f3f3e7b5a9da0e1';
    fetch(`http://localhost:3000/nfts/${address}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Fetched NFTs:', data);
        const mappedPlayers = data.map((nft: any) => {
          const team = nft.name.includes('Rohit') || nft.name.includes('Jasprit') ? 'Mumbai Indians' : 
                      nft.name.includes('Rishabh') ? 'Delhi Capitals' : 
                      nft.name.includes('Ravindra') ? 'Chennai Super Kings' : 
                      nft.name.includes('MS Dhoni') ? 'Chennai Super Kings' : 
                      'Sunrisers Hyderabad';

          const position = nft.stats > 50 ? 'Bowler' : 
                          nft.stats > 45 ? 'Batsman' : 
                          'Wicket-keeper';

          const isJadeja = nft.name.includes('Ravindra');
          const runs = isJadeja ? 300 : (position === 'Batsman' || position === 'Wicket-keeper' ? Math.round(nft.stats * 10) : 0);

          return {
            id: nft.objectId,
            name: nft.name.replace(' NFT', ''),
            team: team,
            position: position,
            image: nft.image_url,
            rarity: nft.rarity.toLowerCase() as PlayerRarity,
            stats: {
              runs: runs,
              wickets: position === 'Bowler' ? Math.round(nft.stats / 2) : 0,
              catches: position === 'Wicket-keeper' ? Math.round(nft.stats / 3) : Math.round(nft.stats / 5),
              average: position === 'Batsman' || position === 'Wicket-keeper' ? nft.stats : 
                       position === 'Bowler' ? nft.stats / 2 : 0,
            }
          };
        });
        console.log('Mapped Players:', mappedPlayers);
        setPlayers(mappedPlayers);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching NFTs:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const draftNewCard = () => {
    const playerNames = ['Virat Kohli', 'KL Rahul', 'Suryakumar Yadav', 'Hardik Pandya', 'Yuzvendra Chahal'];
    const teams = ['Royal Challengers Bangalore', 'Lucknow Super Giants', 'Mumbai Indians', 'Gujarat Titans', 'Rajasthan Royals'];
    const positions = ['Batsman', 'Bowler', 'Wicket-keeper', 'All-rounder'];
    const rarities: PlayerRarity[] = ['common', 'rare', 'epic', 'legendary'];

    const randomPlayer = playerNames[Math.floor(Math.random() * playerNames.length)];
    const randomTeam = teams[Math.floor(Math.random() * teams.length)];
    const randomPosition = positions[Math.floor(Math.random() * positions.length)];
    const randomRarity = rarities[Math.floor(Math.random() * rarities.length)];

    const baseStats = Math.floor(Math.random() * (70 - 40 + 1)) + 40; // Random stats between 40 and 70
    const newCard = {
      id: `mock_${Date.now()}`,
      name: randomPlayer,
      team: randomTeam,
      position: randomPosition,
      image: `https://example.com/${randomPlayer.toLowerCase().replace(' ', '-')}.jpg`,
      rarity: randomRarity,
      stats: {
        runs: randomPosition === 'Batsman' || randomPosition === 'Wicket-keeper' || randomPosition === 'All-rounder' 
              ? Math.round(baseStats * 10) : 0,
        wickets: randomPosition === 'Bowler' || randomPosition === 'All-rounder' 
                 ? Math.round(baseStats / 2) : 0,
        catches: randomPosition === 'Wicket-keeper' ? Math.round(baseStats / 3) : Math.round(baseStats / 5),
        average: randomPosition === 'Batsman' || randomPosition === 'Wicket-keeper' ? baseStats : 
                 randomPosition === 'Bowler' ? baseStats / 2 : baseStats,
      }
    };

    setPlayers([...players, newCard]);
    alert(`Successfully drafted ${randomPlayer}!`);
  };

  const filteredPlayers = players.filter(player => {
    console.log('Filtering player:', player);
    const searchMatch = !searchQuery || 
      player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (player.name + ' NFT').toLowerCase().includes(searchQuery.toLowerCase());
    
    const rarityMatch = filterRarity === 'all' || player.rarity === filterRarity;
    const positionMatch = filterPosition === 'all' || player.position === filterPosition;

    return searchMatch && rarityMatch && positionMatch;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'rarity':
        const rarityOrder: { [key: string]: number } = { legendary: 0, epic: 1, rare: 2, common: 3 };
        const aRarity = a.rarity in rarityOrder ? rarityOrder[a.rarity] : 999;
        const bRarity = b.rarity in rarityOrder ? rarityOrder[b.rarity] : 999;
        return aRarity - bRarity;
      default:
        return 0;
    }
  });

  console.log('Filtered Players:', filteredPlayers);

  const positions = ['Batsman', 'Bowler', 'Wicket-keeper', 'All-rounder'];
  const rarities = ['legendary', 'epic', 'rare', 'common'];

  const totalValue = players.reduce((sum, player) => {
    const value = player.rarity === 'legendary' ? 20 : 
                  player.rarity === 'epic' ? 15 : 
                  player.rarity === 'rare' ? 10 : 5;
    return sum + value;
  }, 0);

  const collectionPower = players.reduce((sum, player) => sum + player.stats.average, 0);
  const teamsRepresented = new Set(players.map(player => player.team)).size;
  const legendaryCount = players.filter(p => p.rarity === 'legendary').length;

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

  if (loading) {
    return <div className="text-white text-center">Loading your collection...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500 text-center">
        <p>Error: {error}</p>
        <button 
          className="btn btn-primary mt-2"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

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
          <button className="btn btn-primary" onClick={draftNewCard}>
            <CricketBat size={18} />
            <span>Draft New Card</span>
          </button>
        </div>
      </div>

      {filteredPlayers.length === 0 && !loading ? (
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
            <p className="text-2xl font-bold text-white">{totalValue.toFixed(1)} SUI</p>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-4">
            <p className="text-sm text-slate-400 mb-1">Legendary Cards</p>
            <p className="text-2xl font-bold text-white">
              {legendaryCount} / {players.length}
            </p>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-4">
            <p className="text-sm text-slate-400 mb-1">Teams Represented</p>
            <p className="text-2xl font-bold text-white">{teamsRepresented}</p>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-4">
            <p className="text-sm text-slate-400 mb-1">Collection Power</p>
            <div className="flex items-center">
              <p className="text-2xl font-bold text-white">{collectionPower.toFixed(0)}</p>
              <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">+12%</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Collection;