const getCollectionCount = require('../common/getCollectionCount');
const getCards = require('../common/getCards');
const BATCH_SIZE = 1000;

async function init() {
    const query = { 'purchase_urls.tcg': { $exists: true } };
    const numDocuments = await getCollectionCount(query);
    console.log(numDocuments);

    for (let i = 0; i < numDocuments; i += BATCH_SIZE) {
        const cards = await getCards(i, BATCH_SIZE, query);
        // getPrices (has getPrice within), bottlenecked
    }
}

init().catch(console.log);