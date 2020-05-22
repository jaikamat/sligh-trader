const fetchTcgHtml = require('./fetchTcgHtml');
const scrapePrice = require('./scrapePrice');

/**
 * Scrapes a TCG purchase link for price data
 * @param {Object} param0 - Object containing a card ID and its corresponding purchase URL
 */
async function scrapeTcg({ _id, purchase_urls }) {
    try {
        const html = await fetchTcgHtml(purchase_urls.tcg);
        const { market, median } = await scrapePrice(html);
        return { _id, market, median };
    } catch (e) {
        throw e;
    }
}

module.exports = scrapeTcg;