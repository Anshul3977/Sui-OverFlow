#[allow(lint(custom_state_change), duplicate_alias)]
module suisports_legends::sports_nft {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::vec_map::{Self, VecMap};
    use std::string::{Self, String};

    // Error codes
    const EEmptyImageUrl: u64 = 0;

    // Athlete NFT
    public struct SportsNFT has key, store {
        id: UID,
        name: String,
        rarity: String,
        stats: u64,
        image_url: String,
    }

    // Marketplace listing
    public struct Listing has key, store {
        id: UID,
        nft_id: address,
        price: u64,
        seller: address,
    }

    // Fantasy team
    public struct FantasyTeam has key, store {
        id: UID,
        owner: address,
        nfts: VecMap<address, bool>,
        score: u64,
    }

    // Mint an NFT
    public entry fun mint(name: String, rarity: String, stats: u64, image_url: String, ctx: &mut TxContext) {
        // Validate image_url
        assert!(string::length(&image_url) > 0, EEmptyImageUrl);

        let nft = SportsNFT {
            id: object::new(ctx),
            name,
            rarity,
            stats,
            image_url,
        };
        transfer::public_transfer(nft, tx_context::sender(ctx));
    }

    // List an NFT for sale
    public entry fun list_nft(nft: SportsNFT, price: u64, ctx: &mut TxContext) {
        let nft_id = object::id_address(&nft);
        let listing = Listing {
            id: object::new(ctx),
            nft_id,
            price,
            seller: tx_context::sender(ctx),
        };
        transfer::public_transfer(nft, object::id_to_address(&object::id(&listing)));
        transfer::public_transfer(listing, tx_context::sender(ctx));
    }

    // Buy an NFT from the marketplace
    public entry fun buy_nft(listing: Listing, nft: SportsNFT, payment: &mut Coin<SUI>, ctx: &mut TxContext) {
        let buyer = tx_context::sender(ctx);
        let price = listing.price;
        let seller = listing.seller;
        let nft_id = listing.nft_id;

        // Verify the NFT matches the listing
        assert!(object::id_address(&nft) == nft_id, 0);

        // Verify payment
        assert!(coin::value(payment) >= price, 1);
        let paid = coin::split(payment, price, ctx);
        transfer::public_transfer(paid, seller);

        // Transfer NFT to buyer
        transfer::public_transfer(nft, buyer);

        // Delete listing
        let Listing { id, nft_id: _, price: _, seller: _ } = listing;
        object::delete(id);
    }

    // Create a fantasy team
    public entry fun create_team(ctx: &mut TxContext) {
        let team = FantasyTeam {
            id: object::new(ctx),
            owner: tx_context::sender(ctx),
            nfts: vec_map::empty(),
            score: 0,
        };
        transfer::public_transfer(team, tx_context::sender(ctx));
    }

    // Add NFT to a fantasy team
    public entry fun add_to_team(team: &mut FantasyTeam, nft: &SportsNFT, ctx: &mut TxContext) {
        assert!(team.owner == tx_context::sender(ctx), 1);
        let nft_id = object::id_address(nft);
        vec_map::insert(&mut team.nfts, nft_id, true);
        team.score = team.score + nft.stats;
    }

    // Update NFT stats (mock oracle)
    public entry fun update_stats(nft: &mut SportsNFT, new_stats: u64) {
        nft.stats = new_stats;
    }

    // Update NFT image URL
    public entry fun update_image_url(nft: &mut SportsNFT, new_image_url: String) {
        // Validate image_url
        assert!(string::length(&new_image_url) > 0, EEmptyImageUrl);
        nft.image_url = new_image_url;
    }

    // Getter functions
    public fun get_name(nft: &SportsNFT): String {
        nft.name
    }

    public fun get_rarity(nft: &SportsNFT): String {
        nft.rarity
    }

    public fun get_stats(nft: &SportsNFT): u64 {
        nft.stats
    }

    public fun get_image_url(nft: &SportsNFT): String {
        nft.image_url
    }
}