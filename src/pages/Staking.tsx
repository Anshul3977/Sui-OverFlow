import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PiggyBank, Lock, Unlock, TrendingUp, ArrowRight, Info, Trophy, Star } from 'lucide-react';
import PlayerCard from '../components/PlayerCard';

const Staking: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'staked' | 'unstaked'>('staked');

  // Mock staked NFTs
  const stakedNFTs = [
    {
      id: '1',
      name: 'Virat Kohli',
      team: 'Royal Challengers',
      position: 'Batsman',
      image: 'https://images.pexels.com/photos/3628912/pexels-photo-3628912.jpeg',
      rarity: 'legendary' as const,
      stats: {
        runs: 874,
        average: 49.8,
        catches: 12
      },
      stakingRewards: 0.5,
      timeStaked: '30 days'
    },
    {
      id: '2',
      name: 'Jasprit Bumrah',
      team: 'Mumbai Indians',
      position: 'Bowler',
      image: 'https://images.pexels.com/photos/15799366/pexels-photo-15799366.jpeg',
      rarity: 'rare' as const,
      stats: {
        wickets: 28,
        average: 22.3
      },
      stakingRewards: 0.3,
      timeStaked: '15 days'
    }
  ];

  // Mock unstaked NFTs
  const unstakedNFTs = [
    {
      id: '3',
      name: 'Jos Buttler',
      team: 'Rajasthan Royals',
      position: 'Wicket-keeper',
      image: 'https://images.pexels.com/photos/15799367/pexels-photo-15799367.jpeg',
      rarity: 'rare' as const,
      stats: {
        runs: 723,
        average: 45.2,
        catches: 18
      }
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <motion.h1 
          className="text-3xl font-bold text-white mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          NFT Staking
        </motion.h1>
        <motion.p 
          className="text-slate-400"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Stake your player cards to earn SUI rewards
        </motion.p>
      </div>

      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="lg:col-span-2">
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="flex border-b border-slate-700">
              <button
                className={`flex-1 px-4 py-3 text-sm font-medium ${
                  activeTab === 'staked'
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
                onClick={() => setActiveTab('staked')}
              >
                Staked NFTs ({stakedNFTs.length})
              </button>
              <button
                className={`flex-1 px-4 py-3 text-sm font-medium ${
                  activeTab === 'unstaked'
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
                onClick={() => setActiveTab('unstaked')}
              >
                Unstaked NFTs ({unstakedNFTs.length})
              </button>
            </div>

            <div className="p-4">
              {activeTab === 'staked' ? (
                stakedNFTs.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {stakedNFTs.map((nft) => (
                      <div key={nft.id} className="relative">
                        <PlayerCard {...nft} />
                        <div className="absolute top-2 right-2 bg-green-500/90 text-white text-xs px-2 py-1 rounded-full flex items-center">
                          <Lock size={12} className="mr-1" />
                          Staked
                        </div>
                        <div className="mt-2 bg-slate-700/50 rounded-lg p-3">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-400">Time Staked:</span>
                            <span className="text-white">{nft.timeStaked}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm mt-1">
                            <span className="text-slate-400">Rewards Earned:</span>
                            <span className="text-emerald-400">{nft.stakingRewards} SUI</span>
                          </div>
                          <button className="btn btn-primary w-full mt-3">
                            <Unlock size={16} />
                            Unstake
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <PiggyBank size={48} className="mx-auto text-slate-600 mb-4" />
                    <p className="text-slate-400">No NFTs staked yet</p>
                  </div>
                )
              ) : (
                unstakedNFTs.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {unstakedNFTs.map((nft) => (
                      <div key={nft.id} className="relative">
                        <PlayerCard {...nft} />
                        <button className="btn btn-primary w-full mt-3">
                          <Lock size={16} />
                          Stake NFT
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <PiggyBank size={48} className="mx-auto text-slate-600 mb-4" />
                    <p className="text-slate-400">No unstaked NFTs available</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp size={20} className="text-emerald-500" />
              <h2 className="text-xl font-bold text-white">Staking Stats</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="text-sm text-slate-400 mb-1">Total Value Staked</p>
                <p className="text-2xl font-bold text-white">125.5 SUI</p>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="text-sm text-slate-400 mb-1">Daily Rewards Rate</p>
                <p className="text-2xl font-bold text-emerald-400">0.25 SUI</p>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="text-sm text-slate-400 mb-1">NFTs Staked</p>
                <p className="text-2xl font-bold text-white">2 / 3</p>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Info size={16} className="text-slate-400 mt-1 flex-shrink-0" />
                  <p className="text-sm text-slate-400">
                    Staking your NFTs earns you daily rewards in SUI tokens and unlocks access to premium leagues.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button className="btn btn-primary w-full">
                <span>View Staking Guide</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="bg-slate-800 rounded-xl border border-slate-700 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <PiggyBank size={24} className="text-indigo-400" />
          <h2 className="text-xl font-bold text-white">Staking Benefits</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center mb-3">
              <TrendingUp size={20} className="text-indigo-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Daily Rewards</h3>
            <p className="text-sm text-slate-400">
              Earn SUI tokens daily based on the rarity and number of NFTs staked
            </p>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mb-3">
              <Trophy size={20} className="text-emerald-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Premium Leagues</h3>
            <p className="text-sm text-slate-400">
              Access exclusive leagues with higher prize pools and better rewards
            </p>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center mb-3">
              <Star size={20} className="text-yellow-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Bonus Points</h3>
            <p className="text-sm text-slate-400">
              Get bonus points in weekly leagues for your staked NFTs
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Staking;