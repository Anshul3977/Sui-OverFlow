import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, AlertCircle, Check, Trophy } from 'lucide-react';
import PlayerCard, { PlayerRarity } from '../components/PlayerCard';

interface Player {
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
}

const TeamBuilder: React.FC = () => {
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  
  // Mock available players
  const availablePlayers: Player[] = [
    {
      id: '1',
      name: 'Virat Kohli',
      team: 'Royal Challengers',
      position: 'Batsman',
      image: 'https://images.pexels.com/photos/3628912/pexels-photo-3628912.jpeg',
      rarity: 'legendary',
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
      image: 'https://images.pexels.com/photos/15799366/pexels-photo-15799366.jpeg',
      rarity: 'rare',
      stats: {
        wickets: 28,
        average: 22.3
      }
    }
  ];

  const handlePlayerSelect = (player: Player) => {
    if (selectedPlayers.find(p => p.id === player.id)) {
      setSelectedPlayers(selectedPlayers.filter(p => p.id !== player.id));
    } else if (selectedPlayers.length < 5) {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  const isTeamValid = () => {
    const positions = selectedPlayers.map(p => p.position);
    const teams = selectedPlayers.map(p => p.team);
    
    return (
      positions.filter(p => p === 'Batsman').length >= 2 &&
      positions.filter(p => p === 'Bowler').length >= 2 &&
      positions.filter(p => p === 'All-rounder').length >= 1 &&
      new Set(teams).size >= 3 // At least 3 different teams
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <motion.h1 
          className="text-3xl font-bold text-white mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Team Builder
        </motion.h1>
        <motion.p 
          className="text-slate-400"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Build your dream team with your NFT player cards
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Users size={20} className="text-indigo-400" />
              <h2 className="text-xl font-bold text-white">Team Requirements</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="text-sm text-slate-300 mb-1">Batsmen</p>
                <p className="text-2xl font-bold text-white">
                  {selectedPlayers.filter(p => p.position === 'Batsman').length} / 2
                </p>
              </div>
              
              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="text-sm text-slate-300 mb-1">Bowlers</p>
                <p className="text-2xl font-bold text-white">
                  {selectedPlayers.filter(p => p.position === 'Bowler').length} / 2
                </p>
              </div>
              
              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="text-sm text-slate-300 mb-1">All-rounders</p>
                <p className="text-2xl font-bold text-white">
                  {selectedPlayers.filter(p => p.position === 'All-rounder').length} / 1
                </p>
              </div>
            </div>

            <div className="bg-indigo-900/30 rounded-lg border border-indigo-800/50 p-4 mb-6">
              <div className="flex items-start gap-2">
                <AlertCircle size={16} className="text-indigo-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-indigo-300">Team Rules</p>
                  <ul className="text-xs text-indigo-300/80 list-disc list-inside mt-1">
                    <li>Maximum 2 players from the same team</li>
                    <li>Must have players from at least 3 different teams</li>
                    <li>Team power is boosted by player rarity</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {availablePlayers.map((player) => (
                <PlayerCard
                  key={player.id}
                  {...player}
                  selectedForTeam={selectedPlayers.some(p => p.id === player.id)}
                  onClick={() => handlePlayerSelect(player)}
                />
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 sticky top-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Team Preview</h3>
              <div className="flex items-center gap-2">
                <Trophy size={16} className="text-yellow-400" />
                <span className="text-sm text-yellow-400">Power: 450</span>
              </div>
            </div>

            {selectedPlayers.length > 0 ? (
              <div className="space-y-4">
                {selectedPlayers.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center gap-3 bg-slate-700/50 rounded-lg p-3"
                  >
                    <img
                      src={player.image}
                      alt={player.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-white">{player.name}</p>
                      <p className="text-xs text-slate-400">{player.position}</p>
                    </div>
                    <button
                      className="ml-auto text-red-400 hover:text-red-300"
                      onClick={() => handlePlayerSelect(player)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users size={48} className="mx-auto text-slate-600 mb-4" />
                <p className="text-slate-400">No players selected</p>
              </div>
            )}

            <button
              className={`btn w-full mt-6 ${
                isTeamValid()
                  ? 'btn-primary'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
              disabled={!isTeamValid()}
            >
              {isTeamValid() ? (
                <>
                  <Check size={16} />
                  Submit Team
                </>
              ) : (
                'Complete Team Requirements'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamBuilder;