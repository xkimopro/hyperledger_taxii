const express = require('express')
    , router = express.Router({mergeParams: true});


// API Root Information
router.get('/', async (req, res) => {

//   try {
    const api_root = req.params.api_root

    res.send(api_root);
    return;
//     const user_identity = JSON.parse(Buffer.from(req.headers.user_identity, 'base64').toString());
//     console.log(user_identity)
//     const gateway = new Gateway();
//     await gateway.connect(ccp, { identity: user_identity, discovery: { enabled: true, asLocalhost: true } });

//     // Get the network (channel) our contract is deployed to.
//     const network = await gateway.getNetwork('mychannel');

//     // Get the contract from the network.
//     const contract = network.getContract('HyperledgerTaxii', 'Collection');
//     const collections = await contract.evaluateTransaction('queryAllCollections');

//     // Disconnect from the gateway.
//     await gateway.disconnect();

//     res.send(JSON.parse(collections.toString(), null, 4))

//   }
//   catch (error) {
//     console.log(error)
//     res.status(400).send(error.toString())
//   }
})

module.exports = router;
