require('dotenv').config({ path: '../.env' });
const MongoClient = require('mongodb').MongoClient;
const { MONGO_URI } = process.env;
const { COLLECTION } = process.env;
const { DB_NAME } = process.env;

async function getCollectionCount(query = {}) {
    const mongoSettings = { useNewUrlParser: true, useUnifiedTopology: true };

    try {
        var client = await MongoClient.connect(MONGO_URI, mongoSettings);
        console.log('Connected to Mongo');

        return await client.db(DB_NAME).collection(COLLECTION).countDocuments(query);
    } catch (e) {
        throw e;
    } finally {
        await client.close();
        console.log('Disconnected from Mongo');
    }
}

module.exports = getCollectionCount;