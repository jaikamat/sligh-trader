require('dotenv').config();
const axios = require('axios');
const { BULK_DATA_URL } = process.env;

/**
 * Retrieves all of Scryfall's bulk data options
 */
async function getDefaultCardsUri() {
    try {
        const { data } = await axios.get(BULK_DATA_URL);
        const defaultCards = data.data.find(o => o.type === 'default_cards');
        return defaultCards.permalink_uri;
    } catch (e) {
        throw e;
    }
}

module.exports = getDefaultCardsUri;