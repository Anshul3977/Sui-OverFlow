import React from 'react';
import { motion } from 'framer-motion';
import { Ticket as CricketBat, Trophy, Wallet, Users, TrendingUp, ArrowRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardStat from '../components/DashboardStat';
import PlayerCard from '../components/PlayerCard';
import LeagueCard from '../components/LeagueCard';
import { useWallet } from '../contexts/WalletContext';

const Home: React.FC = () => {
  const { balance } = useWallet();

  // Mock data for featured cards
  const featuredCards = [
    {
      id: '1',
      name: 'Virat Kohli',
      team: 'Royal Challengers',
      position: 'Batsman',
      image: 'https://images.pexels.com/photos/3628912/pexels-photo-3628912.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
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
      image: 'https://images.pexels.com/photos/15799366/pexels-photo-15799366/free-photo-of-cricket-bowler-about-to-release-the-ball.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      rarity: 'rare' as const,
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
      rarity: 'rare' as const,
      stats: {
        runs: 723,
        average: 45.2,
        catches: 18
      }
    },
  ];

  // Mock data for active leagues
  const activeLeagues = [
    {
      id: '1',
      name: 'IPL Fantasy Week 6',
      entryFee: 0.5,
      prizePool: 55,
      participants: {
        current: 87,
        max: 100
      },
      startDate: 'May 12, 2025',
      endDate: 'May 18, 2025',
      isActive: true,
    },
    {
      id: '2',
      name: 'Champions League T20',
      entryFee: 1.2,
      prizePool: 150,
      participants: {
        current: 62,
        max: 200
      },
      startDate: 'May 20, 2025',
      endDate: 'May 27, 2025',
      isActive: false,
    }
  ];

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
            value="8 Cards"
            icon={<CricketBat size={20} className="text-indigo-400" />}
            bgClass="bg-slate-800 bg-gradient-to-br from-slate-800 to-slate-700"
          />
          <DashboardStat 
            title="Active Teams"
            value="2"
            icon={<Users size={20} className="text-emerald-400" />}
            bgClass="bg-slate-800 bg-gradient-to-br from-slate-800 to-slate-700"
          />
          <DashboardStat 
            title="Leagues Joined"
            value="3"
            icon={<Trophy size={20} className="text-yellow-400" />}
            change={{ value: 50, isPositive: true }}
            bgClass="bg-slate-800 bg-gradient-to-br from-slate-800 to-slate-700"
          />
          <DashboardStat 
            title="Wallet Balance"
            value={`${balance} SUI`}
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
            {activeLeagues.map((league) => (
              <LeagueCard 
                key={league.id}
                {...league}
                isJoined={league.id === '1'}
                onJoin={() => console.log(`Join league ${league.id}`)}
              />
            ))}
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
                    <span className="text-sm">May 14, 2025</span>
                  </div>
                  <span className="text-xs bg-indigo-600 px-2 py-1 rounded">8:00 PM IST</span>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-white font-bold mb-3">Mumbai Indians vs Chennai Super Kings</h3>
              
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs mr-2">MI</div>
                  <span className="text-slate-200">Mumbai</span>
                </div>
                <span className="text-slate-400 text-sm">vs</span>
                <div className="flex items-center">
                  <span className="text-slate-200">Chennai</span>
                  <div className="w-8 h-8 rounded-full bg-yellow-600 flex items-center justify-center text-white font-bold text-xs ml-2">CSK</div>
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
          {featuredCards.map((card) => (
            <PlayerCard 
              key={card.id}
              {...card}
              onClick={() => console.log(`Selected player ${card.id}`)}
            />
          ))}
          
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