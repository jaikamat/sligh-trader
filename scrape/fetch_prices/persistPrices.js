const bulkUpsert = require('../common/bulkUpsert');

/**
 * Creates a bulk update operation object
 * @param {Object} prices - Price object that yields market, mid, and _id
 */
function createBulkOp({ _id, market, median, date }) {
    return {
        updateOne: {
            filter: { _id: _id },
            update: {
                $push: {
                    tcg_prices: { market, median, date }
                }
            },
            upsert: true
        }
    }
}

/**
 * Persists price data
 * @param {Object} prices - Object yielded from ./scrapeTcg with TCG price values
 */
async function persistPrices(prices) {
    try {
        const bulkOps = prices.map(p => createBulkOp(p));
        await bulkUpsert(bulkOps);
    } catch (e) {
        throw e;
    }
}

module.exports = persistPrices;