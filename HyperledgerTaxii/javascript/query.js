/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');


async function main() {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org3.example.com', 'connection-org3.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

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
        await gateway.connect(ccp, { identity, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('HyperledgerTaxii', 'Collection');
        // const contract = network.getContract('HyperledgerTaxii');

        // Evaluate the specified transaction.
        // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
        // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
        // const result = await contract.evaluateTransaction('queryAllObjects');
        const result = await contract.evaluateTransaction('readObjectHistory', "attack-pattern--274186af-f5c7-4258-a7ca-41845eaaa263");

        // Rich Query with Pagination (Only supported if CouchDB is used as state database)
        // const result = await contract.evaluateTransaction('QueryAssetsWithPagination', '{"selector":{"docType":"collection"} }', 2, '');
        // console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        // const result = await contract.evaluateTransaction('readAllPrivateTaxiiCollections', "472c94ae-3113-4e3e-a4dd-a9f4ac7471d4");
    
        
        // console.log(result)
        let x = result.toString();
        console.log(JSON.stringify(JSON.parse(x),null,4));

        // Disconnect from the gateway.
        await gateway.disconnect();
        
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}

main();
