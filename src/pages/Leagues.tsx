import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Filter, Users, Calendar, Shirt, Wallet } from 'lucide-react';
import LeagueCard from '../components/LeagueCard';
import { useWallet } from '../contexts/WalletContext';

interface League {
  id: string;
  name: string;
  entryFee: number;
  prizePool: number;
  participants: { current: number; max: number };
  startDate: string;
  endDate: string;
  isActive: boolean;
  joined: boolean;
  team: string[];
}

interface NFT {
  objectId: string;
  name: string;
  stats: number;
}

const Leagues: React.FC = () => {
  const { connected, userAddress, balance, refreshBalance, connectWallet } = useWallet();
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'upcoming'>('all');
  const [sortBy, setSortBy] = useState<'prize' | 'date' | 'participants'>('prize');
  const [hasTeam] = useState<boolean>(true); // Mock: Assume team is submitted
  const [leagues, setLeagues] = useState<League[]>([]);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
          console.log('Fetched user data:', data);
          const fetchedLeagues = data.leagues || [];
          setLeagues(fetchedLeagues);
          setNfts(data.ownedNFTs || []);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          setError('Failed to load leagues. Please try again.');
        });
    }
  }, [connected, userAddress]);

  const handleJoinLeague = async (league: League) => {
    setError(null);
    setSuccess(null);

    if (!connected || !userAddress) {
      setError('Please connect your wallet to join a league.');
      return;
    }

    if (!hasTeam) {
      setError('Please build and submit a team in Team Builder before joining a league.');
      return;
    }

    if (league.participants.current >= league.participants.max) {
      setError('This league is full. Please choose another league.');
      return;
    }

    if (league.joined) {
      setError('You have already joined this league.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/join-league', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: userAddress,
          leagueId: league.id,
          entryFee: league.entryFee,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to join league');
      }

      if (data.success) {
        console.log('Joined league, team data:', data.team);
        setLeagues(
          leagues.map((l) =>
            l.id === league.id
              ? { ...l, joined: true, team: data.team || [] }
              : l
          )
        );
        setSuccess(
          league.isActive
            ? `You have joined ${league.name}! Your team is now competing in this league.`
            : `You have joined ${league.name}! The league will start on ${league.startDate}.`
        );
        await refreshBalance(); // Refresh balance from backend
      }
    } catch (error) {
      console.error('Error joining league:', error);
      setError(error.message || 'Failed to join league. Please try again.');
    }
  };

  const filteredLeagues = leagues
    .filter((league) => {
      if (filterStatus === 'all') return true;
      return filterStatus === 'active' ? league.isActive : !league.isActive;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'prize':
          return b.prizePool - a.prizePool;
        case 'date':
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        case 'participants':
          return (b.participants.current / b.participants.max) - (a.participants.current / a.participants.max);
        default:
          return 0;
      }
    });

  const totalPlayers = leagues.reduce((sum, league) => sum + league.participants.current, 0);
  const totalPrizePool = leagues.reduce((sum, league) => sum + league.prizePool, 0);
  const activeLeagues = leagues.filter(league => league.isActive).length;

  const calculateLeagueScore = (league: League) => {
    if (!league.joined || !league.team) return 0;
    const teamNFTs = nfts.filter(nft => league.team.includes(nft.objectId));
    return teamNFTs.reduce((sum, nft) => sum + (nft.stats || 0), 0);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <motion.h1
          className="text-3xl font-bold text-white mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Weekly Leagues
        </motion.h1>
        <motion.p
          className="text-slate-400"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Join competitive leagues and win SUI tokens with your staked team
        </motion.p>
        {connected ? (
          <motion.p
            className="text-slate-300"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Your Balance: {balance.toFixed(2)} SUI
          </motion.p>
        ) : (
          <motion.button
            className="btn btn-primary mt-2"
            onClick={connectWallet}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Wallet size={16} className="mr-2" />
            Connect Wallet
          </motion.button>
        )}
        {connected && nfts.length > 0 && leagues.some(league => !league.joined) && (
          <motion.div
            className="mb-4 p-4 bg-indigo-600 text-white rounded-lg flex items-center gap-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span>💡</span>
            <p>
              Stake your NFTs in the <a href="/staking" className="underline">Staking</a> section to join a league and compete with your team!
            </p>
          </motion.div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-600 text-white rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-600 text-white rounded-lg">
          {success}
        </div>
      )}

      <motion.div
        className="bg-slate-800 p-4 rounded-xl border border-slate-700 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              className={`px-3 py-1 rounded-full text-sm ${
                filterStatus === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
              onClick={() => setFilterStatus('all')}
            >
              All Leagues
            </button>
            <button
              className={`px-3 py-1 rounded-full text-sm ${
                filterStatus === 'active'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
              onClick={() => setFilterStatus('active')}
            >
              Active
            </button>
            <button
              className={`px-3 py-1 rounded-full text-sm ${
                filterStatus === 'upcoming'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
              onClick={() => setFilterStatus('upcoming')}
            >
              Upcoming
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">Sort by:</span>
            <select
              className="bg-slate-700 text-white px-3 py-1 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'prize' | 'date' | 'participants')}
            >
              <option value="prize">Prize Pool</option>
              <option value="date">Start Date</option>
              <option value="participants">Participants</option>
            </select>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {filteredLeagues.map((league) => (
          <div key={league.id} className="bg-slate-800 rounded-xl border border-slate-700 p-4">
            <LeagueCard
              id={league.id}
              name={league.name}
              entryFee={league.entryFee}
              prizePool={league.prizePool}
              participants={league.participants}
              startDate={league.startDate}
              endDate={league.endDate}
              isActive={league.isActive}
              onJoin={() => handleJoinLeague(league)}
              joined={league.joined}
            />
            {league.joined && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shirt size={18} className="text-indigo-400" />
                  <p className="text-sm text-slate-300">Your Team</p>
                </div>
                {league.team.length > 0 ? (
                  <div className="space-y-2">
                    {league.team.map((nftId) => {
                      const nft = nfts.find(n => n.objectId === nftId);
                      return nft ? (
                        <div key={nftId} className="bg-slate-700/50 rounded-lg p-2 text-sm">
                          <span className="text-white">{nft.name.replace(' NFT', '')}</span>
                          <span className="text-slate-400"> (Stats: {nft.stats})</span>
                        </div>
                      ) : null;
                    })}
                    <div className="mt-2">
                      <p className="text-sm text-slate-400">Total Score (Mock):</p>
                      <p className="text-lg font-bold text-white">{calculateLeagueScore(league)}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">No team assigned</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <motion.div
        className="bg-slate-800 rounded-xl p-6 border border-slate-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Trophy size={24} className="text-yellow-500" />
          <h2 className="text-xl font-bold text-white">League Statistics</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users size={18} className="text-indigo-400" />
              <p className="text-sm text-slate-300">Total Players</p>
            </div>
            <p className="text-2xl font-bold text-white">{totalPlayers}</p>
            <p className="text-sm text-slate-400">across all leagues</p>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Trophy size={18} className="text-yellow-500" />
              <p className="text-sm text-slate-300">Prize Pool</p>
            </div>
            <p className="text-2xl font-bold text-white">{totalPrizePool} SUI</p>
            <p className="text-sm text-slate-400">total rewards</p>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={18} className="text-emerald-400" />
              <p className="text-sm text-slate-300">Active Leagues</p>
            </div>
            <p className="text-2xl font-bold text-white">{activeLeagues}</p>
            <p className="text-sm text-slate-400">running now</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Leagues;