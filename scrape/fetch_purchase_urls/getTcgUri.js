require('dotenv').config();
const axios = require('axios');
const { SF_API } = process.env;

async function getTcgUri(scryfallId) {
    try {
        const { data } = await axios.get(`${SF_API}/${scryfallId}`);
        const { id, purchase_uris, name, set_name } = data;
        console.log(`${id} | ${name} | ${set_name}`);
        return { id, tcg_uri: purchase_uris.tcgplayer };
    } catch (e) {
        throw e;
    }
}

module.exports = getTcgUri;

// Get all the data, then once all the bottlenecked promises resolve, bulk update the scryfall_bulk cards by $setting the cardID's purchase URI
// NOTE: REMEMBER to turn off upsert, only want to affect card objects, not make new entries
