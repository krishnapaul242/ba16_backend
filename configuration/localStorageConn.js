const storage = require('node-persist');

storage.init({
    stringify: JSON.stringify,
    parse: JSON.parse,
    encoding: 'utf8',
    logging: false,
    ttl: false,
    expiredInterval: 3 * 60 * 1000,
    forgiveParseErrors: false
});

module.exports = storage;
