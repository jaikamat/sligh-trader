const cheerio = require('cheerio');
const convertPriceStr = require('../common/convertPriceStr');

/**
 * Helper class for formatting card price
 */
class CardPrice {
    constructor({ normal, foil }) {
        this.usd = Number(normal) || null;
        this.usd_foil = Number(foil) || null;
    }
}

/**
 * Pulls pricing data out of HTML
 * @param {String} html - The raw tcgplayer html we want to scrape data from
 */
function scrapePrice(html) {
    const $ = cheerio.load(html);

    // Iterate over rows and capture html table prices
    const marketPrices = {};
    const medianPrices = {};

    // Capture the Market Price table and loop over its rows to capture price data
    $('.price-point--market tbody tr').each((i, el) => {
        const finishTxt = $(el).find('th.price-point__name').text();
        const priceTxt = $(el).find('td.price-point__data').text();
        marketPrices[finishTxt.toLowerCase()] = convertPriceStr(priceTxt);
    });

    // Capture the Median Price table and loop over its rows to capture price data
    $('.price-point--listed-median tbody tr').each((i, el) => {
        const finishTxt = $(el).find('th.price-point__name').text();
        const priceTxt = $(el).find('td.price-point__data').text();
        medianPrices[finishTxt.toLowerCase()] = convertPriceStr(priceTxt);
    });

    return {
        market: new CardPrice(marketPrices),
        median: new CardPrice(medianPrices)
    };
}

module.exports = scrapePrice;