const crypto = require('crypto');

module.exports = {
    encrypt_data: (value, key) => {
        try {
            const crypto = require('crypto');
            const data = value;
            const cipher = crypto.createCipher('aes128', key);
            var encrypted = cipher.update(data, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            return encrypted;
        } catch (err) {
            return undefined;
        }
    },

    decrypt_data: (value, key) => {
        try {
            const mykey = crypto.createDecipher('aes128', key);;
            let mystr = mykey.update(value, 'hex', 'utf8')
            mystr += mykey.final('utf8');
            return mystr;
        } catch (err) {
            return undefined;
        }
    },

    key_generator: (length) => {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }

}