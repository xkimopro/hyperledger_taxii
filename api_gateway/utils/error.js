'use strict';


module.exports = class ErrorResource {
    constructor(org = 1) {
        this.org = org;
        this.peer_org_path = path.resolve(__dirname, '..','..', 'test-network', 'organizations', 'peerOrganizations', `org${this.org}.example.com`);
        this.cc_config_path = path.resolve(__dirname, '..', '..', 'chaincode', 'HyperledgerTaxii', 'javascript', 'config')
    }

    fetchCCP() {
        const ccp_path = path.resolve(this.peer_org_path, `connection-org${this.org}.json`);
        const ccp = JSON.parse(fs.readFileSync(ccp_path, 'utf8'));
        return ccp
    }

    fetchDiscoveryInformation() {
        const discovery_information_path = path.resolve(this.cc_config_path, 'discovery_information.json');
        const discovery_information = require(discovery_information_path)
        return discovery_information
    }
    fetchMappings() {
        const mappings_path = path.resolve(this.cc_config_path, 'mappings.json');
        const mappings = require(mappings_path)
        return mappings
    }

}