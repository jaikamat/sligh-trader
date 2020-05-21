require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const { MONGO_URI } = process.env;
const COLLECTION = 'scryfall_bulk_cards';
const DB_NAME = 'test';

async function getCollectionCount() {
    const mongoSettings = { useNewUrlParser: true, useUnifiedTopology: true };

    try {
        var client = await MongoClient.connect(MONGO_URI, mongoSettings);
        console.log('Connected to Mongo');

        return await client.db(DB_NAME).collection(COLLECTION).countDocuments({});
    } catch (e) {
        throw e;
    } finally {
        await client.close();
        console.log('Disconnected from Mongo');
    }
}

module.exports = getCollectionCount;