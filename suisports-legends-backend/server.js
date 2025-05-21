const express = require('express');
const cors = require('cors');
const { SuiClient, getFullnodeUrl } = require('@mysten/sui.js/client');
const { TransactionBlock } = require('@mysten/sui.js/transactions');
const app = express();
const port = 3000;

const client = new SuiClient({ url: getFullnodeUrl('testnet') });

app.use(cors({
  origin: 'http://localhost:5173',
}));
app.use(express.json());

// Mock database for leagues and user data (since blockchain doesn't store this)
let userData = {
  // Example: '0x8913...a0e1': { leagues: ['1'], stakedNFTs: ['nft1'] }
};
let marketplaceListings = [
  {
    objectId: 'nft1',
    name: 'MS Dhoni NFT',
    image_url: 'https://images.pexels.com/photos/15799366/pexels-photo-15799366.jpeg',
    rarity: 'legendary',
    stats: 45,
    price: 25.5,
    seller: '0x7f34374a3468c1d6bc6e9ab9fb6319bb',
  },
  {
    objectId: 'nft2',
    name: 'Ben Stokes NFT',
    image_url: 'https://images.pexels.com/photos/15799366/pexels-photo-15799366.jpeg',
    rarity: 'rare',
    stats: 40,
    price: 12.8,
    seller: '0x9a12bc3d4e5f6789abcdef0123456789',
  },
  {
    objectId: 'nft3',
    name: 'Shreyas Iyer NFT',
    image_url: 'https://images.pexels.com/photos/3628912/pexels-photo-3628912.jpeg',
    rarity: 'common',
    stats: 42,
    price: 5.0,
    seller: '0x9a12bc3d4e5f6789abcdef0123456789',
  },
];

// Initialize user if not exists
const initializeUser = (address) => {
  if (!userData[address]) {
    userData[address] = { leagues: [], stakedNFTs: [] };
  }
};

