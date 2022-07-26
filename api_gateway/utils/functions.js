const fs = require('fs');
const path = require('path');
const { Gateway } = require('fabric-network')
const express = require('express');
const { nextTick } = require('process');


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

    
};
