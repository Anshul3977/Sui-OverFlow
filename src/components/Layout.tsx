import React from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useWallet } from '../contexts/WalletContext';
import ConnectWalletModal from './ConnectWalletModal';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { connected, showConnectModal, setShowConnectModal } = useWallet();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      <Navbar toggleMobileMenu={toggleMobileMenu} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
        
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          {connected ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          ) : (
            <div className="stadium-bg flex flex-col items-center justify-center min-h-[calc(100vh-80px)] relative">
              <div className="z-10 max-w-2xl text-center px-4">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
                    SuiSports Legends
                  </h1>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <p className="text-xl md:text-2xl mb-8 text-slate-200">
                    Build your dream cricket team with NFT player cards and earn SUI tokens based on real-world performance
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <button
                    onClick={() => setShowConnectModal(true)}
                    className="btn btn-primary text-lg px-8 py-3"
                  >
                    Connect Wallet to Start
                  </button>
                </motion.div>
              </div>
            </div>
          )}
        </main>
      </div>

      {showConnectModal && <ConnectWalletModal onClose={() => setShowConnectModal(false)} />}
    </div>
  );
};

export default Layout;