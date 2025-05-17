import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Ticket as CricketBat, Bell, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWallet } from '../contexts/WalletContext';
import Logo from './Logo';

interface NavbarProps {
  toggleMobileMenu: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleMobileMenu }) => {
  const { connected, connectWallet, balance, userAddress } = useWallet();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const truncateAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-slate-900/95 backdrop-blur shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center">
            <button
              className="mr-2 p-2 md:hidden rounded-lg hover:bg-slate-800"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>
            
            <Link to="/" className="flex items-center">
              <Logo />
              <span className="ml-2 text-xl font-bold hidden sm:block">SuiSports Legends</span>
            </Link>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            {connected && (
              <>
                <motion.div
                  className="hidden md:flex items-center px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <span className="text-sm font-medium text-slate-300 mr-1">Balance:</span>
                  <span className="text-sm font-semibold text-white">
                    {balance} <span className="text-indigo-400">SUI</span>
                  </span>
                </motion.div>

                <div className="relative">
                  <button
                    className="p-2 rounded-lg hover:bg-slate-800"
                    onClick={() => setShowNotifications(!showNotifications)}
                    aria-label="Notifications"
                  >
                    <Bell size={20} />
                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                  </button>
                  
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-72 bg-slate-800 rounded-lg shadow-lg py-2 border border-slate-700">
                      <div className="px-4 py-2 border-b border-slate-700">
                        <h3 className="font-semibold">Notifications</h3>
                      </div>
                      <div className="px-4 py-2 text-sm text-slate-300">
                        <p>No new notifications</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    className="p-2 rounded-lg hover:bg-slate-800 flex items-center gap-2"
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    aria-label="Profile"
                  >
                    <User size={20} />
                    <span className="hidden md:block text-sm font-medium">
                      {truncateAddress(userAddress)}
                    </span>
                  </button>
                  
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-lg py-2 border border-slate-700">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm hover:bg-slate-700"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/collection"
                        className="block px-4 py-2 text-sm hover:bg-slate-700"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        My Collection
                      </Link>
                      <div className="border-t border-slate-700 my-1"></div>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700"
                        onClick={() => {
                          setShowProfileMenu(false);
                          // Disconnect wallet logic here
                        }}
                      >
                        Disconnect Wallet
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
            
            {!connected && (
              <button
                className="btn btn-primary"
                onClick={connectWallet}
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;