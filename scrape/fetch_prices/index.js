const getCollectionCount = require('../common/getCollectionCount');
const getCards = require('../common/getCards');
const throttleCardRequests = require('../common/throttleCardRequests');
const scrapeTcg = require('./scrapeTcg');
const persistPrices = require('./persistPrices');
const BATCH_SIZE = 100;

/**
 * Iterates over the dataset, in batches and only for cards that have purchase links, persisting pricing data
 */
async function init() {
    try {
        const query = { 'purchase_urls.tcg': { $exists: true } };
        const numDocuments = await getCollectionCount(query);
        const currentDate = new Date().toISOString(); // Log the date with each scraped price

        for (let i = 0; i < numDocuments; i += BATCH_SIZE) {
            try {
                const cards = await getCards(i, BATCH_SIZE, query);

                const prices = await throttleCardRequests({
                    data: cards,
                    bnConfig: { maxConcurrent: 5, minTime: 250 },
                    fn: scrapeTcg
                });

                const pricesWithDate = prices.map(p => ({ ...p, date: currentDate })); // Attach current date

                await persistPrices(pricesWithDate);
            } catch (e) {
                console.log(e)
            }
        }
    } catch (e) {
        throw e;
    }
}

init().catch(console.log);