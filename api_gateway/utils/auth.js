const ErrorResource = require('./error.js')
const { Wallets } = require('fabric-network')
module.exports = {

    getCouchDBUrl: () => {
        return 'http://admin:adminpw@localhost:5984'
    },

    fabricAuthentication: async (req, res, next) => {
        try {
            const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
            if (b64auth == '') {
                res.status(401).send(ErrorResource.unauthorizedUser(req.reserved_properties.request_uuid))
                return
            }
            const [enrollment_id, enrollment_secret] = Buffer.from(b64auth, 'base64').toString().split(':')
            const wallet = await Wallets.newCouchDBWallet(module.exports.getCouchDBUrl())
            // Check if user is already in the wallet
            let found = false
            const wallet_list = await wallet.list()
            for (const label of wallet_list) {
                const username_password = Buffer.from(label, 'base64').toString('ascii')
                const username = username_password.split(':')[0]
                if (username == enrollment_id) {
                    const password = username_password.split(':')[1]
                    if (enrollment_secret == password) {
                        const user_certificate = await wallet.get(label)
                        req.reserved_properties.user_certificate = user_certificate;
                        found = true
                    }
                }
            }
            if (found) next();
            else {
                res.status(401).send(ErrorResource.unauthorizedUser(req.reserved_properties.request_uuid))
                return
            }
        }
        catch (error) {
            console.log(error)
            next()
        }

    },


};
