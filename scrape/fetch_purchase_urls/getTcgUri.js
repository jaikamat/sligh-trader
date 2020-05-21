require('dotenv').config({ path: '../.env' });
const axios = require('axios');
const { SF_API } = process.env;

/**
 * Retrieves the TCG purchase link for a particular Scryfall card
 * @param {Object} param0 - A card document from Mongo
 */
async function getTcgUri({ _id }) {
    try {
        const { data } = await axios.get(`${SF_API}/${_id}`);
        const { id, purchase_uris, name, set_name } = data;
        console.log(`${id} | ${name} | ${set_name}`);
        return { id, tcg_uri: purchase_uris.tcgplayer };
    } catch (e) {
        throw e;
    }
}

module.exports = getTcgUri;
