require('dotenv').config({ path: '../.env' });
const MongoClient = require('mongodb').MongoClient;
const { MONGO_URI } = process.env;
const { COLLECTION } = process.env;
const { DB_NAME } = process.env;

/**
 * Retrieves cards from Mongo DB - TODO: Speed this up with streams
 * Reference here: http://mongodb.github.io/node-mongodb-native/2.0/api/Cursor.html#stream
 * @param {Integer} skip - The number of documents to skip over
 * @param {Integer} limit - Max number of documents to be returned
 */
async function getCards(skip = 0, limit = 0, query = {}) { // limit(0) is equivalent to setting no limit
    const mongoSettings = { useNewUrlParser: true, useUnifiedTopology: true };
    console.time('getCards');

    try {
        var client = await MongoClient.connect(MONGO_URI, mongoSettings);
        console.log('Connected to Mongo');

        return await client
            .db(DB_NAME)
            .collection(COLLECTION)
            .find(query)
            .skip(skip)
            .limit(limit)
            .project({ _id: 1, purchase_urls: 1, tcgplayer_id: 1 })
            .toArray();

    } catch (e) {
        throw e;
    } finally {
        await client.close();
        console.log('Disconnected from Mongo');
        console.timeEnd('getCards');
    }
}

module.exports = getCards;