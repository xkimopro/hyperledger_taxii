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

    async beforeTransaction(ctx) {
        let txnDetails = ctx.stub.getFunctionAndParameters();
        console.info(`Calling function: ${txnDetails} `);
        console.info(`MSPID: ${ctx.clientIdentity.getMSPID()}`)
    };

    async queryCollection(ctx, id) {
        const collectionAsBytes = await ctx.stub.getState(id); // get the car from chaincode state
        if (!collectionAsBytes || collectionAsBytes.length === 0) {
            throw new Error(`${id} does not exist`);
        }
        console.log(collectionAsBytes.toString());
        return collectionAsBytes.toString();
    }

    async queryAllCollectionObjects(ctx, collection_id) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const { key, value } of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            if (record.docType == 'collection' && record.collection_id == collection_id) {
                allResults.push({ Key: key, Record: record });
            }
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async queryAllCollections(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const { key, value } of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            if (record.docType == 'collection') {
                allResults.push({ Key: key, Record: record });
            }
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async createCollection(ctx, id, title, description, media_types) {
        console.info('============= START : Create Collection ===========');

        const collection = {
            id,
            title,
            description,
            media_types,
            docType: 'collection'
        };

        await ctx.stub.putState(id, Buffer.from(JSON.stringify(collection)));
        console.info('============= END : Create Collection ===========');
    }

    async processEnvelope(ctx, collection_id, envelope) {
        const objects = envelope.objects;
        for (const obj in objects) {
            await this.createCollection(ctx, collection_id, obj.id, obj)
        }
        return
    }

    async createOrUpdatePublicObject(ctx, collection_id, id, stix_json_str) {
        console.info('============= START : Creating Public Object ===========');
        let stix_json = JSON.parse(stix_json_str)
        stix_json.docType = 'object';
        stix_json.collection_id = collection_id;
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(stix_json)));
        console.info('============= END : Create Public Object ===========');
    }

    async readObjectHistory(ctx, id) {
        const promiseOfIterator = await ctx.stub.getHistoryForKey(id);
        const results = [];
        while (true) {
            let res = await promiseOfIterator.next();
            //In the loop you have to check if the iterator has values or if its done 
            if (res.value) {
                results.push(res)
            }
            if (res.done) {
                // close the iterator 
                await promiseOfIterator.close()
                // exit the loop
                return JSON.stringify(results);
            }
        }

    }


    async readAttribute(ctx) {
        // const stix_identity = ctx.clientIdentity.getAttributeValue('stix_identity')
        const stix_identity = ctx.clientIdentity.getMSPID()
        return JSON.stringify(stix_identity);
    }

    async readAllPrivateTaxiiCollections(ctx, collection) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const { key, value } of ctx.stub.getPrivateDataByRange(collection, startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            if (record.docType == 'collection') {
                allResults.push({ Key: key, Record: record });
            }
        }
        console.info(allResults);
        return JSON.stringify(allResults);

    }

    async readPrivateTaxiiCollection(ctx, id) {
        const collectionAsBytes = await ctx.stub.getPrivateData(id); // get the car from chaincode state
        if (!collectionAsBytes || collectionAsBytes.length === 0) {
            throw new Error(`${id} does not exist`);
        }
        console.log(collectionAsBytes.toString());
        return collectionAsBytes.toString();

    }

    async createPrivateDataCollectionObject(ctx, collection, id, title, description, media_types) {
        console.info('============= START : Create Collection ===========');

        const taxii_collection = {
            id,
            title,
            description,
            media_types,
            docType: 'collection'
        };

        await ctx.stub.putPrivateData(id, collection, Buffer.from(JSON.stringify(taxii_collection)));
        console.info('============= END : Create Collection ===========');
    }

    async QueryAssetsWithPagination(ctx, queryString, pageSize, bookmark) {

        const { iterator, metadata } = await ctx.stub.getQueryResultWithPagination(queryString, pageSize, bookmark);
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
}

module.exports = Collection;
