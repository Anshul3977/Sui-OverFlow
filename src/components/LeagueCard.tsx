import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, Calendar, ArrowRight } from 'lucide-react';

export interface LeagueCardProps {
  id: string;
  name: string;
  entryFee: number;
  prizePool: number;
  participants: {
    current: number;
    max: number;
  };
  startDate: string;
  endDate: string;
  isActive: boolean;
  isJoined?: boolean;
  onJoin?: () => void;
}

const LeagueCard: React.FC<LeagueCardProps> = ({
  name,
  entryFee,
  prizePool,
  participants,
  startDate,
  endDate,
  isActive,
  isJoined,
  onJoin,
}) => {
  const [timeLeft, setTimeLeft] = React.useState<string>('');

  React.useEffect(() => {
    if (!isActive) return;

    const calculateTimeLeft = () => {
      const end = new Date(endDate).getTime();
      const now = new Date().getTime();
      const difference = end - now;

      if (difference <= 0) {
        setTimeLeft('Ended');
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      setTimeLeft(`${days}d ${hours}h`);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000 * 60); // Update every minute

    return () => clearInterval(timer);
  }, [endDate, isActive]);

  return (
    <motion.div
      className="card bg-slate-800 border border-slate-700/70"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-white">{name}</h3>
          <div className={`px-2 py-1 text-xs rounded flex items-center gap-1 ${
            isActive 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-slate-600/30 text-slate-400'
          }`}>
            {isActive ? (
              <>
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                <span>Ends in {timeLeft}</span>
              </>
            ) : 'Upcoming'}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-700/50 p-3 rounded-lg">
            <div className="flex items-center mb-1">
              <Trophy size={14} className="text-yellow-400 mr-1" />
              <p className="text-xs text-slate-400">Prize Pool</p>
            </div>
            <p className="text-lg font-bold text-white">{prizePool} SUI</p>
          </div>
          
          <div className="bg-slate-700/50 p-3 rounded-lg">
            <div className="flex items-center mb-1">
              <Users size={14} className="text-blue-400 mr-1" />
              <p className="text-xs text-slate-400">Participants</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold text-white">{participants.current}/{participants.max}</p>
              <div className="w-full bg-slate-600 rounded-full h-1">
                <div 
                  className="bg-blue-500 h-1 rounded-full"
                  style={{ width: `${(participants.current / participants.max) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center mb-4">
          <Calendar size={14} className="text-slate-400 mr-2" />
          <p className="text-sm text-slate-400">
            {startDate} - {endDate}
          </p>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-slate-700">
          <div>
            <p className="text-xs text-slate-400">Entry Fee</p>
            <p className="text-lg font-bold text-white">{entryFee} SUI</p>
          </div>
          
          <button
            className={`btn ${isJoined ? 'btn-secondary' : 'btn-primary'} px-4`}
            onClick={onJoin}
            disabled={isJoined}
          >
            {isJoined ? 'Joined' : 'Join League'}
            {!isJoined && <ArrowRight size={16} />}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default LeagueCard;