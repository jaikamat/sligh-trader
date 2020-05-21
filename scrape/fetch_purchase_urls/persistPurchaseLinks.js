require('dotenv').config({ path: '../.env' });
const MongoClient = require('mongodb').MongoClient;
const { MONGO_URI } = process.env;
const { DB_NAME } = process.env;
const { COLLECTION } = process.env;
const BATCH_SIZE = 1000;

/**
 * Creates a bulk update operation object
 * @param {Object} param0 - Contains the Scryfall ID and purchase link
 */
function createBulkOp({ id, tcg_uri }) {
    return {
        updateOne: {
            filter: { _id: id },
            update: {
                $set: { 'purchase_urls.tcg': tcg_uri }
            }
        }
    }
}

/**
 * Upserts TCG price link data to the scryfall_bulk_cards collection
 * @param {Array} data - List of objects with id and tcg_uri pairs
 */
async function persistPurchaseLinks(data) {
    const mongoSettings = { useNewUrlParser: true, useUnifiedTopology: true };

    try {
        var client = await MongoClient.connect(MONGO_URI, mongoSettings);
        console.log('Connected to Mongo');
        console.time('Purchase URL bulk write time');

        const bulkOps = data.map(createBulkOp);

        const total = bulkOps.length;

        while (bulkOps.length > 0) {
            const spliced = bulkOps.splice(0, BATCH_SIZE);
            await client.db(DB_NAME).collection(COLLECTION).bulkWrite(spliced);
            const progress = ((1 - bulkOps.length / total) * 100).toFixed(1);
            console.log(`Bulkwrite in progress: ${progress}%`);
        }

        console.timeEnd('Purchase URL bulk write time');
    } catch (e) {
        throw e;
    } finally {
        await client.close();
        console.log('Disconnected from Mongo');
    }
}

module.exports = persistPurchaseLinks;