/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

const Collection = require('./collection');


class Bootstrap extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const discovery = {
            title: "Hyperledger Fabric TAXII Server",
            description: "This Hyperledger Fabric channel implements a TAXII Threat Intelligence Ledger based on Hyperledger Fabric Transactions instead of HTTP calls",
            contact: "hlftaxii@taxii.com",
            default: "(There is no HTTP Endpoint to address)",
            api_roots: [],
            docType: 'discovery'
        }

        await ctx.stub.putState( 'discovery_Hyperledger Fabric TAXII Server', Buffer.from(JSON.stringify(discovery)));
        console.info('Added <--> ', discovery);
        console.info('============= END : Initialize Ledger ===========');


        // Initialize Other Contracts
        const collection = new Collection();
        
        const res = await collection.addInitialCollections(ctx);

    }

    // async queryCar(ctx, carNumber) {
    //     const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
    //     if (!carAsBytes || carAsBytes.length === 0) {
    //         throw new Error(`${carNumber} does not exist`);
    //     }
    //     console.log(carAsBytes.toString());
    //     return carAsBytes.toString();
    // }

    // async createCar(ctx, carNumber, make, model, color, owner) {
    //     console.info('============= START : Create Car ===========');

    //     const car = {
    //         color,
    //         docType: 'car',
    //         make,
    //         model,
    //         owner,
    //     };

    //     await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
    //     console.info('============= END : Create Car ===========');
    // }

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

    // async changeCarOwner(ctx, carNumber, newOwner) {
    //     console.info('============= START : changeCarOwner ===========');

    //     const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
    //     if (!carAsBytes || carAsBytes.length === 0) {
    //         throw new Error(`${carNumber} does not exist`);
    //     }
    //     const car = JSON.parse(carAsBytes.toString());
    //     car.owner = newOwner;

    //     await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
    //     console.info('============= END : changeCarOwner ===========');
    // }

}

module.exports = Bootstrap
;
