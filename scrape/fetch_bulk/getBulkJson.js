const axios = require('axios');

/**
 * Retrieves the default bulk cards from Scryfall
 * @param {String} uri
 */
async function getBulkJson(uri) {
    try {
        const { data } = await axios.get(uri);
        return data;
    } catch (e) {
        throw e;
    }
}

module.exports = getBulkJson;