const getCollectionCount = require('../common/getCollectionCount');
const getCards = require('../common/getCards');
const throttleCardRequests = require('../common/throttleCardRequests');
const persistPurchaseLinks = require('./persistPurchaseLinks');
const getTcgUri = require('./getTcgUri');
const BATCH_SIZE = 100;

/**
 * Fetches all cards from the db, scrapes scryfall for their purchase URIs, then persists them
 */
async function init() {
    try {
        console.time('Purchase link scrape');
        const numDocuments = await getCollectionCount(); // Total number in collection
        let errors = 0; // TODO: Remove this, log errors correctly

        for (let i = 0; i < numDocuments; i += BATCH_SIZE) { // Loop over the documents
            try {
                const cards = await getCards(i, BATCH_SIZE); // In small batch sizes

                const links = await throttleCardRequests({
                    data: cards,
                    bnConfig: { maxConcurrent: 1, minTime: 125 },
                    fn: getTcgUri
                });

                await persistPurchaseLinks(links);
            } catch (e) {
                console.log(e); // Do not throw as we don't want execution of the loop to end
                errors += 1;
            }
        }

        console.log('TCG purchase link scrape complete');
        console.log(`There were ${errors} errors`);
        console.timeEnd('Purchase link scrape');
    } catch (e) {
        throw e;
    }
}

init().catch(console.log);