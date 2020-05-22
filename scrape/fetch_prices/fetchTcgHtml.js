const axios = require('axios');

async function getTcgHtml(url) {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (e) {
        throw e;
    }
}

module.exports = getTcgHtml;