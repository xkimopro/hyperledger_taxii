/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

const Collection = require('./collection');
const DataContract = require('./data_contract.js')





class Bootstrap extends Contract {

    async initLedger(ctx) {
        // Import initial Data through Data Contract
        const data_contract = new DataContract();
        await data_contract.initializeAPIRootInformation(ctx);
        await data_contract.initializeCollections(ctx);
        await data_contract.initializeCollectionsConfig(ctx);
        return 0;
    }

    async queryAllObjects(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

}

module.exports = Bootstrap;
