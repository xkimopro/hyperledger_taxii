const fs = require('fs');
const path = require('path');




function readIdentity(org = 1) {
    const stix_identity = fs.readFileSync(path.join(process.cwd(), `initial_data/stix_identities/stix_identity_org${org}.json`), 'utf8')
    let registerAttrs = [];
    
    let registerAttribute = {
        name: "stix_identity",
        value: stix_identity,
        ecert: true,
    };
    registerAttrs.push(registerAttribute);
    return registerAttrs

}

module.exports = readIdentity
