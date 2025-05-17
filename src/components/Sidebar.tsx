import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Layers, 
  Users, 
  Trophy, 
  ShoppingCart, 
  PiggyBank, 
  BarChart, 
  User,
  X 
} from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';

interface SidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const location = useLocation();
  const { connected } = useWallet();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <Home size={20} /> },
    { path: '/collection', label: 'My Collection', icon: <Layers size={20} /> },
    { path: '/team-builder', label: 'Team Builder', icon: <Users size={20} /> },
    { path: '/leagues', label: 'Weekly Leagues', icon: <Trophy size={20} /> },
    { path: '/marketplace', label: 'Marketplace', icon: <ShoppingCart size={20} /> },
    { path: '/staking', label: 'Staking', icon: <PiggyBank size={20} /> },
    { path: '/leaderboard', label: 'Leaderboard', icon: <BarChart size={20} /> },
    { path: '/profile', label: 'My Profile', icon: <User size={20} /> },
  ];

  const sidebarVariants = {
    open: { 
      x: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      } 
    },
    closed: { 
      x: "-100%",
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      } 
    }
  };

  const isActive = (path: string) => location.pathname === path;

  if (!connected) return null;

  return (
    <>
      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            <motion.div
              className="fixed left-0 top-0 bottom-0 w-64 bg-slate-800 z-50 md:hidden"
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="flex justify-between items-center p-4 border-b border-slate-700">
                <h2 className="text-lg font-semibold">SuiSports Legends</h2>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-700"
                >
                  <X size={20} />
                </button>
              </div>
              
              <nav className="p-4">
                <ul className="space-y-2">
                  {navItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          isActive(item.path)
                            ? 'bg-indigo-600 text-white'
                            : 'hover:bg-slate-700 text-slate-300 hover:text-white'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 bg-slate-800 overflow-y-auto shrink-0">
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-indigo-600 text-white'
                      : 'hover:bg-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  
                  {isActive(item.path) && (
                    <motion.div
                      className="absolute left-0 w-1 h-8 bg-indigo-400 rounded-r-full"
                      layoutId="sidebar-indicator"
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;