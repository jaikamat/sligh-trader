const bulkUpsert = require('../common/bulkUpsert');
const ScryfallCard = require('./ScryfallCard');

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
 * Models and persists cards to the db
 * @param {Array} cards - Array of Scryfall bulk cards
 */
async function persistBulk(cards) {
    try {
        const bulkOps = cards
            .map(d => new ScryfallCard(d))
            .map(createBulkOp);

        await bulkUpsert(bulkOps);
    } catch (e) {
        throw e;
    }
}

module.exports = persistBulk;