const getCollectionCount = require('../common/getCollectionCount');
const getCards = require('../common/getCards');
const getAllPurchaseLinks = require('./getAllPurchaseLinks');
const persistPurchaseLinks = require('./persistPurchaseLinks');
const BATCH_SIZE = 100;

/**
 * Fetches all cards from the db, scrapes scryfall for their purchase URIs, then persists them
 */
async function init() {
    try {
        console.time('Purchase link scrape');
        const numDocuments = await getCollectionCount(); // Total number in collection

        for (let i = 0; i < numDocuments; i += BATCH_SIZE) { // Loop over the documents
            const cards = await getCards(i, BATCH_SIZE); // In small batch sizes
            const links = await getAllPurchaseLinks(cards);
            await persistPurchaseLinks(links);
        }

        console.log('TCG purchase link scrape complete');
        console.timeEnd('Purchase link scrape');
    } catch (e) {
        throw e;
    }
}

init().catch(console.log);