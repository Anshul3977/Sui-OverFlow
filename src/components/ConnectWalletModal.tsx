import React from 'react';
import { motion } from 'framer-motion';
import { X, Wallet, AlertCircle } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';

interface ConnectWalletModalProps {
  onClose: () => void;
}

const ConnectWalletModal: React.FC<ConnectWalletModalProps> = ({ onClose }) => {
  const { connectWallet } = useWallet();

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConnect = () => {
    connectWallet();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <motion.div
        className="bg-slate-800 rounded-xl max-w-md w-full shadow-xl border border-slate-700"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", duration: 0.4 }}
      >
        <div className="flex justify-between items-center p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold">Connect Your Wallet</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <p className="text-slate-300 mb-4">
              Connect your Sui wallet to access SuiSports Legends platform, manage your NFT collection, and participate in weekly leagues.
            </p>
            
            <div className="flex items-start p-3 bg-indigo-900/30 rounded-lg border border-indigo-800 mb-4">
              <AlertCircle size={20} className="text-indigo-400 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-sm text-indigo-300">
                This is a demo application. In a production environment, you would connect to an actual Sui wallet.
              </p>
            </div>
          </div>
          
          <button
            onClick={handleConnect}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Wallet size={20} />
            <span>Connect Sui Wallet</span>
          </button>
          
          <div className="mt-4 text-center">
            <button
              onClick={onClose}
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ConnectWalletModal;