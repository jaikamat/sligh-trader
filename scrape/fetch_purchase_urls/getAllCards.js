require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const { MONGO_URI } = process.env;
const COLLECTION = 'scryfall_bulk_cards';
const DB_NAME = 'test';

/**
 * Retreives all cards from the Mongo DB - TODO: Speed this up with streams
 * Reference here: http://mongodb.github.io/node-mongodb-native/2.0/api/Cursor.html#stream
 */
async function getAllCards() {
    const mongoSettings = { useNewUrlParser: true, useUnifiedTopology: true };
    console.time('getAllCards');

    try {
        var client = await MongoClient.connect(MONGO_URI, mongoSettings);
        console.log('Connected to Mongo');

        return await client
            .db(DB_NAME)
            .collection(COLLECTION)
            .find({})
            .project({ _id: 1 })
            .toArray();

    } catch (e) {
        throw e;
    } finally {
        await client.close();
        console.log('Disconnected from Mongo');
        console.timeEnd('getAllCards');
    }
}

module.exports = getAllCards;