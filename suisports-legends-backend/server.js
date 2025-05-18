const express = require('express');
const { SuiClient, getFullnodeUrl } = require('@mysten/sui.js/client');
const { TransactionBlock } = require('@mysten/sui.js/transactions');
const app = express();
const port = 3000;

const client = new SuiClient({ url: getFullnodeUrl('testnet') });

app.use(express.json());

app.get('/nft/:objectId', async (req, res) => {
    try {
        const { objectId } = req.params;
        const nft = await client.getObject({
            id: objectId,
            options: { showContent: true },
        });
        if (nft.error || !nft.data) return res.status(404).json({ error: 'NFT not found' });
        const fields = nft.data.content.fields;
        res.json({
            objectId,
            name: fields.name,
            rarity: fields.rarity,
            stats: fields.stats ? parseInt(fields.stats) : 0, // Fallback to 0 if stats is missing
            image_url: fields.image_url
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/nfts/:address', async (req, res) => {
    try {
        const { address } = req.params;
        const packageId = '0x2f4742355f35966a168aaa58eaecccc3c7146016ecec2a5725d56d2bd99d4645'; // New package ID
        const objects = await client.getOwnedObjects({
            owner: address,
            options: { showContent: true },
        });
        const nfts = objects.data
            .filter(obj => obj.data?.content?.type === `${packageId}::sports_nft::SportsNFT`) // Filter by new package ID
            .map(obj => ({
                objectId: obj.data.objectId,
                name: obj.data.content.fields.name,
                rarity: obj.data.content.fields.rarity,
                stats: obj.data.content.fields.stats ? parseInt(obj.data.content.fields.stats) : 0, // Fallback to 0 if stats is missing
                image_url: obj.data.content.fields.image_url
            }));
        res.json(nfts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/update-stats', async (req, res) => {
    try {
        const { objectId, newStats } = req.body;
        const packageId = '0x2f4742355f35966a168aaa58eaecccc3c7146016ecec2a5725d56d2bd99d4645';
        const txb = new TransactionBlock();
        txb.moveCall({
            target: `${packageId}::sports_nft::update_stats`,
            arguments: [txb.object(objectId), txb.pure(newStats)],
        });

        res.json({ message: 'Update stats transaction created. Execute it via CLI.', transaction: txb });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});