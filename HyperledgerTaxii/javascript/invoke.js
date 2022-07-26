/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUser');
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('HyperledgerTaxii', 'Collection');        
        // const collection = {
        //     id  : '984fed88-08fa-fdca-b1b1-fb247eb41g54',
        //     title : 'The Testing Collection One',
        //     description : 'A testing collection for testing purposes',
        //     media_types: [
        //         "application/stix+json;version=2.0",
        //         "application/stix+json;version=2.1"
        //     ]
        // };
        const obj = {
            "type": "attack-pattern",
            "spec_version": "2.1",
            "id": "attack-pattern--274186af-f5c7-4258-a7ca-41845eaaa263",
            "created": "2021-08-03T13:46:43.858771Z",
            "modified": "2022-04-19T13:38:52.06482Z",
            "name": "daughter",
            "confidence": 18,
            "lang": "gr",
            "external_references": [
                {
                    "source_name": "short",
                    "description": "Not Certainly right network while color mind.",
                    "external_id": "VoGcUG"
                }
            ]
        }
        // await contract.submitTransaction('createPrivateTaxiiObjectInsideCollection' ,id, "sharedOrg1Org2Collection", title, description, can_read, can_write, media_types);
        await contract.submitTransaction('createOrUpdatePublicObject' ,'82a7b528-80eb-42ed-a74d-c6fbd5a26155' , obj.id , JSON.stringify(obj));
        
        // console.log('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();