// Get single NFT
app.get('/nft/:objectId', async (req, res) => {
  try {
    const { objectId } = req.params;
    const nft = await client.getObject({
      id: objectId,
      options: { showContent: true, showPreviousTransaction: true },
    });
    if (nft.error || !nft.data) return res.status(404).json({ error: 'NFT not found' });
    const fields = nft.data.content.fields;
    res.json({
      objectId,
      name: fields.name,
      rarity: fields.rarity,
      stats: fields.stats ? parseInt(fields.stats) : 0,
      image_url: fields.image_url,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's NFTs
app.get('/nfts/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const packageId = '0x2f4742355f35966a168aaa58eaecccc3c7146016ecec2a5725d56d2bd99d4645';
    const objects = await client.getOwnedObjects({
      owner: address,
      options: { showContent: true, showPreviousTransaction: true },
    });
    const nftIds = objects.data
      .filter(obj => obj.data?.content?.type === `${packageId}::sports_nft::SportsNFT`)
      .map(obj => obj.data.objectId);

    const nfts = [];
    for (const objectId of nftIds) {
      const nft = await client.getObject({
        id: objectId,
        options: { showContent: true, showPreviousTransaction: true },
      });
      if (nft.error || !nft.data) continue;
      const fields = nft.data.content.fields;
      nfts.push({
        objectId,
        name: fields.name,
        rarity: fields.rarity,
        stats: fields.stats ? parseInt(fields.stats) : 0,
        image_url: fields.image_url,
      });
    }

    res.json(nfts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get marketplace listings
app.get('/marketplace', (req, res) => {
  res.json(marketplaceListings);
});

// Purchase NFT (returns a transaction to transfer SUI and NFT)
app.post('/purchase-nft', async (req, res) => {
  try {
    const { buyerAddress, objectId } = req.body;
    const listing = marketplaceListings.find((l) => l.objectId === objectId);
    if (!listing) return res.status(404).json({ error: 'NFT not found in marketplace' });

    const txb = new TransactionBlock();
    const priceInMist = Math.round(listing.price * 1_000_000_000); // Convert SUI to MIST
    const [coin] = txb.splitCoins(txb.gas, [txb.pure(priceInMist)]);
    txb.transferObjects([coin], txb.pure(listing.seller));
    txb.transferObjects([txb.object(objectId)], txb.pure(buyerAddress));

    // Remove the listing from marketplace after purchase
    marketplaceListings = marketplaceListings.filter((l) => l.objectId !== objectId);

    res.json({ message: `Successfully purchased ${listing.name.replace(' NFT', '')} for ${listing.price} SUI!`, transaction: txb.serialize() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update NFT stats
app.post('/update-stats', async (req, res) => {
  try {
    const { objectId, newStats } = req.body;
    const packageId = '0x2f4742355f35966a168aaa58eaecccc3c7146016ecec2a5725d56d2bd99d4645';
    const txb = new TransactionBlock();
    txb.moveCall({
      target: `${packageId}::sports_nft::update_stats`,
      arguments: [txb.object(objectId), txb.pure(newStats)],
    });

    res.json({ message: 'Update stats transaction created', transaction: txb.serialize() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user data (joined leagues, staked NFTs)
app.get('/user/:address', (req, res) => {
  const { address } = req.params;
  initializeUser(address);
  res.json(userData[address]);
});

// Join a league
app.post('/join-league', async (req, res) => {
  try {
    const { address, leagueId, entryFee } = req.body;
    initializeUser(address);
    const user = userData[address];

    if (user.leagues.includes(leagueId)) {
      return res.status(400).json({ error: 'Already joined this league' });
    }

    const txb = new TransactionBlock();
    const feeInMist = Math.round(entryFee * 1_000_000_000); // Convert SUI to MIST
    const [coin] = txb.splitCoins(txb.gas, [txb.pure(feeInMist)]);
    txb.transferObjects([coin], txb.pure('0x0')); // Send to a burn address (mock)

    user.leagues.push(leagueId);
    userData[address] = user;

    res.json({ message: 'League join transaction created', transaction: txb.serialize() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Draft a new NFT (mock minting)
app.post('/draft-nft', async (req, res) => {
  try {
    const { address, nftName } = req.body;
    const mintingFee = 0.1;
    const txb = new TransactionBlock();
    const feeInMist = Math.round(mintingFee * 1_000_000_000);
    const [coin] = txb.splitCoins(txb.gas, [txb.pure(feeInMist)]);
    txb.transferObjects([coin], txb.pure('0x0')); // Send to a burn address (mock)

    // In a real app, this would call a Move function to mint the NFT
    res.json({ message: 'Draft NFT transaction created', transaction: txb.serialize() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stake an NFT
app.post('/stake-nft', async (req, res) => {
  try {
    const { address, nftId } = req.body;
    initializeUser(address);
    const user = userData[address];
    const stakingFee = 0.05;

    if (user.stakedNFTs.includes(nftId)) {
      return res.status(400).json({ error: 'NFT already staked' });
    }

    const txb = new TransactionBlock();
    const feeInMist = Math.round(stakingFee * 1_000_000_000);
    const [coin] = txb.splitCoins(txb.gas, [txb.pure(feeInMist)]);
    txb.transferObjects([coin], txb.pure('0x0')); // Send to a burn address (mock)

    user.stakedNFTs.push(nftId);
    userData[address] = user;

    res.json({ message: 'Stake NFT transaction created', transaction: txb.serialize() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Unstake an NFT
app.post('/unstake-nft', async (req, res) => {
  try {
    const { address, nftId } = req.body;
    initializeUser(address);
    const user = userData[address];
    const unstakingFee = 0.05;

    if (!user.stakedNFTs.includes(nftId)) {
      return res.status(400).json({ error: 'NFT not staked' });
    }

    const txb = new TransactionBlock();
    const feeInMist = Math.round(unstakingFee * 1_000_000_000);
    const [coin] = txb.splitCoins(txb.gas, [txb.pure(feeInMist)]);
    txb.transferObjects([coin], txb.pure('0x0')); // Send to a burn address (mock)

    user.stakedNFTs = user.stakedNFTs.filter((id) => id !== nftId);
    userData[address] = user;

    res.json({ message: 'Unstake NFT transaction created', transaction: txb.serialize() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});