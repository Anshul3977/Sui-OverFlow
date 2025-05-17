import React, { createContext, useState, useContext, useEffect } from 'react';

interface WalletContextType {
  connected: boolean;
  connectWallet: () => void;
  disconnectWallet: () => void;
  balance: number;
  userAddress: string;
  showConnectModal: boolean;
  setShowConnectModal: (show: boolean) => void;
}

const WalletContext = createContext<WalletContextType>({
  connected: false,
  connectWallet: () => {},
  disconnectWallet: () => {},
  balance: 0,
  userAddress: '',
  showConnectModal: false,
  setShowConnectModal: () => {},
});

export const useWallet = () => useContext(WalletContext);

interface WalletProviderProps {
  children: React.ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [balance, setBalance] = useState(0);
  const [userAddress, setUserAddress] = useState('');
  const [showConnectModal, setShowConnectModal] = useState(false);

  // Check for stored connection on mount
  useEffect(() => {
    const storedConnection = localStorage.getItem('walletConnected');
    if (storedConnection === 'true') {
      // In a real app, we would validate the connection here
      setConnected(true);
      setUserAddress('0x7f34374a3468c1d6bc6e9ab9fb6319bb');
      setBalance(100.5);
    }
  }, []);

  const connectWallet = () => {
    // In a real app, this would integrate with the Sui wallet
    setConnected(true);
    setUserAddress('0x7f34374a3468c1d6bc6e9ab9fb6319bb');
    setBalance(100.5);
    localStorage.setItem('walletConnected', 'true');
  };

  const disconnectWallet = () => {
    setConnected(false);
    setUserAddress('');
    setBalance(0);
    localStorage.removeItem('walletConnected');
  };

  const value = {
    connected,
    connectWallet,
    disconnectWallet,
    balance,
    userAddress,
    showConnectModal,
    setShowConnectModal,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};