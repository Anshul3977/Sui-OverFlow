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
            options: { showContent: true, showPreviousTransaction: true },
        });
        if (nft.error || !nft.data) return res.status(404).json({ error: 'NFT not found' });
        const fields = nft.data.content.fields;
        res.json({
            objectId,
            name: fields.name,
            rarity: fields.rarity,
            stats: fields.stats ? parseInt(fields.stats) : 0,
            image_url: fields.image_url
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/nfts/:address', async (req, res) => {
    try {
        const { address } = req.params;
        const packageId = '0x2f4742355f35966a168aaa58eaecccc3c7146016ecec2a5725d56d2bd99d4645';
        // Step 1: Get the list of owned objects
        const objects = await client.getOwnedObjects({
            owner: address,
            options: { showContent: true, showPreviousTransaction: true },
        });
        const nftIds = objects.data
            .filter(obj => obj.data?.content?.type === `${packageId}::sports_nft::SportsNFT`)
            .map(obj => obj.data.objectId);

        // Step 2: Fetch the latest state of each NFT individually
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
                image_url: fields.image_url
            });
        }

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