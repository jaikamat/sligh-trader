const getCollectionCount = require('../common/getCollectionCount');
const getCards = require('../common/getCards');
const throttleCardRequests = require('../common/throttleCardRequests');
const getPrice = require('./getPrice');
const BATCH_SIZE = 100;

/**
 * Iterates over the dataset, in batches and only for cards that have purchase links, persisting pricing data
 */
async function init() {
    const query = { 'purchase_urls.tcg': { $exists: true } };
    const numDocuments = await getCollectionCount(query);
    console.log(numDocuments);

    for (let i = 0; i < numDocuments; i += BATCH_SIZE) {
        const cards = await getCards(i, BATCH_SIZE, query);

        const prices = await throttleCardRequests({
            data: cards,
            bnConfig: { maxConcurrent: 5, minTime: 100 },
            fn: getPrice
        })
    }
}

init().catch(console.log);