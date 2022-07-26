const express = require('express') 
  , router = express.Router();


const FabricCAServices = require('fabric-ca-client');
const {  Wallets } = require('fabric-network');
const staticFileReader = require('../utils/staticFileReader');
const  { makeAttributesMandatory } = require('../utils/functions');
const { getCouchDBUrl } = require('../utils/auth')



const couchdb_url = getCouchDBUrl()

router.post('/enroll_admin', async (req, res) => {
    try {
      const ccp = req.reserved_properties.ccp
      // Fetch parameters from JSON body and from common connection profile
      const org_id = ccp.client.organization.replace('Org', '')
      const enrollmentID = req.body.enrollmentID
      const enrollmentSecret = req.body.enrollmentSecret
      const organization = `Org${org_id}`
  
      // Create a new CA client for interacting with the CA.
      const ca_info = ccp.certificateAuthorities[`ca.org${org_id}.example.com`];
      const msp_id = ccp.organizations[organization].mspid
      const ca_tls_ca_certs = ca_info.tlsCACerts.pem;
      const ca = new FabricCAServices(ca_info.url, { trustedRoots: ca_tls_ca_certs, verify: false }, ca_info.caName);
      const enrollment = await ca.enroll({ enrollmentID, enrollmentSecret });
  
      // Constructr the x509 identity as a JSON object 
      const x509Identity = {
        credentials: {
          certificate: enrollment.certificate,
          privateKey: enrollment.key.toBytes(),
        },
        mspId: msp_id,
        type: 'X.509'
      };

      // Send Admin Identity
      res.send({
        'x509Identity': x509Identity
      })
  
    } catch (error) {
      const error_str = error.toString()
      console.error(error)
      res.status(400).send({
        "error": error_str
      })
    }
  
  })
  
  
  router.post('/register_user/', async (req, res) => {
    try {
      
      const ccp = req.reserved_properties.ccp;
      const mappings = req.reserved_properties.mappings;

      // Fetch parameters from JSON body and from common connection profile
      const enrollment_id = req.body.enrollment_id
      const admin_identity = req.body.admin_identity
      const org_id = ccp.client.organization.replace('Org', '')
      const organization = `Org${org_id}`
  
      // Create a new CA client for interacting with the CA.
      const ca_info = ccp.certificateAuthorities[`ca.org${org_id}.example.com`];
      const ca = new FabricCAServices(ca_info.url);
      const msp_id = ccp.organizations[organization].mspid
      
  
      // Add the organizations stix identity as an attribute to the Hyperledger User Identity
      const stix_identity = mappings.organizations_to_stix_identities[organization]
      let register_attrs = [];
      const register_attribute = {
        name: "stix_identity",
        value: stix_identity.toString(),
        ecert: true,
      };
      register_attrs.push(register_attribute);
  
      // Construct New CouchDB wallet
      const wallet = await Wallets.newCouchDBWallet(couchdb_url)
  
      // Check if user is already in the wallet
      for (const label of await wallet.list()){
        const username_password = Buffer.from(label, 'base64').toString('ascii')
        const username = username_password.split(':')[0]
        if (username == enrollment_id){
          res.status(200).send({ "error" : "User already registered"});
          return;
        }
      }
      
      // Build a user object for authenticating with the CA    
      const provider = wallet.getProviderRegistry().getProvider(admin_identity.type);
      const admin_user = await provider.getUserContext(admin_identity, 'admin');
      
      const mandatory_identity_attr = makeAttributesMandatory(register_attrs)
      
      // // Register the user, enroll the user, and import the new identity into the wallet.
      const secret = await ca.register({
        // affiliation: 'org1.department1',
        enrollmentID: enrollment_id,
        role: 'client',
        attrs: register_attrs
      }, admin_user);
  
      

      const enrollment = await ca.enroll({
        enrollmentID: enrollment_id,
        enrollmentSecret: secret,
        attr_reqs: mandatory_identity_attr
      });
  
      const x509Identity = {
        credentials: {
          certificate: enrollment.certificate,
          privateKey: enrollment.key.toBytes(),
        },
        mspId: msp_id,
        type: 'X.509',
      };
  
      const key = Buffer.from(`${enrollment_id}:${secret}`).toString('base64')
      await wallet.put(key, x509Identity)
      res.send({
        enrollment_id : enrollment_id,
        enrollment_secret : secret
      })
    }
    catch (error) {
      res.status(401).send({
        'error': error.toString()
      })
    }
  })


module.exports = router;
