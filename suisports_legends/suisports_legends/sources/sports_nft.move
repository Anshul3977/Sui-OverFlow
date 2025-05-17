#[allow(lint(custom_state_change), duplicate_alias)]
module suisports_legends::sports_nft {
    use sui::tx_context::{TxContext, sender};
    use std::string::String;
    use sui::object;

    public struct SportsNFT has key, store {
        id: sui::object::UID,
        name: String,
        rarity: String,
    }

    public entry fun mint(name: String, rarity: String, ctx: &mut TxContext) {
        let nft = SportsNFT {
            id: object::new(ctx),
            name,
            rarity,
        };
        sui::transfer::transfer(nft, sender(ctx));
    }

    public fun transfer(nft: SportsNFT, recipient: address) {
        sui::transfer::transfer(nft, recipient);
    }

    public fun get_name(nft: &SportsNFT): String {
        nft.name
    }

    public fun get_rarity(nft: &SportsNFT): String {
        nft.rarity
    }
}