import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Filter, Users, Calendar } from 'lucide-react';
import LeagueCard from '../components/LeagueCard';
import { useWallet } from '../contexts/WalletContext';
import { useWalletKit } from '@mysten/wallet-kit';

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
}

const Leagues: React.FC = () => {
  const { connected, userAddress, balance, refreshBalance } = useWallet();
  const walletKit = useWalletKit();
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'upcoming'>('all');
  const [sortBy, setSortBy] = useState<'prize' | 'date' | 'participants'>('prize');
  const [hasTeam] = useState<boolean>(true); // Mock: Assume team is submitted
  const [leagues, setLeagues] = useState<League[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (connected && userAddress) {
      fetch(`http://localhost:3000/user/${userAddress}`)
        .then((res) => res.json())
        .then((data) => {
          const userLeagues = data.leagues || [];
          const mockLeagues: League[] = [
            {
              id: '1',
              name: 'IPL Fantasy Week 6',
              entryFee: 0.5,
              prizePool: 55,
              participants: { current: 87, max: 100 },
              startDate: 'May 12, 2025',
              endDate: 'May 18, 2025',
              isActive: false,
              joined: userLeagues.includes('1'),
            },
            {
              id: '2',
              name: 'Champions League T20',
              entryFee: 1.2,
              prizePool: 150,
              participants: { current: 62, max: 200 },
              startDate: 'May 20, 2025',
              endDate: 'May 27, 2025',
              isActive: false,
              joined: userLeagues.includes('2'),
            },
            {
              id: '3',
              name: 'World Cup Fantasy',
              entryFee: 2.0,
              prizePool: 300,
              participants: { current: 156, max: 500 },
              startDate: 'June 1, 2025',
              endDate: 'June 15, 2025',
              isActive: false,
              joined: userLeagues.includes('3'),
            },
            {
              id: '4',
              name: 'T20 Blast Weekly',
              entryFee: 0.8,
              prizePool: 80,
              participants: { current: 45, max: 100 },
              startDate: 'May 15, 2025',
              endDate: 'May 21, 2025',
              isActive: true,
              joined: userLeagues.includes('4'),
            },
          ];
          setLeagues(mockLeagues);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
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

    if (balance < league.entryFee) {
      setError(
        `Insufficient balance! You need ${league.entryFee} SUI to join, but you only have ${balance.toFixed(
          2
        )} SUI. Add more test SUI using the testnet faucet.`
      );
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
        throw new Error(data.error || 'Failed to create league join transaction');
      }

      const { transaction } = data;
      const result = await walletKit.signAndExecuteTransactionBlock({
        transactionBlock: transaction,
      });

      if (result) {
        setLeagues(
          leagues.map((l) => (l.id === league.id ? { ...l, joined: true } : l))
        );
        setSuccess(
          league.isActive
            ? `You have joined ${league.name}! Your team is now competing in this league.`
            : `You have joined ${league.name}! The league will start on ${league.startDate}.`
        );
        refreshBalance();
      }
    } catch (error) {
      console.error('Error joining league:', error);
      setError('Failed to join league. Please try again.');
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
          Join competitive leagues and win SUI tokens
        </motion.p>
        {connected && (
          <motion.p
            className="text-slate-300"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Your Balance: {balance.toFixed(2)} SUI
          </motion.p>
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
          <LeagueCard
            key={league.id}
            id={league.id}
            name={league.name}
            entryFee={league.entryFee}
            prizePool={league.prizePool}
            participants={league.participants}
            startDate={league.startDate}
            endDate={league.endDate}
            isActive={league.isActive}
            onJoin={() => handleJoinLeague(league)}
          />
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
            <p className="text-2xl font-bold text-white">350</p>
            <p className="text-sm text-slate-400">across all leagues</p>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Trophy size={18} className="text-yellow-500" />
              <p className="text-sm text-slate-300">Prize Pool</p>
            </div>
            <p className="text-2xl font-bold text-white">585 SUI</p>
            <p className="text-sm text-slate-400">total rewards</p>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={18} className="text-emerald-400" />
              <p className="text-sm text-slate-300">Active Leagues</p>
            </div>
            <p className="text-2xl font-bold text-white">2</p>
            <p className="text-sm text-slate-400">running now</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Leagues;