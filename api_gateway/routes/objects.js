const express = require('express')
    , router = express.Router({ mergeParams: true });

const { Gateway } = require('fabric-network')
const { fabricAuthentication } = require('../utils/auth')
const ErrorResource = require('../utils/error')
const { createConnections, validateObject } = require('../utils/functions')

const { v4: uuidv4 } = require('uuid');


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



router.post('/', async (req, res) => {
    try {
        // Private data collections remain
        const collection_id = req.params.collection_id

        // Create Gateway and Network Connections
        const [gateway, network] = await createConnections(req);

        // Get the contract from the network.
        const contract = network.getContract('HyperledgerTaxii', 'Collection');

        const envelope = req.body

        // Status
        const status_id = uuidv4()
        const pending_count = envelope.objects.length;
        const initial_status = {
            id: status_id,
            status: 'pending',
            request_timestamp: new Date().toISOString(),
            total_count: pending_count,
            success_count: 0,
            failure_count: 0,
            pending_count: pending_count,
            docType: 'status'
        }

        // Insert initial status on state
        await contract.submitTransaction('creatInitialStatus', JSON.stringify(initial_status))

        // Iterate objects and fetch current version
        const objects = envelope.objects;
        for (const obj of objects) {
            try {
                let current_version = await contract.evaluateTransaction('queryObjectById', obj.id);
                obj.current_version = JSON.parse(current_version);
            }
            catch (error) { obj.current_version = null }
        }

        // Iterate objects and compare with previous versions 
        // no checks for the time
        const failed_object_ids = []
        for (const obj of objects) {
            try {
                validateObject(obj)
            }   
            catch (excep) {
                console.log(excep.toString())
                failed_object_ids.push(obj.id)
                await contract.submitTransaction('updateStatusFailure', status_id)
            }
        }
      
        // Iterate objects and put the into the collection
        for (const obj of objects) {
            if (failed_object_ids.includes(obj.id)) continue
            delete obj.current_version
            try {
                await contract.submitTransaction('createOrUpdateObject', collection_id, JSON.stringify(obj), status_id)
            }
            catch(err) {
                console.log(err.toString())
                await contract.submitTransaction('updateStatusFailure', status_id)

            }
        }

        // Fetch status resource
        let status_resource = await contract.evaluateTransaction('queryStatusById', 'status-' + status_id);
        status_resource = JSON.parse(status_resource);
        delete status_resource.docType
        
        await gateway.disconnect();
        res.status(202).send(status_resource)
        return
    }
    catch (error) {
        console.log(error)
        res.status(400).send(error.toString())
    }
})

module.exports = router