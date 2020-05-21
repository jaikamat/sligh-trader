require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const COLLECTION = 'scryfall_bulk_cards';
const DB_NAME = 'test';
const ScryfallCard = require('./ScryfallCard');
const { MONGO_URI } = process.env;

/**
 * Creates a bulk update operation object
 * @param {Object} card - Instance of ScryfallCard
 */
function createBulkOp(card) {
    return {
        updateOne: {
            filter: { _id: card._id },
            update: {
                $set: { ...card }
            },
            upsert: true
        }
    }
}

/**
 * Upserts bulk cards from Scryfall into Mongo
 * @param {Array} data - the bulk list of default cards from Scryfall to be upserted 
 */
async function bulkUpsert(data) {
    const mongoSettings = { useNewUrlParser: true, useUnifiedTopology: true };
    const BATCH_SIZE = 1000;

    try {
        var client = await MongoClient.connect(MONGO_URI, mongoSettings); // Need this available in the finally block
        console.log('Connected to Mongo');
        console.time('Bulk write time');

        const db = await client.db(DB_NAME);

        const bulkOps = data
            .map(d => new ScryfallCard(d))
            .map(createBulkOp);

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