/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');




class HTTPContract extends Contract {

    constructor() {
        // Unique smart contract name when multiple contracts per chaincode
        super('HTTPContract');
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

}

module.exports = HTTPContract;
