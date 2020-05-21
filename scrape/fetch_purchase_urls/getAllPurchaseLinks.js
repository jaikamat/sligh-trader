const Bottleneck = require('bottleneck');
const getTcgUri = require('./getTcgUri');

/**
 * Grabs all the purchase links for a list of cards by their _id
 * @param {Array} cards - Array of cards, freshly retrieved from our database
 */
async function getAllPurchaseLinks(cards) {
    try {
        const limiter = new Bottleneck({ maxConcurrent: 1, minTime: 125 }); // 8 requests per second

        // Assign a callback to the 'failed' job event; called every time a job fails
        limiter.on('failed', async (err, jobInfo) => {
            const { id } = jobInfo.options;
            console.log(`Job ${id} failed: ${err}`);

            if (jobInfo.retryCount < 2) { // Retry twice
                console.log(`Retrying job ${id} in 25ms`);
                return 25;
            }
        })

        limiter.on('retry', (err, jobInfo) => console.log(`Now retrying ${jobInfo.options.id}`)); // Subscribe to the 'retry' event to log

        limiter.on('done', (info) => console.log(limiter.counts())); // Log the limiter queue information

        const throttled = limiter.wrap(getTcgUri); // Wrap the callback using the limiter to throttle

        const resolveAllLinks = cards.map(card => throttled(card._id)); // Create the list of Promises

        return await Promise.all(resolveAllLinks); // Resolve everything
    } catch (e) {
        throw e;
    }
}

module.exports = getAllPurchaseLinks;