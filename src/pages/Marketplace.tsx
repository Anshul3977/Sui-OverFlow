import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, TrendingUp, ArrowUpDown, Tag } from 'lucide-react';
import MarketplaceCard from '../components/MarketplaceCard';
import { useWallet } from '../contexts/WalletContext';
import { useWalletKit } from '@mysten/wallet-kit';
import { TransactionBlock } from '@mysten/sui.js/transactions';

interface Listing {
  objectId: string;
  name: string;
  team: string;
  position: string;
  image: string;
  rarity: 'legendary' | 'rare' | 'common';
  price: number;
  seller: string;
}

const Marketplace: React.FC = () => {
  const { connected, userAddress, balance, refreshBalance } = useWallet();
  const { signAndExecuteTransactionBlock } = useWalletKit();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRarity, setFilterRarity] = useState<'all' | 'legendary' | 'rare' | 'common'>('all');
  const [filterPosition, setFilterPosition] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('default');
  const [showFilters, setShowFilters] = useState(false);
  const [listings, setListings] = useState<Listing[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:3000/marketplace')
      .then((res) => res.json())
      .then((data) => setListings(data))
      .catch((err) => {
        console.error('Error fetching marketplace listings:', err);
        setListings([]);
      });
  }, []);

  // Helper function to validate and normalize object ID
  const normalizeObjectId = (objectId: string): string => {
    const cleanId = objectId.replace(/^0x/, '');
    if (cleanId.length < 64) {
      return '0x' + cleanId.padEnd(64, '0');
    }
    return '0x' + cleanId;
  };

  const handleBuy = async (listing: Listing) => {
    setError(null);
    setSuccess(null);

    if (!connected || !userAddress) {
      setError('Please connect your wallet to purchase NFTs.');
      return;
    }

    if (balance < listing.price) {
      setError(
        `Insufficient balance! You need ${listing.price} SUI, but you only have ${balance.toFixed(
          2
        )} SUI. Add more test SUI using the testnet faucet.`
      );
      return;
    }

    try {
      const txb = new TransactionBlock();
      
      // Calculate price in MIST (SUI's smallest unit)
      const priceInMist = Math.round(listing.price * 1_000_000_000);
      
      // Split coins from gas for payment
      const [coin] = txb.splitCoins(txb.gas, [txb.pure(priceInMist)]);
      
      // Normalize the seller address
      const normalizedSeller = listing.seller.startsWith('0x') 
        ? listing.seller 
        : '0x' + listing.seller.padStart(64, '0');
      
      // Transfer payment to seller
      txb.transferObjects([coin], txb.pure(normalizedSeller));

      // Since the NFT doesn't exist on the blockchain, we skip the NFT transfer
      // In a real implementation, you'd transfer the NFT here:
      // txb.transferObjects([txb.object(listing.objectId)], txb.pure(userAddress));

      console.log('Executing transaction for NFT:', listing.objectId);
      console.log('Payment amount (MIST):', priceInMist);
      console.log('Seller address:', normalizedSeller);

      // Execute the transaction
      const result = await signAndExecuteTransactionBlock({
        transactionBlock: txb,
        options: { 
          showEffects: true,
          showEvents: true,
          showObjectChanges: true,
        },
      });

      if (result && result.digest) {
        setSuccess(`Successfully purchased ${listing.name} for ${listing.price} SUI! Transaction ID: ${result.digest}`);
        setListings(listings.filter((l) => l.objectId !== listing.objectId));
        
        // Update backend about the purchase to keep it in sync
        try {
          await fetch('http://localhost:3000/confirm-purchase', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              buyerAddress: userAddress, 
              objectId: listing.objectId,
              transactionId: result.digest
            }),
          });
        } catch (backendError) {
          console.warn('Backend update failed, but transaction succeeded:', backendError);
        }
        
        await refreshBalance();
      }
    } catch (error: any) {
      console.error('Error purchasing NFT:', error);
      
      if (error.message?.includes('Insufficient')) {
        setError('Insufficient SUI balance for this transaction.');
      } else if (error.message?.includes('rejected')) {
        setError('Transaction was rejected by user.');
      } else if (error.message?.includes('Invalid input')) {
        setError('Invalid NFT object ID. This NFT may not exist on the blockchain.');
      } else if (error.message?.includes('object')) {
        setError('NFT may no longer be available or owned by seller.');
      } else {
        setError(error.message || 'Failed to purchase NFT. Please try again.');
      }
    }
  };

  const filteredListings = listings
    .filter((listing) => {
      if (searchQuery && !listing.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (filterRarity !== 'all' && listing.rarity !== filterRarity) {
        return false;
      }
      if (filterPosition !== 'all' && listing.position !== filterPosition) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rarity':
          const rarityOrder = { legendary: 0, rare: 1, common: 2 };
          return rarityOrder[a.rarity] - rarityOrder[b.rarity];
        default:
          return 0;
      }
    });

  const positions = ['Batsman', 'Bowler', 'All-rounder', 'Wicket-keeper'];
  const rarities = ['legendary', 'rare', 'common'];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <motion.h1
          className="text-3xl font-bold text-white mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          NFT Marketplace
        </motion.h1>
        <motion.p
          className="text-slate-400"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Buy and sell player cards using SUI tokens
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
        <div className="mb-4 p-4 bg-red-600 text-white rounded-lg">{error}</div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-600 text-white rounded-lg">{success}</div>
      )}

      {!connected && (
        <div className="mb-4 p-4 bg-yellow-600 text-white rounded-lg">
          Please connect your wallet to purchase NFTs from the marketplace.
        </div>
      )}

      <motion.div
        className="bg-slate-800 p-4 rounded-xl border border-slate-700 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500"
            />
            <input
              type="text"
              placeholder="Search players..."
              className="w-full bg-slate-700 text-white pl-10 pr-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              className="bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Sort By</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rarity">Rarity</option>
            </select>

            <button
              className="btn btn-outline text-white px-3 py-2 flex items-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>

        {showFilters && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-700"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <div>
              <p className="text-sm text-slate-400 mb-2">Position</p>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-3 py-1 rounded-full text-sm ${
                    filterPosition === 'all'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                  onClick={() => setFilterPosition('all')}
                >
                  All
                </button>
                {positions.map((position) => (
                  <button
                    key={position}
                    className={`px-3 py-1 rounded-full text-sm ${
                      filterPosition === position
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                    onClick={() => setFilterPosition(position)}
                  >
                    {position}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-slate-400 mb-2">Rarity</p>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-3 py-1 rounded-full text-sm ${
                    filterRarity === 'all'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                  onClick={() => setFilterRarity('all')}
                >
                  All
                </button>
                {rarities.map((rarity) => (
                  <button
                    key={rarity}
                    className={`px-3 py-1 rounded-full text-sm ${
                      filterRarity === rarity
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                    onClick={() => setFilterRarity(rarity as 'legendary' | 'rare' | 'common')}
                  >
                    {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      <div className="flex justify-between items-center mb-6">
        <p className="text-slate-400">{filteredListings.length} listings found</p>
        <div className="flex items-center gap-2">
          <div className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm">
            Demo Mode
          </div>
          <button className="btn btn-primary">
            <Tag size={18} />
            <span>List Card for Sale</span>
          </button>
        </div>
      </div>

      {filteredListings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400 text-lg">No NFTs found matching your criteria</p>
          <p className="text-slate-500 mt-2">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {filteredListings.map((listing) => (
            <MarketplaceCard
              key={listing.objectId}
              id={listing.objectId}
              name={listing.name}
              team={listing.team}
              position={listing.position}
              image={listing.image}
              rarity={listing.rarity}
              price={listing.price}
              seller={listing.seller}
              onBuy={() => handleBuy(listing)}
            />
          ))}
        </div>
      )}

      <motion.div
        className="bg-slate-800 rounded-xl p-6 border border-slate-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp size={20} className="text-green-500" />
          <h3 className="text-xl font-bold text-white">Market Stats</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-700 rounded-lg p-4">
            <p className="text-sm text-slate-400 mb-1">24h Volume</p>
            <p className="text-2xl font-bold text-white">1,245 SUI</p>
            <span className="text-xs text-green-400">+12.5%</span>
          </div>

          <div className="bg-slate-700 rounded-lg p-4">
            <p className="text-sm text-slate-400 mb-1">Floor Price</p>
            <p className="text-2xl font-bold text-white">8.5 SUI</p>
            <span className="text-xs text-red-400">-2.3%</span>
          </div>

          <div className="bg-slate-700 rounded-lg p-4">
            <p className="text-sm text-slate-400 mb-1">Listed Cards</p>
            <p className="text-2xl font-bold text-white">324</p>
            <span className="text-xs text-green-400">+5.8%</span>
          </div>

          <div className="bg-slate-700 rounded-lg p-4">
            <p className="text-sm text-slate-400 mb-1">Unique Owners</p>
            <p className="text-2xl font-bold text-white">156</p>
            <span className="text-xs text-green-400">+3.2%</span>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
          <h4 className="text-blue-400 font-semibold mb-2">Demo Notice</h4>
          <p className="text-slate-300 text-sm">
            This marketplace is currently in demo mode. The NFT purchases simulate payment transactions only. 
            In a production environment, this would integrate with a proper marketplace smart contract 
            that handles NFT transfers atomically with payments.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Marketplace;