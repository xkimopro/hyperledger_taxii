const express = require('express')
    , router = express.Router({ mergeParams: true });

const { Gateway } = require('fabric-network')
const { fabricAuthentication } = require('../utils/auth')
const ErrorResource = require('../utils/error')


router.use(fabricAuthentication)

// API Root Information
router.get('/', async (req, res) => {

    try {
        const user_certificate = req.reserved_properties.user_certificate
        const ccp = req.reserved_properties.ccp
        const gateway = new Gateway();
        await gateway.connect(ccp, { identity: user_certificate, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('HyperledgerTaxii', 'Bootstrap');
        const api_root_info = await contract.evaluateTransaction('fetchAPIRoot');

        // Disconnect from the gateway.
        await gateway.disconnect();
        res.send(JSON.parse(api_root_info.toString(), null, 4))
    }
    catch (error) {
        console.log(error)
        res.status(400).send(error.toString())
    }
})

// API Root Information
router.get('/status/:status_id', async (req, res) => {
    try {
        res.send("status endpoint")
        return "test"
    }
    catch (error) {
        console.log(error)
        res.status(400).send(error.toString())
    }
})

// If no pattern matches on route throw 404 Found
router.use((req, res, next) => {
    const description = 'The API Root or Status ID are not found, or the client does not have access to the resource'
    res.status(404).send(ErrorResource.notFound(req.reserved_properties.request_uuid, description))
})



module.exports = router;
