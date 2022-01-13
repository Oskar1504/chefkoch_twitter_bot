const crypto = require('crypto');
const oauth1a = require('oauth-1.0a');
require('dotenv');

//SOURCE FROM STACKOF'VERFLOW
//https://stackoverflow.com/a/60582493/14077167


const CONSUMERKEY = process.env.CONSUMER_KEY;
const CONSUMERSECRET = process.env.CONSUMER_SECRET;
const TOKENKEY = process.env.ACCESS_TOKEN;
const TOKENSECRET = process.env.TOKEN_SECRET;

class Oauth1Helper {
    static getAuthHeaderForRequest(request) {
        const oauth = oauth1a({
            consumer: { key: CONSUMERKEY, secret: CONSUMERSECRET },
            signature_method: 'HMAC-SHA1',
            hash_function(base_string, key) {
                return crypto
                    .createHmac('sha1', key)
                    .update(base_string)
                    .digest('base64')
            },
        })

        const authorization = oauth.authorize(request, {
            key: TOKENKEY,
            secret: TOKENSECRET,
        });

        return oauth.toHeader(authorization);
    }
}

module.exports = Oauth1Helper;