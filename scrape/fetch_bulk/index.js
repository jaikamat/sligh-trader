const getDefaultCardsUri = require('./getDefaultCardsUri');
const getBulkJSON = require('./getBulkJSON');
const filterBulk = require('./filterBulk');
const bulkUpsert = require('./bulkUpsert');

/**
 * Scrapes Scryfall's bulk and upserts them to the Mongo collection
 */
async function init() {
    try {
        const bulkUri = await getDefaultCardsUri(); // Get the URI for the bulk
        const bulkCards = await getBulkJSON(bulkUri); // Reteive the data
        const filteredCards = filterBulk(bulkCards); // Remove non-paper cards
        await bulkUpsert(filteredCards); // Push it to Mongo
    } catch (e) {
        throw e;
    }
}

init().catch(console.log)