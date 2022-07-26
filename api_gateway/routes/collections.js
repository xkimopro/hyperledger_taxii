const express = require('express')
    , router = express.Router({ mergeParams: true });

const { Gateway } = require('fabric-network')
const { fabricAuthentication } = require('../utils/auth')
const ErrorResource = require('../utils/error')
const { createConnections, findCollectionConfig, findOrgFromCCP } = require('../utils/functions')

const objects = require('./objects')


router.use(fabricAuthentication)

router.get('/', async (req, res) => {

    try {
        // Create Gateway and Network Connections
        const [gateway, network] = await createConnections(req);

        // Get the collection contract to fetch collections .
        const collection_contract = network.getContract('HyperledgerTaxii', 'Collection');
        const collections_res = await collection_contract.evaluateTransaction('queryAllCollections');
        const collections = JSON.parse(collections_res.toString())

        // Get the bootstrap contract to fetch configs .
        const bootstrap_contract = network.getContract('HyperledgerTaxii', 'Bootstrap');
        const collections_config_res = await bootstrap_contract.evaluateTransaction('queryByDocType', 'collection_config');
        const collections_config = JSON.parse(collections_config_res)

        // Construct TAXII formatted collections
        let final = []
        for (const collection of collections) {
            let record = collection['Record']
            delete record['docType']
            const collection_config = findCollectionConfig(collections_config, record['id'])
            // If collection is public ( meaning it doesnt have a configuration entry in collections_config.json )
            if (collection_config == null) {
                record['can_read'] = true
                record['can_write'] = true
            }
            // If collection is private data collection
            else {
                const policy = collection_config['policy']
                const RegExp = /'(.*?)'/g
                const or_policy_list = policy.match(RegExp)
                record['can_read'] = !collection_config['memberOnlyRead']
                record['can_write'] = !collection_config['memberOnlyRead']
                // Check if organization is member of policy list
                for (const member of or_policy_list) {
                    const org = member.slice(1, -1).replace('.member', '')
                    const my_org = findOrgFromCCP(req.reserved_properties.ccp)
                    if (org == my_org) {
                        record['can_read'] = true
                        record['can_write'] = true
                    }
                }
            }
            final.push(record)
        }

        // Disconnect from the gateway.
        await gateway.disconnect();
        res.send({ 'collections': final })
    }
    catch (error) {
        console.log(error)
        res.status(400).send(error.toString())
    }
})

router.get('/:collection_id', async (req, res) => {

    try {
        // Create Gateway and Network Connections
        const [gateway, network] = await createConnections(req);

        const collection_id = req.params.collection_id;
        // Get the collection contract to fetch collections .
        const collection_contract = network.getContract('HyperledgerTaxii', 'Collection');
        const collections_res = await collection_contract.evaluateTransaction('queryCollection', collection_id);
        const collection = JSON.parse(collections_res.toString())

        // Get the bootstrap contract to fetch configs .
        const bootstrap_contract = network.getContract('HyperledgerTaxii', 'Bootstrap');
        const collections_config_res = await bootstrap_contract.evaluateTransaction('queryByDocType', 'collection_config');
        const collections_config = JSON.parse(collections_config_res)
        delete collection['docType']
        const collection_config = findCollectionConfig(collections_config, collection['id'])
        // If collection is public ( meaning it doesnt have a configuration entry in collections_config.json )
        if (collection_config == null) {
            collection['can_read'] = true
            collection['can_write'] = true
        }
        // If collection is private data collection
        else {
            const policy = collection_config['policy']
            const RegExp = /'(.*?)'/g
            const or_policy_list = policy.match(RegExp)
            collection['can_read'] = !collection_config['memberOnlyRead']
            collection['can_write'] = !collection_config['memberOnlyRead']
            // Check if organization is member of policy list
            for (const member of or_policy_list) {
                const org = member.slice(1, -1).replace('.member', '')
                const my_org = findOrgFromCCP(req.reserved_properties.ccp)
                if (org == my_org) {
                    collection['can_read'] = true
                    collection['can_write'] = true
                }
            }
        }
        // Disconnect from the gateway.
        await gateway.disconnect();
        res.send(collection)
    }
    catch (error) {
        const msg = error.toString()
        if (msg.includes('does not exist')){
            const description = 'The API Root is not found, or the client does not have access to the resource'
            res.status(404).send(ErrorResource.notFound(req.reserved_properties.request_uuid, description ))
            return;
        }
        console.log(error)
        res.status(400).send(error.toString())
    }
})

router.use('/:collection_id/objects', objects)




module.exports = router;
