require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const { MONGO_URI } = process.env;
const COLLECTION = 'scryfall_bulk_cards';
const DB_NAME = 'test';

/**
 * Retrieves all cards from the Mongo DB - TODO: Speed this up with streams
 * Reference here: http://mongodb.github.io/node-mongodb-native/2.0/api/Cursor.html#stream
 * @param {Integer} skip - The number of documents to skip over
 * @param {Integer} limit - Max number of documents to be returned
 */
async function getAllCards(skip = 0, limit = 0) { // limit(0) is equivalent to setting no limit
    const mongoSettings = { useNewUrlParser: true, useUnifiedTopology: true };
    console.time('getAllCards');

    try {
        var client = await MongoClient.connect(MONGO_URI, mongoSettings);
        console.log('Connected to Mongo');

        return await client
            .db(DB_NAME)
            .collection(COLLECTION)
            .find({})
            .skip(skip)
            .limit(limit)
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