class CardFace {
    constructor({ object, name, colors, image_uris, artist }) {
        this.object = object;
        this.name = name;
        this.colors = colors;
        this.image_uris = image_uris;
        this.artist = artist;
    }
}

class ScryfallCard {
    constructor({
        id,
        name,
        cmc,
        color_identity,
        card_faces = null, // Some cards aren't double-faced, yield empty array if so for consistency
        legalities,
        reserved,
        foil,
        nonfoil,
        set,
        set_name,
        rarity,
        artist,
        colors,
        image_uris,
        tcgplayer_id
    }) {
        this._id = id;
        this.name = name;
        this.cmc = cmc;
        this.color_identity = color_identity;
        this.colors = colors;
        this.card_faces = card_faces ? card_faces.map(c => new CardFace({ ...c })) : null;
        this.legalities = legalities;
        this.reserved = reserved;
        this.foil = foil;
        this.nonfoil = nonfoil;
        this.set = set;
        this.set_name = set_name;
        this.rarity = rarity;
        this.artist = artist;
        this.image_uris = image_uris;
        this.tcgplayer_id = tcgplayer_id;
    }
}

module.exports = ScryfallCard;