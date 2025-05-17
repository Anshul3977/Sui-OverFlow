import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Trophy, Layers, Users, Settings, Share2, ExternalLink, 
  Edit3, LogOut, Twitter, Award, Activity, Star, Check
} from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import PlayerCard from '../components/PlayerCard';
import Confetti from 'react-confetti';

const Profile: React.FC = () => {
  const { userAddress, balance, disconnectWallet } = useWallet();
  const [activeTab, setActiveTab] = useState<'overview' | 'collection' | 'teams' | 'rewards' | 'settings'>('overview');
  const [showConfetti, setShowConfetti] = useState(false);

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Mock data
  const recentActivity = [
    { id: 1, type: 'league_join', text: 'Joined IPL Fantasy Week 6', date: '2h ago', icon: Users },
    { id: 2, type: 'nft_stake', text: 'Staked Virat Kohli NFT', date: '1d ago', icon: Layers },
    { id: 3, type: 'reward_claim', text: 'Claimed 5 SUI in rewards', date: '2d ago', icon: Trophy },
  ];

  const achievements = [
    { id: 1, title: 'First Win', icon: '🏆', description: 'Won your first league' },
    { id: 2, title: 'Collector', icon: '🎭', description: 'Collected 5 NFTs' },
    { id: 3, title: 'High Roller', icon: '💎', description: 'Won over 100 SUI' },
  ];

  const stats = {
    totalWon: 250,
    leaguesJoined: 15,
    nftsOwned: 8,
  };

  const mockNFTs = [
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
      }
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
      }
    }
  ];

  const mockTeams = [
    {
      id: 1,
      name: 'Dream Team Alpha',
      points: 450,
      players: mockNFTs,
      isActive: true
    },
    {
      id: 2,
      name: 'Weekend Warriors',
      points: 380,
      players: mockNFTs.slice(0, 1),
      isActive: false
    }
  ];

  const mockRewards = [
    { id: 1, league: 'IPL Fantasy Week 5', date: 'May 10, 2025', amount: 25, claimed: true },
    { id: 2, league: 'T20 Blast Weekly', date: 'May 15, 2025', amount: 15, claimed: false },
  ];

  return (
    <>
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} onConfettiComplete={() => setShowConfetti(false)} />}
      
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <motion.div 
          className="profile-header rounded-xl mb-6 p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative group">
                <div className="profile-avatar flex items-center justify-center">
                  <User size={64} className="text-white" />
                </div>
                <button 
                  className="absolute bottom-0 right-0 p-2 rounded-full bg-slate-700 
                           hover:bg-slate-600 transition-colors"
                  aria-label="Edit profile picture"
                >
                  <Edit3 size={14} className="text-white" />
                </button>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-white">
                    {truncateAddress(userAddress)}
                  </h1>
                  <button 
                    className="text-slate-400 hover:text-white transition-colors"
                    aria-label="View on explorer"
                  >
                    <ExternalLink size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  <div className="profile-stat-card">
                    <div className="flex items-center gap-2">
                      <Trophy size={16} className="text-yellow-400" />
                      <p className="text-sm text-slate-300">Total Won</p>
                    </div>
                    <p className="text-xl font-bold text-white mt-1">{stats.totalWon} SUI</p>
                  </div>

                  <div className="profile-stat-card">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-blue-400" />
                      <p className="text-sm text-slate-300">Leagues Joined</p>
                    </div>
                    <p className="text-xl font-bold text-white mt-1">{stats.leaguesJoined}</p>
                  </div>

                  <div className="profile-stat-card">
                    <div className="flex items-center gap-2">
                      <Layers size={16} className="text-purple-400" />
                      <p className="text-sm text-slate-300">NFTs Owned</p>
                    </div>
                    <p className="text-xl font-bold text-white mt-1">{stats.nftsOwned}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="btn btn-primary">
                  <Edit3 size={16} />
                  Edit Profile
                </button>
                <button className="btn bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white">
                  <Twitter size={16} />
                  Share
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 mb-6 overflow-x-auto">
          <div className="flex">
            {[
              { id: 'overview', label: 'Overview', icon: User },
              { id: 'collection', label: 'NFT Collection', icon: Layers },
              { id: 'teams', label: 'Teams', icon: Users },
              { id: 'rewards', label: 'Rewards', icon: Trophy },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                className={`profile-tab ${activeTab === id ? 'profile-tab-active' : 'text-slate-400'}`}
                onClick={() => setActiveTab(id as typeof activeTab)}
              >
                <div className="flex items-center gap-2">
                  <Icon size={16} />
                  {label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Recent Activity */}
                <motion.div 
                  className="bg-slate-800 rounded-xl border border-slate-700 p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div 
                        key={activity.id} 
                        className="flex items-center gap-4 bg-slate-700/50 rounded-lg p-4
                                 hover:bg-slate-700 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                          <activity.icon size={20} className="text-indigo-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white">{activity.text}</p>
                          <p className="text-sm text-slate-400">{activity.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Achievements */}
                <motion.div 
                  className="bg-slate-800 rounded-xl border border-slate-700 p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="text-xl font-bold text-white mb-4">Achievements</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className="group relative bg-slate-700/50 rounded-lg p-4 
                                 hover:bg-slate-700 transition-colors"
                      >
                        <div className="achievement-badge">
                          {achievement.icon}
                          <div className="achievement-tooltip">
                            {achievement.description}
                          </div>
                        </div>
                        <h3 className="font-bold text-white mt-3">{achievement.title}</h3>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}

            {activeTab === 'collection' && (
              <motion.div 
                className="bg-slate-800 rounded-xl border border-slate-700 p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h2 className="text-xl font-bold text-white mb-4">My NFTs</h2>
                <div className="profile-grid">
                  {mockNFTs.map((nft) => (
                    <PlayerCard 
                      key={nft.id}
                      {...nft}
                      onClick={() => console.log(`View NFT ${nft.id}`)}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'teams' && (
              <motion.div 
                className="bg-slate-800 rounded-xl border border-slate-700 p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h2 className="text-xl font-bold text-white mb-4">My Teams</h2>
                <div className="space-y-4">
                  {mockTeams.map((team) => (
                    <div 
                      key={team.id}
                      className="bg-slate-700/50 rounded-lg p-4 hover:bg-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-white">{team.name}</h3>
                        <div className="flex items-center gap-2">
                          <Star size={16} className="text-yellow-400" />
                          <span className="text-white">{team.points} pts</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mb-3">
                        {team.players.map((player) => (
                          <img 
                            key={player.id}
                            src={player.image}
                            alt={player.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ))}
                      </div>
                      <button className="btn btn-primary w-full">
                        <Activity size={16} />
                        Edit Team
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'rewards' && (
              <motion.div 
                className="bg-slate-800 rounded-xl border border-slate-700 p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h2 className="text-xl font-bold text-white mb-4">Rewards History</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-slate-400">
                        <th className="p-3">League</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockRewards.map((reward) => (
                        <tr 
                          key={reward.id}
                          className="border-t border-slate-700"
                        >
                          <td className="p-3 text-white">{reward.league}</td>
                          <td className="p-3 text-slate-400">{reward.date}</td>
                          <td className="p-3 text-white">{reward.amount} SUI</td>
                          <td className="p-3">
                            {reward.claimed ? (
                              <span className="text-green-400 flex items-center gap-1">
                                <Check size={16} />
                                Claimed
                              </span>
                            ) : (
                              <button 
                                className="btn btn-primary py-1"
                                onClick={() => {
                                  setShowConfetti(true);
                                  // Handle claim logic
                                }}
                              >
                                Claim
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div 
                className="bg-slate-800 rounded-xl border border-slate-700 p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h2 className="text-xl font-bold text-white mb-6">Profile Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      className="input"
                      placeholder="Enter username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      className="input"
                      placeholder="Enter email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                      Wallet Address
                    </label>
                    <div className="flex items-center gap-2 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2">
                      <span className="text-white">{truncateAddress(userAddress)}</span>
                      <button className="text-slate-400 hover:text-white">
                        <ExternalLink size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-700">
                    <button 
                      className="btn bg-red-600 hover:bg-red-700 text-white w-full"
                      onClick={disconnectWallet}
                    >
                      <LogOut size={16} />
                      Disconnect Wallet
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div>
            <motion.div 
              className="bg-slate-800 rounded-xl border border-slate-700 p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-xl font-bold text-white mb-4">Share Profile</h2>
              <p className="text-slate-400 text-sm mb-4">
                Share your achievements and stats with your friends
              </p>
              <button className="btn bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white w-full">
                <Twitter size={16} />
                Share on X
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;