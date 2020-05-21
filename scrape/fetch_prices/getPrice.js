const axios = require('axios');
// need cheerio to scrape

async function getPrice({ purchase_urls }) {
    const { data } = await axios.get(purchase_urls.tcg);
    console.log(data);

}

module.exports = getPrice;