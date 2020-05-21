const getAllCards = require('./getAllCards');
const getAllPurchaseLinks = require('./getAllPurchaseLinks');
const persistPurchaseLinks = require('./persistPurchaseLinks');
const getCollectionCount = require('./getCollectionCount');
const BATCH_SIZE = 100;

/**
 * Fetches all cards from the db, scrapes scryfall for their purchase URIs, then persists them
 */
async function init() {
    try {
        console.time('Purchase link scrape');
        const numDocuments = await getCollectionCount(); // Total number in collection

        for (let i = 0; i < numDocuments; i += BATCH_SIZE) {
            const cards = await getAllCards(i, BATCH_SIZE);
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