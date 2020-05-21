/**
 * Filters bulk to only include cards printed in paper
 * @param {Array} bulk - Array of default bulk cards from Scryfall
 */
function filterBulk(bulk) {
    return bulk.filter(({ games }) => games.includes('paper'));
}

module.exports = filterBulk;