const express = require('express')
    , router = express.Router({ mergeParams: true });

const { Gateway } = require('fabric-network')
const { fabricAuthentication } = require('../utils/auth')
const ErrorResource = require('../utils/error')
const { createConnections } = require('../utils/functions')

const collections = require('./collections')


router.use(fabricAuthentication)

// API Root Information
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

// API Root Information
router.get('/status/:status_id', async (req, res) => {
    try {
        const status_id = req.params.status_id
        // Create Gateway and Network Connections
        const [gateway, network] = await createConnections(req);
        // Get the contract from the network.
        const contract = network.getContract('HyperledgerTaxii', 'Collection');
        let status_resource = await contract.evaluateTransaction('queryStatusById', 'status-' + status_id);
        status_resource = JSON.parse(status_resource.toString());
        delete status_resource.docType
        res.send(status_resource);
    }
    catch (error) {
        console.log(error)
        res.status(400).send(error.toString())
    }
})

router.use('/collections', collections)

// If no pattern matches on route throw 404 Found
router.use((req, res, next) => {
    const description = 'The API Root or Status ID are not found, or the client does not have access to the resource'
    res.status(404).send(ErrorResource.notFound(req.reserved_properties.request_uuid, description))
})



module.exports = router;
