import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Ticket as CricketBat, Trophy, Wallet, Users, TrendingUp, ArrowRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardStat from '../components/DashboardStat';
import PlayerCard from '../components/PlayerCard';
import LeagueCard from '../components/LeagueCard';
import { useWallet } from '../contexts/WalletContext';

const Home: React.FC = () => {
  const { balance, connected, userAddress } = useWallet();
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
          console.log('Fetched user data for dashboard:', data);
          setUserData(data);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          setError('Failed to load dashboard data. Please try again.');
        });
    }
  }, [connected, userAddress]);

  // Calculate dashboard stats dynamically
  const ownedNFTs = userData?.ownedNFTs || [];
  const leagues = userData?.leagues || [];
  const activeTeams = leagues.filter((league: any) => league.joined && league.isActive).length;
  const leaguesJoined = leagues.filter((league: any) => league.joined).length;

  // Filter active or upcoming leagues
  const activeLeagues = leagues.filter((league: any) => {
    const now = new Date();
    const startDate = new Date(league.startDate);
    const endDate = new Date(league.endDate);
    return startDate <= now && now <= endDate; // Active leagues
  });

  // Select featured players (e.g., first 3 NFTs)
  const featuredPlayers = ownedNFTs.slice(0, 3);

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

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
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
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mb-8"
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back!</h1>
          <p className="text-slate-400 mb-6">Your fantasy cricket dashboard</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <DashboardStat 
            title="My Collection"
            value={`${ownedNFTs.length} Cards`}
            icon={<CricketBat size={20} className="text-indigo-400" />}
            bgClass="bg-slate-800 bg-gradient-to-br from-slate-800 to-slate-700"
          />
          <DashboardStat 
            title="Active Teams"
            value={activeTeams}
            icon={<Users size={20} className="text-emerald-400" />}
            bgClass="bg-slate-800 bg-gradient-to-br from-slate-800 to-slate-700"
          />
          <DashboardStat 
            title="Leagues Joined"
            value={leaguesJoined}
            icon={<Trophy size={20} className="text-yellow-400" />}
            change={{ value: 50, isPositive: true }} // This can be made dynamic later
            bgClass="bg-slate-800 bg-gradient-to-br from-slate-800 to-slate-700"
          />
          <DashboardStat 
            title="Wallet Balance"
            value={`${balance.toFixed(2)} SUI`}
            icon={<Wallet size={20} className="text-blue-400" />}
            bgClass="bg-slate-800 bg-gradient-to-br from-slate-800 to-slate-700"
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Active Leagues</h2>
            <Link to="/leagues" className="text-indigo-400 text-sm flex items-center hover:text-indigo-300">
              View All <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeLeagues.length > 0 ? (
              activeLeagues.map((league: any) => (
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
                  isJoined={league.joined}
                  onJoin={() => console.log(`Join league ${league.id}`)}
                />
              ))
            ) : (
              <p className="text-slate-400">No active leagues at the moment.</p>
            )}
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Upcoming Match</h2>
          </div>
          
          <motion.div 
            className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700"
            whileHover={{ y: -5 }}
          >
            <div className="relative h-40 overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/3841375/pexels-photo-3841375.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Cricket Stadium" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex justify-between items-center text-white">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2" />
                    <span className="text-sm">May 24, 2025</span>
                  </div>
                  <span className="text-xs bg-indigo-600 px-2 py-1 rounded">8:00 PM IST</span>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-white font-bold mb-3">Delhi Capitals vs Kolkata Knight Riders</h3>
              
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs mr-2">DC</div>
                  <span className="text-slate-200">Delhi</span>
                </div>
                <span className="text-slate-400 text-sm">vs</span>
                <div className="flex items-center">
                  <span className="text-slate-200">Kolkata</span>
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xs ml-2">KKR</div>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm text-slate-400">Points Multiplier</div>
                <div className="flex items-center">
                  <TrendingUp size={14} className="text-green-500 mr-1" />
                  <span className="text-green-500 font-medium">1.5x</span>
                </div>
              </div>
              
              <button className="btn btn-primary w-full mt-3">
                Build Team for This Match
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Featured Players</h2>
          <Link to="/marketplace" className="text-indigo-400 text-sm flex items-center hover:text-indigo-300">
            View Marketplace <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuredPlayers.length > 0 ? (
            featuredPlayers.map((card: any) => (
              <PlayerCard 
                key={card.objectId}
                id={card.objectId}
                name={card.name.replace(' NFT', '')}
                team={card.team || 'Unknown Team'}
                position={card.position || 'Unknown Position'}
                image={card.image || 'https://images.pexels.com/photos/3628912/pexels-photo-3628912.jpeg'}
                rarity={card.rarity || 'common'}
                stats={card.stats || { runs: 0, average: 0 }}
                onClick={() => console.log(`Selected player ${card.objectId}`)}
              />
            ))
          ) : (
            <p className="text-slate-400">You don’t own any player cards yet. Visit the marketplace to get started!</p>
          )}
          
          <motion.div 
            className="card bg-slate-800 border border-dashed border-slate-600 flex flex-col items-center justify-center aspect-[3/4] text-center p-6"
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="w-16 h-16 rounded-full bg-indigo-600/20 flex items-center justify-center mb-4">
              <CricketBat size={24} className="text-indigo-400" />
            </div>
            <h3 className="text-white font-medium mb-2">Discover More</h3>
            <p className="text-slate-400 text-sm mb-4">Find rare player cards in the marketplace</p>
            <Link to="/marketplace" className="btn btn-primary text-sm">
              Explore
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;