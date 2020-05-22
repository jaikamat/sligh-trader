const bulkUpsert = require('../common/bulkUpsert');

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
    try {
        await bulkUpsert(data.map(createBulkOp));
    } catch (e) {
        throw e;
    }
}

module.exports = persistPurchaseLinks;