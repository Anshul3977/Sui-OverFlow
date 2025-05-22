import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Trophy, Layers, Users, Settings, Share2, ExternalLink, 
  Edit3, LogOut, Twitter, Award, Activity, Star, Check
} from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import PlayerCard from '../components/PlayerCard';
import Confetti from 'react-confetti';

const Profile: React.FC = () => {
  const { userAddress, balance, disconnectWallet, connected } = useWallet();
  const [activeTab, setActiveTab] = useState<'overview' | 'collection' | 'teams' | 'rewards' | 'settings'>('overview');
  const [showConfetti, setShowConfetti] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data
  useEffect(() => {
    if (connected && userAddress) {
      fetch(`http://localhost:3000/user/${userAddress}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          console.log('Fetched user data for profile:', data);
          setUserData(data);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          setError('Failed to load profile data. Please try again.');
        });
    }
  }, [connected, userAddress]);

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Calculate profile stats dynamically
  const ownedNFTs = userData?.ownedNFTs || [];
  const leagues = userData?.leagues || [];
  const leaguesJoined = leagues.filter((league: any) => league.joined).length;
  const totalWon = leagues
    .filter((league: any) => league.joined && !league.isActive)
    .reduce((sum: number, league: any) => sum + (league.prizePool / league.participants.current), 0); // Simplified calculation

  // Hardcoded team
  const hardcodedTeam = {
    id: 'custom-1',
    name: 'Custom IPL Team',
    points: 300, // Mock points for now
    players: [
      {
        objectId: 'rohit-sharma-1',
        name: 'Rohit Sharma',
        team: 'Mumbai Indians',
        position: 'Batsman',
        image: 'https://images.pexels.com/photos/3628912/pexels-photo-3628912.jpeg',
        rarity: 'legendary',
        stats: { runs: 600, average: 40 }
      },
      {
        objectId: 'ravindra-jadeja-1',
        name: 'Ravindra Jadeja',
        team: 'Chennai Super Kings',
        position: 'Bowler',
        image: 'https://images.pexels.com/photos/15799366/pexels-photo-15799366.jpeg',
        rarity: 'epic',
        stats: { wickets: 20, average: 25 }
      },
      {
        objectId: 'jasprit-bumrah-1',
        name: 'Jasprit Bumrah',
        team: 'Mumbai Indians',
        position: 'Bowler',
        image: 'https://images.pexels.com/photos/15799366/pexels-photo-15799366.jpeg',
        rarity: 'legendary',
        stats: { wickets: 25, average: 20 }
      },
      {
        objectId: 'shubman-gill-1',
        name: 'Shubman Gill',
        team: 'Gujarat Titans',
        position: 'Batsman',
        image: 'https://images.pexels.com/photos/3628912/pexels-photo-3628912.jpeg',
        rarity: 'rare',
        stats: { runs: 500, average: 38 }
      },
      {
        objectId: 'rishabh-pant-1',
        name: 'Rishabh Pant',
        team: 'Delhi Capitals',
        position: 'All-rounder',
        image: 'https://images.pexels.com/photos/15799367/pexels-photo-15799367.jpeg',
        rarity: 'epic',
        stats: { runs: 450, average: 35 }
      }
    ],
    isActive: true,
  };

  // Derive teams from joined leagues and prepend the hardcoded team
  const dynamicTeams = leagues
    .filter((league: any) => league.joined && league.team && league.team.length > 0)
    .map((league: any) => ({
      id: league.id,
      name: `${league.name} Team`,
      points: ownedNFTs
        .filter((nft: any) => league.team.includes(nft.objectId))
        .reduce((sum: number, nft: any) => sum + (nft.stats?.runs || 0), 0), // Mock points calculation
      players: ownedNFTs.filter((nft: any) => league.team.includes(nft.objectId)),
      isActive: league.isActive,
    }));

  const teams = [hardcodedTeam, ...dynamicTeams];

  // Mock rewards history
  const rewards = leagues
    .filter((league: any) => league.joined && !league.isActive)
    .map((league: any, index: number) => ({
      id: index + 1,
      league: league.name,
      date: league.endDate,
      amount: league.prizePool / league.participants.current, // Simplified reward calculation
      claimed: true, // Assume claimed for past leagues
    }));

  // Derive recent activity from leagues and NFTs
  const recentActivity = [
    ...leagues
      .filter((league: any) => league.joined)
      .map((league: any) => ({
        id: `league_${league.id}`,
        type: 'league_join',
        text: `Joined ${league.name}`,
        date: new Date(league.startDate).toLocaleDateString(),
        icon: Users,
      })),
    ...ownedNFTs.map((nft: any, index: number) => ({
      id: `nft_${index}`,
      type: 'nft_stake',
      text: `Staked ${nft.name}`,
      date: new Date().toLocaleDateString(), // Mock date
      icon: Layers,
    })),
  ].slice(0, 3); // Limit to 3 recent activities

  // Mock achievements
  const achievements = [
    { id: 1, title: 'First Win', icon: '🏆', description: 'Won your first league' },
    { id: 2, title: 'Collector', icon: '🎭', description: 'Collected 5 NFTs' },
    { id: 3, title: 'High Roller', icon: '💎', description: 'Won over 100 SUI' },
  ];

  // Function to handle sharing on X
  const handleShareOnX = () => {
    const tweetText = `🏏 Check out my SuiSports Legends stats! I've won ${totalWon.toFixed(2)} SUI, joined ${leaguesJoined} leagues, and own ${ownedNFTs.length} NFTs. Join me on the field! ⚡ https://suisportslegends.xyz/profile/${userAddress} #SuiSportsLegends`;
    
    // Encode the tweet text for URL
    const encodedTweet = encodeURIComponent(tweetText);
    
    // X intent URL for posting a tweet
    const tweetUrl = `https://x.com/intent/tweet?text=${encodedTweet}`;
    
    // Open the URL in a new tab
    window.open(tweetUrl, '_blank');
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 p-4 bg-red-600 text-white rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="max-w-7xl mx-auto text-white text-center">
        Loading profile...
      </div>
    );
  }

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
                    <p className="text-xl font-bold text-white mt-1">{totalWon.toFixed(2)} SUI</p>
                  </div>

                  <div className="profile-stat-card">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-blue-400" />
                      <p className="text-sm text-slate-300">Leagues Joined</p>
                    </div>
                    <p className="text-xl font-bold text-white mt-1">{leaguesJoined}</p>
                  </div>

                  <div className="profile-stat-card">
                    <div className="flex items-center gap-2">
                      <Layers size={16} className="text-purple-400" />
                      <p className="text-sm text-slate-300">NFTs Owned</p>
                    </div>
                    <p className="text-xl font-bold text-white mt-1">{ownedNFTs.length}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="btn btn-primary">
                  <Edit3 size={16} />
                  Edit Profile
                </button>
                <button 
                  className="btn bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white"
                  onClick={handleShareOnX}
                >
                  <Twitter size={16} />
                  Share on X
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
                    {recentActivity.length > 0 ? (
                      recentActivity.map((activity: any) => (
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
                      ))
                    ) : (
                      <p className="text-slate-400">No recent activity.</p>
                    )}
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
                  {ownedNFTs.length > 0 ? (
                    ownedNFTs.map((nft: any) => (
                      <PlayerCard 
                        key={nft.objectId}
                        id={nft.objectId}
                        name={nft.name.replace(' NFT', '')}
                        team={nft.team || 'Unknown Team'}
                        position={nft.position || 'Unknown Position'}
                        image={nft.image || 'https://images.pexels.com/photos/3628912/pexels-photo-3628912.jpeg'}
                        rarity={nft.rarity || 'common'}
                        stats={nft.stats || { runs: 0, average: 0 }}
                        onClick={() => console.log(`View NFT ${nft.objectId}`)}
                      />
                    ))
                  ) : (
                    <p className="text-slate-400">You don’t own any NFTs yet.</p>
                  )}
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
                  {teams.length > 0 ? (
                    teams.map((team: any) => (
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
                          {team.players.map((player: any) => (
                            <img 
                              key={player.objectId}
                              src={player.image || 'https://images.pexels.com/photos/3628912/pexels-photo-3628912.jpeg'}
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
                    ))
                  ) : (
                    <p className="text-slate-400">You haven’t joined any leagues with teams yet.</p>
                  )}
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
                      {rewards.length > 0 ? (
                        rewards.map((reward: any) => (
                          <tr 
                            key={reward.id}
                            className="border-t border-slate-700"
                          >
                            <td className="p-3 text-white">{reward.league}</td>
                            <td className="p-3 text-slate-400">{reward.date}</td>
                            <td className="p-3 text-white">{reward.amount.toFixed(2)} SUI</td>
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
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="p-3 text-slate-400 text-center">
                            No rewards history available.
                          </td>
                        </tr>
                      )}
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
              <button 
                className="btn bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white w-full"
                onClick={handleShareOnX}
              >
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