const path = require('path');
const { Gateway } = require('fabric-network');
const moment = require('moment')

module.exports = {

    makeAttributesMandatory: function makeAttributesMandatory(attrs) {
        let attr_reqs = [];
        for (const index in attrs) {
            let req = {
                name: attrs[index]['name'],
                optional: false,
            };
            attr_reqs.push(req);
        }
        return attr_reqs

    }
    ,
    otherMethod: function test() {
        console.log("test")
    },
    createConnections: async function createConnections(req) {
        try {
            const user_certificate = req.reserved_properties.user_certificate
            const ccp = req.reserved_properties.ccp
            const mappings = req.reserved_properties.mappings
            const api_root = req.params.api_root
            const api_root_channel = mappings['api_root_to_channels'][api_root]
            const gateway = new Gateway();
            await gateway.connect(ccp, { identity: user_certificate, discovery: { enabled: true, asLocalhost: true } });
            const network = await gateway.getNetwork(api_root_channel);
            return [gateway, network];
        }
        catch (error) {
            throw error
        }
    },

    findCollectionConfig: function findCollectionConfig(configs, collection_id) {
        for (let config of configs) {
            let record = config['Record']
            if (record['name'] == collection_id) return record
        }
        return null;
    },
    findOrgFromCCP: function findOrgFromCCP(ccp) {
        let client = ccp['client']['organization']
        let org_msp = ccp['organizations'][client]['mspid']
        return org_msp
    },

    validateObject: function validateObject(obj) {

        // Check for common properties
        let common_properties = ['type', 'spec_version', 'id', 'created', 'modified']
        for (const common_property of common_properties) {
            if (obj[common_property] == undefined) {
                throw new Error(`Common property ${common_property} missing from object. Insertion fails`);
            }
        }
        // Check for TAXII spec version
        if (obj.spec_version != '2.1')
            throw new Error(`This TAXII server only supports STIX 2.1`)


        // Parse and perform date checks
        let created = new Date(obj.created);
        let modified = new Date(obj.modified);
 

        if (!moment(created, moment.ISO_8601).isValid() || !moment(created, moment.ISO_8601).isValid())
            throw new Error('Invalid date formats')
        
        if (created > modified)
            throw new Error('Created after modified')
        
        if (obj.current_version && ( obj.current_version.created != obj.created || new Date(obj.current_version.modified) >= modified ) )
            throw new Error('Problem with timesstamps')
    },


};
