/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');




class DataContract extends Contract {

    constructor() {
        // Unique smart contract name when multiple contracts per chaincode
        super('DataContract');
    }

    async initializeAPIRootInformation(ctx) {
        console.info('============= START : Adding API root information throught data contract ===========');
        const api_root_info = {
            "title": "Malware Research Group",
            "description": "A trust group setup for malware researchers",
            "versions": ["application/taxii+json;version=2.1"],
            "max_content_length": 104857600
        }
        await ctx.stub.putState('api_root_info', Buffer.from(JSON.stringify(api_root_info)));

        console.info('Added <--> ', api_root_info);
        console.info('============= END : Adding API root information throught data contract ===========');
        return 0;
    }

    async initializeCollections(ctx) {
        console.info('============= START : Adding initial Collections through Data Contract ===========');
        const collections = [
            {
                id: "472c94ae-3113-4e3e-a4dd-a9f4ac7471d4",
                title: "This data collection is for testing querying across collections",
                media_types: [
                    "application/stix+json;version=2.1"
                ]
            },
            {
                id: "91a7b528-80eb-42ed-a74d-c6fbd5a26116",
                title: "High Value Indicator Collection",
                description: "This data collection is for collecting high value IOCs",
                media_types: [
                    "application/stix+json;version=2.1"
                ]
            },
            {
                id: "64993447-4d7e-4f70-b94d-d7f33742ee63",
                title: "Secret Indicators",
                description: "Non accessible",
                media_types: [
                    "application/stix+json;version=2.1"
                ]
            }

        ]
        for (let i = 0; i < collections.length; i++) {
            collections[i].docType = 'collection';
            await ctx.stub.putState(collections[i].id, Buffer.from(JSON.stringify(collections[i])));
            console.info('Added <--> ', collections[i]);
        }

        console.info('============= END : Adding initial Collections through Data Contract ===========');
        return 0;
    }

    async initializeCollectionsConfig(ctx) {
        console.info('============= START : Adding initial collections_config through Data Contract ===========');
        const collections_config = [
            {
                "name": "472c94ae-3113-4e3e-a4dd-a9f4ac7471d4",
                "policy": "OR('Org1MSP.member', 'Org2MSP.member')",
                "requiredPeerCount": 1,
                "maxPeerCount": 1,
                "blockToLive": 1000000,
                "memberOnlyRead": true,
                "memberOnlyWrite": true
            },
            {
                "name": "91a7b528-80eb-42ed-a74d-c6fbd5a26116",
                "policy": "OR('Org1MSP.member')",
                "requiredPeerCount": 0,
                "maxPeerCount": 1,
                "blockToLive": 3,
                "memberOnlyRead": true,
                "memberOnlyWrite": true,
                "endorsementPolicy": {
                    "signaturePolicy": "OR('Org1MSP.member')"
                }
            },
            {
                "name": "64993447-4d7e-4f70-b94d-d7f33742ee63",
                "policy": "OR('Org2MSP.member')",
                "requiredPeerCount": 0,
                "maxPeerCount": 1,
                "blockToLive": 3,
                "memberOnlyRead": true,
                "memberOnlyWrite": true,
                "endorsementPolicy": {
                    "signaturePolicy": "OR('Org2MSP.member')"
                }
            }
        ]

        for (let i = 0; i < collections_config.length; i++) {
            collections_config[i].docType = 'collection_config';
            await ctx.stub.putState("config-" + collections_config[i].name, Buffer.from(JSON.stringify(collections_config[i])));
            console.info('Added <--> ', collections_config[i]);
        }
        console.info('============= END : Adding initial collections config through Data Contract ===========');

    }


}

module.exports = DataContract;
