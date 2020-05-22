/**
 * Replaces dollar signs and commas and yields a numbered price
 * @param {String} price - A string of format $dd,ddd.dd
 */
function convertPriceStr(price) {
    const converted = Number(price.replace('$', '').replace(',', ''));
    if (Number.isNaN(converted)) return null;
    return converted.toFixed(2);
}

module.exports = convertPriceStr;