import React, { createContext, useContext, useState, useEffect } from 'react';
import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { WalletKitProvider, ConnectModal, useWalletKit } from '@mysten/wallet-kit';

interface WalletContextType {
  connected: boolean;
  connectWallet: () => void;
  disconnectWallet: () => void;
  balance: number;
  userAddress: string;
  showConnectModal: boolean;
  setShowConnectModal: (show: boolean) => void;
  refreshBalance: () => void; // Add refreshBalance method
}

const WalletContext = createContext<WalletContextType>({
  connected: false,
  connectWallet: () => {},
  disconnectWallet: () => {},
  balance: 0,
  userAddress: '',
  showConnectModal: false,
  setShowConnectModal: () => {},
  refreshBalance: () => {},
});

export const useWallet = () => useContext(WalletContext);

interface WalletProviderProps {
  children: React.ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [showConnectModal, setShowConnectModal] = useState(false);

  const suiClient = new SuiClient({
    url: getFullnodeUrl('testnet'),
  });

  return (
    <WalletKitProvider>
      <WalletContextInner
        suiClient={suiClient}
        showConnectModal={showConnectModal}
        setShowConnectModal={setShowConnectModal}
      >
        {children}
      </WalletContextInner>
    </WalletKitProvider>
  );
};

interface WalletContextInnerProps {
  children: React.ReactNode;
  suiClient: SuiClient;
  showConnectModal: boolean;
  setShowConnectModal: (show: boolean) => void;
}

const WalletContextInner: React.FC<WalletContextInnerProps> = ({
  children,
  suiClient,
  showConnectModal,
  setShowConnectModal,
}) => {
  const walletKit = useWalletKit();
  const [connected, setConnected] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>(0);
  const [userAddress, setUserAddress] = useState<string>('');

  const fetchBalance = async (address: string) => {
    try {
      const balanceData = await suiClient.getBalance({ owner: address });
      if (balanceData && 'totalBalance' in balanceData) {
        const balanceInSui = Number(balanceData.totalBalance) / 1_000_000_000;
        setBalance(Number.isFinite(balanceInSui) ? balanceInSui : 0);
      } else {
        console.error('Invalid balance data:', balanceData);
        setBalance(0);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
      setBalance(0);
    }
  };

  useEffect(() => {
    if (walletKit.currentAccount) {
      const address = walletKit.currentAccount.address;
      setConnected(true);
      setUserAddress(address);
      fetchBalance(address);
    } else {
      setConnected(false);
      setUserAddress('');
      setBalance(0);
    }
  }, [walletKit.currentAccount, suiClient]);

  const connectWallet = () => {
    setShowConnectModal(true);
  };

  const disconnectWallet = () => {
    try {
      if (walletKit.disconnect) {
        walletKit.disconnect();
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
    setConnected(false);
    setUserAddress('');
    setBalance(0);
    setShowConnectModal(false);
  };

  const refreshBalance = () => {
    if (userAddress) {
      fetchBalance(userAddress);
    }
  };

  const value = {
    connected,
    connectWallet,
    disconnectWallet,
    balance,
    userAddress,
    showConnectModal,
    setShowConnectModal,
    refreshBalance,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
      {showConnectModal && (
        <ConnectModal
          open={showConnectModal}
          onClose={() => setShowConnectModal(false)}
        />
      )}
    </WalletContext.Provider>
  );
};

export default WalletProvider;