/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class Collection extends Contract {

    constructor() {
        // Unique smart contract name when multiple contracts per chaincode
        super('Collection');
    }

    async addInitialCollections(ctx) {
        console.info('============= START : Initialize Ledger with initial Collections ===========');
        const collections = [
            {
                id: "472c94ae-3113-4e3e-a4dd-a9f4ac7471d4",
                title: "This data collection is for testing querying across collections",
                can_read: true,
                can_write: false,
                media_types: [
                    "application/stix+json;version=2.1"
                ]
            },
            {
                id: "365fed99-08fa-fdcd-a1b3-fb247eb41d01",
                title: "This data collection is for testing querying across collections",
                can_read: true,
                can_write: true,
                media_types: [
                    "application/stix+json;version=2.1"
                ]
            },
            {
                id: "91a7b528-80eb-42ed-a74d-c6fbd5a26116",
                title: "High Value Indicator Collection",
                description: "This data collection is for collecting high value IOCs",
                can_read: true,
                can_write: true,
                media_types: [
                    "application/stix+json;version=2.0",
                    "application/stix+json;version=2.1"
                ]
            },
            {
                id: "52892447-4d7e-4f70-b94d-d7f22742ff63",
                title: "Indicators from the past 24-hours",
                description: "This data collection is for collecting current IOCs",
                can_read: true,
                can_write: false,
                media_types: [
                    "application/stix+json;version=2.1"
                ]
            },
            {
                id: "64993447-4d7e-4f70-b94d-d7f33742ee63",
                title: "Secret Indicators",
                description: "Non accessible",
                can_read: false,
                can_write: false,
                media_types: [
                    "application/stix+json;version=2.1"
                ]
            }
           
        ]

        for (let i = 0; i < collections.length; i++) {
            collections[i].docType = 'collection';
            await ctx.stub.putState( collections[i].id , Buffer.from(JSON.stringify(collections[i])));
            console.info('Added <--> ', collections[i]);
        }
        console.info('============= END : Initialize Ledger with initial Collections ===========');
        return 0;
    }

    async queryCollection(ctx, id) {
        const collectionAsBytes = await ctx.stub.getState(id); // get the car from chaincode state
        if (!collectionAsBytes || collectionAsBytes.length === 0) {
            throw new Error(`${id} does not exist`);
        }
        console.log(collectionAsBytes.toString());
        return collectionAsBytes.toString();
    }

    async queryAllCollections(ctx){
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
            if (record.docType == 'collection'){
                allResults.push({ Key: key, Record: record });
            }
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async createCollection(ctx, id, title, description, can_read, can_write, media_types) {
        console.info('============= START : Create Collection ===========');

        const collection = {
            id,
            title,
            description,
            can_read,
            can_write,
            media_types,
            docType: 'collection'
        };

        await ctx.stub.putState(id, Buffer.from(JSON.stringify(collection)));
        console.info('============= END : Create Collection ===========');
    }


    async readAttribute(ctx){
        const stix_identity = ctx.clientIdentity.getAttributeValue('stix_identity')
        return JSON.stringify(stix_identity);
    }

   

	async QueryAssetsWithPagination(ctx, queryString, pageSize, bookmark) {

		const {iterator, metadata} = await ctx.stub.getQueryResultWithPagination(queryString, pageSize, bookmark);
		const results = await this.GetAllResults(iterator, false);

	

		return JSON.stringify({
            results,
            metadata
        });
	}

    async GetAllResults(iterator, isHistory) {
		let allResults = [];
		let res = await iterator.next();
		while (!res.done) {
			if (res.value && res.value.value.toString()) {
				let jsonRes = {};
				console.log(res.value.value.toString('utf8'));
				if (isHistory && isHistory === true) {
					jsonRes.TxId = res.value.tx_id;
					jsonRes.Timestamp = res.value.timestamp;
					try {
						jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
					} catch (err) {
						console.log(err);
						jsonRes.Value = res.value.value.toString('utf8');
					}
				} else {
					jsonRes.Key = res.value.key;
					try {
						jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
					} catch (err) {
						console.log(err);
						jsonRes.Record = res.value.value.toString('utf8');
					}
				}
				allResults.push(jsonRes);
			}
			res = await iterator.next();
		}
		iterator.close();
		return allResults;
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

    // async getClientIdentityInfo(ctx) {
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
    
}

module.exports = Collection;
