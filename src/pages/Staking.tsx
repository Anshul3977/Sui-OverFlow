import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PiggyBank, Lock, Unlock, TrendingUp, ArrowRight, Info, Trophy, Star, X } from 'lucide-react';
import PlayerCard, { PlayerRarity } from '../components/PlayerCard';
import { useWallet } from '../contexts/WalletContext';

interface NFT {
  id: string;
  name: string;
  team: string;
  position: string;
  image: string;
  rarity: PlayerRarity;
  stats: {
    runs?: number;
    wickets?: number;
    catches?: number;
    average?: number;
  };
  stakingRewards?: number;
  timeStaked?: string;
}

const Staking: React.FC = () => {
  const { connected, userAddress, balance, refreshBalance } = useWallet();
  const [activeTab, setActiveTab] = useState<'staked' | 'unstaked'>('staked');
  const [stakedNFTs, setStakedNFTs] = useState<NFT[]>([]);
  const [unstakedNFTs, setUnstakedNFTs] = useState<NFT[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showStakingGuide, setShowStakingGuide] = useState<boolean>(false);

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
          console.log('Fetched user data for staking:', data);
          const ownedNFTs = data.ownedNFTs || [];
          const stakedNFTIds = data.stakedNFTs || [];

          const allNFTs = ownedNFTs.map((nft: any) => {
            const position = nft.stats > 50 ? 'Bowler' : 
                            nft.stats > 45 && nft.stats <= 50 ? 'All-rounder' : 
                            nft.stats === 45 ? 'Batsman' : 
                            'Wicket-keeper';

            const isJadeja = nft.name.includes('Ravindra');
            const runs = isJadeja ? 300 : (position === 'Batsman' || position === 'Wicket-keeper' ? Math.round(nft.stats * 10) : 0);

            return {
              id: nft.objectId,
              name: nft.name.replace(' NFT', ''),
              team: nft.team,
              position: position,
              image: nft.image,
              rarity: nft.rarity.toLowerCase() as PlayerRarity,
              stats: {
                runs: runs,
                wickets: position === 'Bowler' ? Math.round(nft.stats / 2) : 0,
                catches: position === 'Wicket-keeper' ? Math.round(nft.stats / 3) : Math.round(nft.stats / 5),
                average: position === 'Batsman' || position === 'Wicket-keeper' ? nft.stats : 
                         position === 'Bowler' ? nft.stats / 2 : 0,
              },
            };
          });

          const staked = allNFTs
            .filter((nft: NFT) => stakedNFTIds.includes(nft.id))
            .map((nft: NFT) => ({
              ...nft,
              stakingRewards: nft.rarity === 'legendary' ? 0.5 : nft.rarity === 'epic' ? 0.4 : nft.rarity === 'rare' ? 0.3 : 0.2,
              timeStaked: '30 days',
            }));

          const unstaked = allNFTs.filter((nft: NFT) => !stakedNFTIds.includes(nft.id));

          setStakedNFTs(staked);
          setUnstakedNFTs(unstaked);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          setError('Failed to load NFTs. Please try again.');
        });
    }
  }, [connected, userAddress]);

  const handleStakeNFT = async (nftId: string) => {
    setError(null);
    setSuccess(null);

    if (!connected || !userAddress) {
      setError('Please connect your wallet to stake an NFT.');
      return;
    }

    if (balance < 0.05) {
      setError(
        `Insufficient balance! You need 0.05 SUI to stake, but you only have ${balance.toFixed(2)} SUI. Add more test SUI using the testnet faucet.`
      );
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/stake-nft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: userAddress,
          nftId: nftId,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to stake NFT');
      }

      if (data.success) {
        const userData = await fetch(`http://localhost:3000/user/${userAddress}`).then(res => res.json());
        const ownedNFTs = userData.ownedNFTs || [];
        const stakedNFTIds = userData.stakedNFTs || [];

        const allNFTs = ownedNFTs.map((nft: any) => {
          const position = nft.stats > 50 ? 'Bowler' : 
                          nft.stats > 45 && nft.stats <= 50 ? 'All-rounder' : 
                          nft.stats === 45 ? 'Batsman' : 
                          'Wicket-keeper';

          const isJadeja = nft.name.includes('Ravindra');
          const runs = isJadeja ? 300 : (position === 'Batsman' || position === 'Wicket-keeper' ? Math.round(nft.stats * 10) : 0);

          return {
            id: nft.objectId,
            name: nft.name.replace(' NFT', ''),
            team: nft.team,
            position: position,
            image: nft.image,
            rarity: nft.rarity.toLowerCase() as PlayerRarity,
            stats: {
              runs: runs,
              wickets: position === 'Bowler' ? Math.round(nft.stats / 2) : 0,
              catches: position === 'Wicket-keeper' ? Math.round(nft.stats / 3) : Math.round(nft.stats / 5),
              average: position === 'Batsman' || position === 'Wicket-keeper' ? nft.stats : 
                       position === 'Bowler' ? nft.stats / 2 : 0,
            },
          };
        });

        const staked = allNFTs
          .filter((nft: NFT) => stakedNFTIds.includes(nft.id))
          .map((nft: NFT) => ({
            ...nft,
            stakingRewards: nft.rarity === 'legendary' ? 0.5 : nft.rarity === 'epic' ? 0.4 : nft.rarity === 'rare' ? 0.3 : 0.2,
            timeStaked: '30 days',
          }));

        const unstaked = allNFTs.filter((nft: NFT) => !stakedNFTIds.includes(nft.id));

        setStakedNFTs(staked);
        setUnstakedNFTs(unstaked);
        setSuccess('NFT staked successfully!');
        refreshBalance();
      }
    } catch (error) {
      console.error('Error staking NFT:', error);
      setError('Failed to stake NFT. Please try again.');
    }
  };

  const handleUnstakeNFT = async (nftId: string) => {
    setError(null);
    setSuccess(null);

    if (!connected || !userAddress) {
      setError('Please connect your wallet to unstake an NFT.');
      return;
    }

    if (balance < 0.05) {
      setError(
        `Insufficient balance! You need 0.05 SUI to unstake, but you only have ${balance.toFixed(2)} SUI. Add more test SUI using the testnet faucet.`
      );
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/unstake-nft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: userAddress,
          nftId: nftId,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to unstake NFT');
      }

      if (data.success) {
        const userData = await fetch(`http://localhost:3000/user/${userAddress}`).then(res => res.json());
        const ownedNFTs = userData.ownedNFTs || [];
        const stakedNFTIds = userData.stakedNFTs || [];

        const allNFTs = ownedNFTs.map((nft: any) => {
          const position = nft.stats > 50 ? 'Bowler' : 
                          nft.stats > 45 && nft.stats <= 50 ? 'All-rounder' : 
                          nft.stats === 45 ? 'Batsman' : 
                          'Wicket-keeper';

          const isJadeja = nft.name.includes('Ravindra');
          const runs = isJadeja ? 300 : (position === 'Batsman' || position === 'Wicket-keeper' ? Math.round(nft.stats * 10) : 0);

          return {
            id: nft.objectId,
            name: nft.name.replace(' NFT', ''),
            team: nft.team,
            position: position,
            image: nft.image,
            rarity: nft.rarity.toLowerCase() as PlayerRarity,
            stats: {
              runs: runs,
              wickets: position === 'Bowler' ? Math.round(nft.stats / 2) : 0,
              catches: position === 'Wicket-keeper' ? Math.round(nft.stats / 3) : Math.round(nft.stats / 5),
              average: position === 'Batsman' || position === 'Wicket-keeper' ? nft.stats : 
                       position === 'Bowler' ? nft.stats / 2 : 0,
            },
          };
        });

        const staked = allNFTs
          .filter((nft: NFT) => stakedNFTIds.includes(nft.id))
          .map((nft: NFT) => ({
            ...nft,
            stakingRewards: nft.rarity === 'legendary' ? 0.5 : nft.rarity === 'epic' ? 0.4 : nft.rarity === 'rare' ? 0.3 : 0.2,
            timeStaked: '30 days',
          }));

        const unstaked = allNFTs.filter((nft: NFT) => !stakedNFTIds.includes(nft.id));

        setStakedNFTs(staked);
        setUnstakedNFTs(unstaked);
        setSuccess('NFT unstaked successfully!');
        refreshBalance();
      }
    } catch (error) {
      console.error('Error unstaking NFT:', error);
      setError('Failed to unstake NFT. Please try again.');
    }
  };

  const totalValueStaked = stakedNFTs.reduce((sum, nft) => {
    const value = nft.rarity === 'legendary' ? 50 : nft.rarity === 'epic' ? 30 : nft.rarity === 'rare' ? 20 : 10;
    return sum + value;
  }, 0);

  const totalDailyRewards = stakedNFTs.reduce((sum, nft) => sum + (nft.stakingRewards || 0), 0);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <motion.h1 
          className="text-3xl font-bold text-white mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          NFT Staking
        </motion.h1>
        <motion.p 
          className="text-slate-400"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Stake your player cards to earn SUI rewards
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
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="lg:col-span-2">
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="flex border-b border-slate-700">
              <button
                className={`flex-1 px-4 py-3 text-sm font-medium ${
                  activeTab === 'staked'
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
                onClick={() => setActiveTab('staked')}
              >
                Staked NFTs ({stakedNFTs.length})
              </button>
              <button
                className={`flex-1 px-4 py-3 text-sm font-medium ${
                  activeTab === 'unstaked'
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
                onClick={() => setActiveTab('unstaked')}
              >
                Unstaked NFTs ({unstakedNFTs.length})
              </button>
            </div>

            <div className="p-4">
              {activeTab === 'staked' ? (
                stakedNFTs.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {stakedNFTs.map((nft) => (
                      <div key={nft.id} className="relative">
                        <PlayerCard {...nft} />
                        <div className="absolute top-2 right-2 bg-green-500/90 text-white text-xs px-2 py-1 rounded-full flex items-center">
                          <Lock size={12} className="mr-1" />
                          Staked
                        </div>
                        <div className="mt-2 bg-slate-700/50 rounded-lg p-3">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-400">Time Staked:</span>
                            <span className="text-white">{nft.timeStaked}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm mt-1">
                            <span className="text-slate-400">Rewards Earned:</span>
                            <span className="text-emerald-400">{nft.stakingRewards} SUI</span>
                          </div>
                          <button 
                            className="btn btn-primary w-full mt-3"
                            onClick={() => handleUnstakeNFT(nft.id)}
                          >
                            <Unlock size={16} />
                            Unstake
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <PiggyBank size={48} className="mx-auto text-slate-600 mb-4" />
                    <p className="text-slate-400">No NFTs staked yet</p>
                  </div>
                )
              ) : (
                unstakedNFTs.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {unstakedNFTs.map((nft) => (
                      <div key={nft.id} className="relative">
                        <PlayerCard {...nft} />
                        <button 
                          className="btn btn-primary w-full mt-3"
                          onClick={() => handleStakeNFT(nft.id)}
                        >
                          <Lock size={16} />
                          Stake NFT
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <PiggyBank size={48} className="mx-auto text-slate-600 mb-4" />
                    <p className="text-slate-400">No unstaked NFTs available</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp size={20} className="text-emerald-500" />
              <h2 className="text-xl font-bold text-white">Staking Stats</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="text-sm text-slate-400 mb-1">Total Value Staked</p>
                <p className="text-2xl font-bold text-white">{totalValueStaked} SUI</p>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="text-sm text-slate-400 mb-1">Daily Rewards Rate</p>
                <p className="text-2xl font-bold text-emerald-400">{totalDailyRewards.toFixed(2)} SUI</p>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="text-sm text-slate-400 mb-1">NFTs Staked</p>
                <p className="text-2xl font-bold text-white">{stakedNFTs.length} / {stakedNFTs.length + unstakedNFTs.length}</p>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Info size={16} className="text-slate-400 mt-1 flex-shrink-0" />
                  <p className="text-sm text-slate-400">
                    Staking your NFTs earns you daily rewards in SUI tokens and unlocks access to premium leagues.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button 
                className="btn btn-primary w-full"
                onClick={() => setShowStakingGuide(true)}
              >
                <span>View Staking Guide</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {showStakingGuide && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <motion.div 
            className="bg-slate-800 rounded-xl p-6 max-w-2xl w-full mx-4 border border-slate-700"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">Staking Guide</h2>
              <button 
                className="text-slate-400 hover:text-white"
                onClick={() => setShowStakingGuide(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4 text-slate-300">
              <div>
                <h3 className="text-lg font-semibold text-white">What is Staking?</h3>
                <p className="text-sm">
                  Staking your NFTs locks them in the platform to earn daily SUI rewards and unlock access to premium features like exclusive leagues.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">How to Stake?</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Go to the "Unstaked NFTs" tab.</li>
                  <li>Click "Stake NFT" on the player card you want to stake (costs 0.05 SUI).</li>
                  <li>Your NFT will move to the "Staked NFTs" tab and start earning rewards.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Rewards Structure</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Legendary NFTs: 0.5 SUI per day</li>
                  <li>Epic NFTs: 0.4 SUI per day</li>
                  <li>Rare NFTs: 0.3 SUI per day</li>
                  <li>Common NFTs: 0.2 SUI per day</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Benefits of Staking</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Earn daily SUI rewards based on NFT rarity.</li>
                  <li>Access premium leagues with higher prize pools.</li>
                  <li>Get bonus points in weekly leagues for staked NFTs.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Unstaking</h3>
                <p className="text-sm">
                  You can unstake your NFTs at any time (costs 0.05 SUI), but you cannot unstake NFTs that are part of an active league team until the league ends.
                </p>
              </div>
            </div>
            <button 
              className="btn btn-primary w-full mt-6"
              onClick={() => setShowStakingGuide(false)}
            >
              Got It!
            </button>
          </motion.div>
        </div>
      )}

      <motion.div 
        className="bg-slate-800 rounded-xl border border-slate-700 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <PiggyBank size={24} className="text-indigo-400" />
          <h2 className="text-xl font-bold text-white">Staking Benefits</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center mb-3">
              <TrendingUp size={20} className="text-indigo-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Daily Rewards</h3>
            <p className="text-sm text-slate-400">
              Earn SUI tokens daily based on the rarity and number of NFTs staked
            </p>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mb-3">
              <Trophy size={20} className="text-emerald-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Premium Leagues</h3>
            <p className="text-sm text-slate-400">
              Access exclusive leagues with higher prize pools and better rewards
            </p>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center mb-3">
              <Star size={20} className="text-yellow-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Bonus Points</h3>
            <p className="text-sm text-slate-400">
              Get bonus points in weekly leagues for your staked NFTs
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Staking;