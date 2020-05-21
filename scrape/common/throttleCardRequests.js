const Bottleneck = require('bottleneck');

/**
 * Iterates over an array of cards, executing throttled callbacks based on a config object
 * @param {Array} data - Array of cards to work on
 * @param {Object} bnConfig - The config object for bottleneck
 * @param {Function} fn - The function to throttle
 */
async function throttleCardRequests({ data, bnConfig, fn }) {
    try {
        const limiter = new Bottleneck(bnConfig);

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

        const throttled = limiter.wrap(fn); // Wrap the callback using the limiter to throttle

        const resolveAllLinks = data.map(card => throttled(card)); // Create the list of Promises

        return await Promise.all(resolveAllLinks); // Resolve everything
    } catch (e) {
        throw e;
    }
}

module.exports = throttleCardRequests;