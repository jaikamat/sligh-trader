const getAllCards = require('./getAllCards');
const getAllPurchaseLinks = require('./getAllPurchaseLinks');
const persistPurchaseLinks = require('./persistPurchaseLinks');
const BATCH_SIZE = 500;

/**
 * Fetches all cards from the db, scrapes scryfall for their purchase URIs, then persists them
 */
async function init() {
    try {
        console.time('Purchase link scrape');
        const cards = await getAllCards(); // Do we need to grab everyting? Maybe grab the count() and iterate over it further batches

        while (cards.length > 0) {
            const splice = cards.splice(0, BATCH_SIZE);
            const links = await getAllPurchaseLinks(splice);
            await persistPurchaseLinks(links);
        }

        console.log('TCG purchase link scrape complete');
        console.timeEnd('Purchase link scrape');
    } catch (e) {
        throw e;
    }
}

init().catch(console.log);