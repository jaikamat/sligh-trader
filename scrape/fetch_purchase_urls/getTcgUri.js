require('dotenv').config({ path: '../.env' });
const axios = require('axios');
const { SF_API } = process.env;

async function getTcgUri({ _id }) {
    try {
        const { data } = await axios.get(`${SF_API}/${_id}`);
        const { id, purchase_uris, name, set_name } = data;
        console.log(`${id} | ${name} | ${set_name}`);
        return { id, tcg_uri: purchase_uris.tcgplayer };
    } catch (e) {
        throw e;
    }
}

module.exports = getTcgUri;
