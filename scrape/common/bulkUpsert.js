require('dotenv').config({ path: '../.env' });
const MongoClient = require('mongodb').MongoClient;
const { COLLECTION } = process.env;
const { DB_NAME } = process.env;
const { MONGO_URI } = process.env;

/**
 * Performs a bulk operation on the database
 * @param {Array} bulkOps - the bulk operations to be executed
 */
async function bulkUpsert(bulkOps) {
    const mongoSettings = { useNewUrlParser: true, useUnifiedTopology: true };
    const BATCH_SIZE = 1000;

    try {
        var client = await MongoClient.connect(MONGO_URI, mongoSettings); // Need this available in the finally block
        console.log('Connected to Mongo');
        console.time('Bulk write time');

        const db = await client.db(DB_NAME);

        const total = bulkOps.length;

        while (bulkOps.length > 0) {
            const spliced = bulkOps.splice(0, BATCH_SIZE);
            await db.collection(COLLECTION).bulkWrite(spliced);
            const progress = ((1 - bulkOps.length / total) * 100).toFixed(1);
            console.log(`Bulkwrite in progress: ${progress}%`);
        }

        console.timeEnd('Bulk write time');
    } catch (e) {
        throw e;
    } finally {
        await client.close();
        console.log('Disconnected from Mongo');
    }
}

module.exports = bulkUpsert;