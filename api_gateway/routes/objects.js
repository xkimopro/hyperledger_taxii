const express = require('express')
    , router = express.Router({ mergeParams: true });

const { Gateway } = require('fabric-network')
const { fabricAuthentication } = require('../utils/auth')
const ErrorResource = require('../utils/error')
const { createConnections } = require('../utils/functions')



router.use(fabricAuthentication)


// List objects of collection
router.get('/', async (req, res) => {

    try {

        // Create Gateway and Network Connections
        const [gateway, network] = await createConnections(req);

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

module.exports = router