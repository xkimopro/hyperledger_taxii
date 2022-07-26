/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');




class DataContract extends Contract {

    constructor() {
        // Unique smart contract name when multiple contracts per chaincode
        super('DataContract');
    }

    async initializeAPIRootInformation(ctx) {
        console.info('============= START : Adding API root information throught data contract ===========');
        const api_root_info = {
            "title": "Malware Research Group",
            "description": "A trust group setup for malware researchers",
            "versions": ["application/taxii+json;version=2.1"],
            "max_content_length": 104857600
        }
        await ctx.stub.putState('api_root_info', Buffer.from(JSON.stringify(api_root_info)));

        console.info('Added <--> ', api_root_info);
        console.info('============= END : Adding API root information throught data contract ===========');
        return 0;
    }

    async initializeCollections(ctx) {
        console.info('============= START : Adding initial Collections through Data Contract ===========');
        const collections = [
            {
                id: "472c94ae-3113-4e3e-a4dd-a9f4ac7471d4",
                title: "This data collection is for testing querying across collections",
                description: "This TAXII collection is made for testing the spec",
                media_types: [
                    "application/stix+json;version=2.1"
                ]
            },
            {
                id: "91a7b528-80eb-42ed-a74d-c6fbd5a26116",
                title: "High Value Indicator Collection",
                description: "This data collection is for collecting high value IOCs",
                media_types: [
                    "application/stix+json;version=2.1"
                ]
            },
            {
                id: "64993447-4d7e-4f70-b94d-d7f33742ee63",
                title: "Secret Indicators",
                description: "Non accessible",
                media_types: [
                    "application/stix+json;version=2.1"
                ]
            },
            {
                id: "82a7b528-80eb-42ed-a74d-c6fbd5a26155",
                title: "Public collection of IOCs for everyone",
                description: "This is a fully public data collection for every member of the channel. No configuration for public collections ",
                media_types: [
                    "application/stix+json;version=2.1"
                ]
            },
            {
                id: "75a7b528-10eb-42ed-b74e-c6fbe5a26143",
                title: "Second Public collection of IOCs for everyone",
                description: "This is a second public data collection for every member of the channel. No configuration for public collections ",
                media_types: [
                    "application/stix+json;version=2.1"
                ]
            }

        ]
        for (let i = 0; i < collections.length; i++) {
            collections[i].docType = 'collection';
            await ctx.stub.putState(collections[i].id, Buffer.from(JSON.stringify(collections[i])));
            console.info('Added <--> ', collections[i]);
        }

        console.info('============= END : Adding initial Collections through Data Contract ===========');
        return 0;
    }

    async initializeCollectionsConfig(ctx) {
        console.info('============= START : Adding initial collections_config through Data Contract ===========');
        const collections_config = [
            {
                "name": "472c94ae-3113-4e3e-a4dd-a9f4ac7471d4",
                "policy": "OR('Org1MSP.member', 'Org2MSP.member')",
                "requiredPeerCount": 1,
                "maxPeerCount": 1,
                "blockToLive": 1000000,
                "memberOnlyRead": true,
                "memberOnlyWrite": true
            },
            {
                "name": "91a7b528-80eb-42ed-a74d-c6fbd5a26116",
                "policy": "OR('Org1MSP.member')",
                "requiredPeerCount": 0,
                "maxPeerCount": 1,
                "blockToLive": 3,
                "memberOnlyRead": true,
                "memberOnlyWrite": true,
                "endorsementPolicy": {
                    "signaturePolicy": "OR('Org1MSP.member')"
                }
            },
            {
                "name": "64993447-4d7e-4f70-b94d-d7f33742ee63",
                "policy": "OR('Org2MSP.member')",
                "requiredPeerCount": 0,
                "maxPeerCount": 1,
                "blockToLive": 3,
                "memberOnlyRead": true,
                "memberOnlyWrite": true,
                "endorsementPolicy": {
                    "signaturePolicy": "OR('Org2MSP.member')"
                }
            }
        ]

        for (let i = 0; i < collections_config.length; i++) {
            collections_config[i].docType = 'collection_config';
            await ctx.stub.putState("config-" + collections_config[i].name, Buffer.from(JSON.stringify(collections_config[i])));
            console.info('Added <--> ', collections_config[i]);
        }
        console.info('============= END : Adding initial collections config through Data Contract ===========');

    }


    async initializeCollectionObjects(ctx) {
        console.info('============= START : Adding objects to collection through Data Contract ===========');


        // Collection 1
        console.info('============= Adding to collection 82a7b528-80eb-42ed-a74d-c6fbd5a26155 ===========');
        let public_data_1_collection_id = '82a7b528-80eb-42ed-a74d-c6fbd5a26155';
        let public_data_1 = [{
            "type": "indicator",
            "spec_version": "2.1",
            "id": "indicator--d81f86b9-975b-4c0b-875e-810c5ad45a4f",
            "created": "2014-06-29T13:49:37.079Z",
            "modified": "2014-06-29T13:49:37.079Z",
            "name": "Malicious site hosting downloader",
            "description": "This organized threat actor group operates to create profit from all types of crime.",
            "indicator_types": [
                "malicious-activity"
            ],
            "pattern": "[url:value = 'http://x4z9arb.cn/4712/']",
            "pattern_type": "stix",
            "valid_from": "2014-06-29T13:49:37.079Z"
        },
        {
            "type": "malware",
            "spec_version": "2.1",
            "id": "malware--162d917e-766f-4611-b5d6-652791454fca",
            "created": "2014-06-30T09:15:17.182Z",
            "modified": "2014-06-30T09:15:17.182Z",
            "name": "x4z9arb backdoor",
            "description": "This malware attempts to download remote files after establishing a foothold as a backdoor.",
            "malware_types": [
                "backdoor",
                "remote-access-trojan"
            ],
            "is_family": false,
            "kill_chain_phases": [
                {
                    "kill_chain_name": "mandiant-attack-lifecycle-model",
                    "phase_name": "establish-foothold"
                }
            ]
        },
        {
            "type": "relationship",
            "spec_version": "2.1",
            "id": "relationship--864af2ea-46f9-4d23-b3a2-1c2adf81c265",
            "created": "2020-02-29T18:03:58.029Z",
            "modified": "2020-02-29T18:03:58.029Z",
            "relationship_type": "indicates",
            "source_ref": "indicator--d81f86b9-975b-4c0b-875e-810c5ad45a4f",
            "target_ref": "malware--162d917e-766f-4611-b5d6-652791454fca"
        }
        ]

        for (let i = 0; i < public_data_1.length; i++) {
            public_data_1[i].docType = 'object';
            public_data_1[i].collection_id = public_data_1_collection_id;

            await ctx.stub.putState(public_data_1[i].id, Buffer.from(JSON.stringify(public_data_1[i])));
            console.info('Added <--> ', public_data_1[i][i]);
        }

        // Collection 2 ( Private Between Org1 and Org2 )
        console.info('============= Adding to collection 472c94ae-3113-4e3e-a4dd-a9f4ac7471d4 ===========');
        let private_data_2_collection_id = '472c94ae-3113-4e3e-a4dd-a9f4ac7471d4';
        let private_data_2 = [{
            "type": "incident",
            "spec_version": "2.1",
            "id": "incident--81f2211b-437b-46ff-971c-fccf4c67bafa",
            "created_by_ref": "identity--6fa2c060-a444-49aa-ab4f-263f661fed40",
            "created": "2022-04-19T19:47:51.141791Z",
            "modified": "2023-02-04T11:49:10.276155Z",
            "name": "later",
            "description": "Coach activity beyond music discussion.",
            "confidence": 1
        },
        {
            "type": "identity",
            "spec_version": "2.1",
            "id": "identity--6fa2c060-a444-49aa-ab4f-263f661fed40",
            "created": "2022-08-06T06:23:15.293046Z",
            "modified": "2022-08-24T04:15:01.131862Z",
            "name": "Mitchell-Miller",
            "roles": [
                "laugh",
                "stand",
                "form",
                "by",
                "sign"
            ],
            "identity_class": "class",
            "labels": [
                "analysis",
                "bank",
                "energy",
                "writer"
            ],
            "lang": "en",
            "external_references": [
                {
                    "source_name": "rate",
                    "description": "Yourself wall threat heart build get or.",
                    "url": "https://sanchez.com/",
                    "external_id": "cIyTOGQVZJCYkvgtduGx"
                },
                {
                    "source_name": "set",
                    "url": "http://www.yates-barber.com/",
                    "hashes": {
                        "MD5": "5cb80975883679a9dc4b3e5e3c83db25",
                        "SHA-1": "c6bb12843d98ae2ba015217aa2dbb32900ea3a57",
                        "SHA-256": "5727e88e9da4c47737123c1d112761724e7570afbe4aee8bbe9c4bb79e21d03e",
                        "SHA-512": "2b61bd299da635678fb1f12357b162f01fcce020256bc00b6e268ceca02a71963ee79d9e6176e27fc173a7c6fdb9cf2eeb6f91934909a3c9858245260ad07a2f",
                        "SHA3-256": "7992e25537376b703f4fcf68b66fc04d752cea30493204a259fe887da1ebfcbd",
                        "SHA3-512": "a5e5e0ef3f8974c3c627bb79ce975640769acff2be785a5b4cf14543b7b7f7d0c543d2065bd4a97b735b1b9e1b4b77f552bafa910c17d3a81cedeea1b39c64a7"
                    },
                    "external_id": "SPApXdVtHjOuDcXJdA"
                },
                {
                    "source_name": "forward",
                    "description": "Receive center future listen true blue.",
                    "url": "https://www.mendoza-bennett.com/"
                },
                {
                    "source_name": "theory",
                    "description": "Simply consider plan hundred whole person.",
                    "hashes": {
                        "MD5": "0e878637ad788e479abd46aea918f976",
                        "SHA-1": "c4d64af6fd383c20a1e37a73d827cd0a82761f66",
                        "SHA-256": "cef5b4867436ab64f07e3e883e1c76f608d2a6b62142e5363419e0abd22a4f08"
                    },
                    "external_id": "sijmsLtQWLCBdWMJpQT"
                }
            ]
        },
        {
            "type": "indicator",
            "spec_version": "2.1",
            "id": "indicator--9d33d346-3fab-4ad0-b07c-2b952710e68f",
            "created_by_ref": "identity--05adffc8-55ea-4f6c-b850-93417bd5bdca",
            "created": "2022-11-21T19:17:23.440224Z",
            "modified": "2022-12-20T07:18:57.830703Z",
            "name": "region",
            "pattern": "([domain-name:value = 'davis.org'] AND ([url:defanged NOT = false])) AND [software:vendor < 'Jackson, Porter and Green']",
            "pattern_type": "stix",
            "pattern_version": "2.1",
            "valid_from": "2021-11-12T21:09:06.898698Z",
            "valid_until": "2022-10-29T01:17:32.948857Z",
            "kill_chain_phases": [
                {
                    "kill_chain_name": "hmzyxoIUoahmXLSLo",
                    "phase_name": "nUVlUOzRpz"
                },
                {
                    "kill_chain_name": "lockheed-martin-cyber-kill-chain",
                    "phase_name": "reconnaissance"
                },
                {
                    "kill_chain_name": "QNJnVDdjpLhoGXqG",
                    "phase_name": "ITQEGkKDKomTc"
                },
                {
                    "kill_chain_name": "PZVaFYfxok",
                    "phase_name": "gsvKzfyh"
                },
                {
                    "kill_chain_name": "BRgps",
                    "phase_name": "iuwfjhZzGtXt"
                }
            ],
            "confidence": 76,
            "lang": "en",
            "external_references": [
                {
                    "source_name": "onto",
                    "description": "Really near college small account government threat.",
                    "url": "https://walker-lowe.org/",
                    "external_id": "euryJMVQKWy"
                },
                {
                    "source_name": "interesting",
                    "description": "Of possible me stand.",
                    "url": "https://www.martin-hamilton.com/",
                    "hashes": {
                        "MD5": "1559018e2ad3c1c8f12c73467f9218ce",
                        "SHA-512": "d528d239662126c348f21cd37dadb76eea8a14e6b6e21ad4303f39221c32932888a35c71700428f350f9eb9a8ee10f10a47affde7595fbefd67c0a5fa60bd902",
                        "SHA3-256": "b99ba13d72104b24fd38a7f9c04e6e432b4279997c3e831fbce44542b0f12525",
                        "SHA3-512": "2e05498d8c52902ec069c7c2f5dbd462aad95d7b7e8e228efe0e55cf4c80475297047e4b86094f8f60f0967415d2b0ba755e5ad3bc595d20cd49374e46bb3928"
                    },
                    "external_id": "uivCbbnZvzAsutveyCAI"
                },
                {
                    "source_name": "quite",
                    "url": "http://www.hardy.info/",
                    "hashes": {
                        "MD5": "afd572b2d3df14e1d6c192adf63b57f1",
                        "SHA-1": "31ad6be741b614e2fe17c1b4c30e7f24eb30cc47",
                        "SHA-256": "e29224fed66edecbe9b09a39216adc5e1b95442a98d31614eed096fb6101474f",
                        "SHA-512": "0a6902e89b31ed9d45e68e733f5c2cd0a3388f024321ec4b7b50da11753b6c68c95c5dded30d99b6e7467f47b9abbb5f6d6c278b79ff633d0a0ac1220f7a604e",
                        "SHA3-256": "1394a178ea40cfadfbbde20d68886c94fc802b8280d8fd9a060f0b3c222dc564",
                        "SHA3-512": "1959fbb5b1bc0de9441785b52600d74769ac732bcd89cf387dcd52f8b9ef3366fa51833584278f9a8971d21e8b675477186349ca5529e87f686d6ddc9e773a5d"
                    },
                    "external_id": "zGqjTzzVOY"
                },
                {
                    "source_name": "season",
                    "description": "Safe too painting reflect window machine maintain.",
                    "external_id": "biveQSvM"
                }
            ],
            "object_marking_refs": [
                "marking-definition--5e57c739-391a-4eb3-b6be-7d15ca92d5ed"
            ]
        },
        {
            "type": "relationship",
            "spec_version": "2.1",
            "id": "relationship--f8be9356-ed02-44fb-ab1a-1537b40c18d3",
            "created_by_ref": "identity--9d148371-b27c-4f71-aa7a-3de5f89b90a0",
            "created": "2021-12-26T08:14:33.636546Z",
            "modified": "2022-07-19T05:39:03.642066Z",
            "relationship_type": "related-to",
            "source_ref": "indicator--9d33d346-3fab-4ad0-b07c-2b952710e68f",
            "target_ref": "incident--81f2211b-437b-46ff-971c-fccf4c67bafa",
            "labels": [
                "line",
                "term",
                "into"
            ],
            "object_marking_refs": [
                "marking-definition--613f2e26-407d-48c7-9eca-b8e91df99dc9",
                "marking-definition--e539e3e3-6a5c-4397-b07a-dfb5b73b74eb",
                "marking-definition--34098fce-860f-48ae-8e50-ebd3cc5e41da"
            ]
        },
        {
            "type": "marking-definition",
            "spec_version": "2.1",
            "id": "marking-definition--613f2e26-407d-48c7-9eca-b8e91df99dc9",
            "created": "2017-01-20T00:00:00.000Z",
            "definition_type": "tlp",
            "name": "TLP:WHITE",
            "definition": {
                "tlp": "white"
            }
        },
        {
            "type": "marking-definition",
            "spec_version": "2.1",
            "id": "marking-definition--e539e3e3-6a5c-4397-b07a-dfb5b73b74eb",
            "created": "2023-06-26T13:43:10.596861Z",
            "definition_type": "statement",
            "definition": {
                "statement": "Country list stay another girl he. Society sometimes positive clearly plan."
            }
        },
        {
            "type": "marking-definition",
            "spec_version": "2.1",
            "id": "marking-definition--34098fce-860f-48ae-8e50-ebd3cc5e41da",
            "created": "2017-01-20T00:00:00.000Z",
            "definition_type": "tlp",
            "name": "TLP:GREEN",
            "definition": {
                "tlp": "green"
            }
        },
        {
            "type": "identity",
            "spec_version": "2.1",
            "id": "identity--9d148371-b27c-4f71-aa7a-3de5f89b90a0",
            "created": "2021-10-23T23:38:12.429078Z",
            "modified": "2022-06-12T09:05:15.981302Z",
            "name": "Garza PLC",
            "roles": [
                "away"
            ],
            "sectors": [
                "government",
                "transportation"
            ],
            "labels": [
                "class"
            ],
            "confidence": 89,
            "external_references": [
                {
                    "source_name": "health",
                    "description": "Police unit kind before.",
                    "hashes": {
                        "SHA-256": "5531f7027313df6536790c8fa298d73d36ecc515e4f197ce1375611af8fd2734",
                        "SHA-512": "725d1c2e1a9a9168c26ba2a9b8747f233dc44a2725cb43560f85786a8371e320a85d9eb82bfe5f2a1b4c7c3f3e326268317de79d5e1a2631f930394e07166ff9",
                        "SHA3-256": "c8d70f8733726b9df14518b9917a926318ed4670849090967f263442178138df",
                        "SHA3-512": "cfd59f1bad3d77f3d460805812bca693406b4866aa55dedfaff949c5712da0971c4e9b7aa56e26542f34ad7a4e09fb442062608c960494fe2990ab6767894cc1"
                    }
                }
            ]
        },
        {
            "type": "marking-definition",
            "spec_version": "2.1",
            "id": "marking-definition--5e57c739-391a-4eb3-b6be-7d15ca92d5ed",
            "created": "2017-01-20T00:00:00.000Z",
            "definition_type": "tlp",
            "name": "TLP:RED",
            "definition": {
                "tlp": "red"
            }
        },
        {
            "type": "identity",
            "spec_version": "2.1",
            "id": "identity--05adffc8-55ea-4f6c-b850-93417bd5bdca",
            "created": "2022-09-15T20:18:03.027603Z",
            "modified": "2023-04-02T11:07:11.043247Z",
            "name": "Jones and Sons",
            "roles": [
                "born"
            ],
            "sectors": [
                "insurance",
                "government",
                "automotive",
                "government-regional"
            ],
            "contact_information": "86361 Melody Terrace\nSouth Paulstad, UT 72338",
            "labels": [
                "fight",
                "month",
                "news",
                "or"
            ],
            "lang": "en"
        },
        {
            "type": "relationship",
            "spec_version": "2.1",
            "id": "relationship--bed96357-c3b2-40d3-9682-cca1406d0963",
            "created_by_ref": "identity--3060c6c7-8197-4746-8f1d-4413ec349723",
            "created": "2021-10-30T05:06:10.736298Z",
            "modified": "2022-04-24T15:09:36.455211Z",
            "relationship_type": "related-to",
            "source_ref": "identity--9d148371-b27c-4f71-aa7a-3de5f89b90a0",
            "target_ref": "incident--81f2211b-437b-46ff-971c-fccf4c67bafa",
            "start_time": "2023-02-18T03:59:39.476013Z",
            "stop_time": "2023-07-14T11:35:50.999551Z",
            "labels": [
                "clearly",
                "dog",
                "conference",
                "never"
            ],
            "confidence": 80,
            "lang": "en",
            "external_references": [
                {
                    "source_name": "Republican",
                    "description": "Chance seem stage former south analysis.",
                    "url": "https://king-jennings.com/",
                    "hashes": {
                        "SHA-1": "9e69101e39feca6d85ed7df8f6a70fdacb9152f5",
                        "SHA-256": "10f5aac29c56b74f1ee0dd26d0fdcc70e0596f89506b839443212c8ae039d0fc",
                        "SHA-512": "b5a3fb5232f560a5bf64c169473842a8b5023844399203cdfb3b00ce2e3a4cf4c4f3a25265a716f4e668efbdd24820e9bdd4967974f7191945d43f3163210ef5",
                        "SHA3-256": "09e75eacc6d56f7a617e5aebc4af6145b07906336531e3e23aefb8460a391b95",
                        "SHA3-512": "ef95dcbf8bb21fab52943a3d11704056f9ea600c2a48293835b8e7f418883434c6a64d5741b472302c6d7964cdb48973a1e93e9dab73d2019d7b8bd3abe12490"
                    },
                    "external_id": "EWMILwOzyvgeYlVa"
                },
                {
                    "source_name": "Democrat",
                    "description": "Himself also after little I help choice yes.",
                    "url": "https://davis.com/",
                    "hashes": {
                        "SHA-1": "5c456dedcf169c12277cab2903bd69c21e0965b2",
                        "SHA3-256": "dfde652353caae64f2cb3080d31ed84d113acdf75c7f939834e833f0665f892d",
                        "SHA3-512": "db1476a11e5177c9668de8288b43c73cacff7fcddbfb7ad60f902ce4d370519514a03237268d9c728a54bfc57dacdc067f74aee128ced11fce16e342792b7efb"
                    }
                },
                {
                    "source_name": "throughout",
                    "description": "Couple activity right today.",
                    "external_id": "XoUXdjiMr"
                }
            ],
            "object_marking_refs": [
                "marking-definition--34098fce-860f-48ae-8e50-ebd3cc5e41da",
                "marking-definition--613f2e26-407d-48c7-9eca-b8e91df99dc9"
            ]
        },
        {
            "type": "identity",
            "spec_version": "2.1",
            "id": "identity--3060c6c7-8197-4746-8f1d-4413ec349723",
            "created": "2021-05-22T07:29:11.944602Z",
            "modified": "2022-02-24T17:11:53.06974Z",
            "name": "Acosta, Barrett and Stephens",
            "description": "Multi-channeled static protocol",
            "identity_class": "class",
            "sectors": [
                "retail",
                "government-regional",
                "government-regional"
            ],
            "lang": "en"
        },
        {
            "type": "relationship",
            "spec_version": "2.1",
            "id": "relationship--8a3cf52d-340f-4628-b942-0259140cb893",
            "created": "2023-03-28T19:42:41.051901Z",
            "modified": "2023-06-12T04:50:32.002773Z",
            "relationship_type": "duplicate-of",
            "source_ref": "identity--6fa2c060-a444-49aa-ab4f-263f661fed40",
            "target_ref": "identity--3060c6c7-8197-4746-8f1d-4413ec349723",
            "stop_time": "2022-09-23T14:38:34.679192Z",
            "lang": "en",
            "external_references": [
                {
                    "source_name": "Mr",
                    "external_id": "dlAIdianvr"
                },
                {
                    "source_name": "or",
                    "hashes": {
                        "SHA-1": "7116225c5d5e8569b1b5d8c3fa3e401d00e98446",
                        "SHA-256": "8b3378a9fc01b5d302ed6aa73535eafd1b77b3b4da49cf3c5bfb62524b1e6906",
                        "SHA-512": "19a3fa812c545c6b5caa51ae657ba3b606425bd85a5dc53f4da4cf788fdbd967520abfdb31a732c0bb0fcdd4d8bc1b60972ff2e76aa436cd1c3d07c1bd739e5c",
                        "SHA3-512": "bb7995120d8a3201bece15fd900b0f8ce8691e01338752be98502c94364a35caaa745359f251784b36cefad1f4964c2a6f28ccf544ac3f98e7c663cb501fe3bc"
                    },
                    "external_id": "yVFnWjqcG"
                },
                {
                    "source_name": "hour",
                    "description": "Imagine must indeed law central want sing.",
                    "external_id": "wAYrpBMqHXOhHUPB"
                },
                {
                    "source_name": "large",
                    "description": "Mrs expert factor doctor.",
                    "url": "https://www.campbell.org/",
                    "external_id": "FjQnjWKi"
                },
                {
                    "source_name": "item",
                    "description": "Artist early include action cost.",
                    "url": "https://www.warren-martinez.com/"
                }
            ]
        },
        {
            "type": "attack-pattern",
            "spec_version": "2.1",
            "id": "attack-pattern--d32d4297-cd41-44b0-a143-9f53c71f969e",
            "created_by_ref": "identity--07c1a93b-9efa-447e-a1dd-12697fdca67a",
            "created": "2022-04-15T21:08:45.381678Z",
            "modified": "2022-11-08T16:16:49.990843Z",
            "name": "build",
            "description": "Help quickly measure discuss region.",
            "aliases": [
                "way"
            ],
            "kill_chain_phases": [
                {
                    "kill_chain_name": "jfJLpMQvjSRlG",
                    "phase_name": "oUZONzlMgN"
                },
                {
                    "kill_chain_name": "lockheed-martin-cyber-kill-chain",
                    "phase_name": "exploitation"
                },
                {
                    "kill_chain_name": "syLkVClhKNJTQplWtO",
                    "phase_name": "xYxtviQXsSJOfUce"
                },
                {
                    "kill_chain_name": "lockheed-martin-cyber-kill-chain",
                    "phase_name": "installation"
                }
            ],
            "confidence": 7
        },
        {
            "type": "relationship",
            "spec_version": "2.1",
            "id": "relationship--53ffbd14-54b1-4291-a670-e01cd327dcea",
            "created": "2022-09-17T11:34:08.551114Z",
            "modified": "2023-05-04T18:42:13.149655Z",
            "relationship_type": "targets",
            "description": "Idea Congress fear mention. Could your fear argue artist just word. Occur black factor that.",
            "source_ref": "attack-pattern--d32d4297-cd41-44b0-a143-9f53c71f969e",
            "target_ref": "identity--9d148371-b27c-4f71-aa7a-3de5f89b90a0",
            "start_time": "2021-09-05T08:00:41.423327Z",
            "labels": [
                "sometimes",
                "for",
                "theory",
                "sign"
            ],
            "external_references": [
                {
                    "source_name": "within",
                    "url": "https://brady.org/",
                    "hashes": {
                        "MD5": "8f6b7985759f9211a5d024b14bd5d717",
                        "SHA-1": "ef639eafdcb33981e156703983e6a04692beb7a2",
                        "SHA3-256": "87b5750d39b665b8e6afb102441973c8130ba57a9463e75384db7b31701591d8",
                        "SHA3-512": "d4d85da6a3d8f978174c1dff557faad5282e28f6351b8b035f7e6ed234a7059e343c6280e38d322a97dc688bdde93785a71a46052a4d913c67aba80ad2b39dbd"
                    }
                },
                {
                    "source_name": "worker",
                    "description": "Should late any else see.",
                    "url": "http://gutierrez.info/"
                }
            ],
            "object_marking_refs": [
                "marking-definition--0f97b514-ddb1-4a13-aa07-297a79936594",
                "marking-definition--44ba8462-6d02-4309-a89d-b0dc9f6bbd5f"
            ]
        },
        {
            "type": "marking-definition",
            "spec_version": "2.1",
            "id": "marking-definition--0f97b514-ddb1-4a13-aa07-297a79936594",
            "created": "2022-12-27T17:05:54.214899Z",
            "definition_type": "statement",
            "definition": {
                "statement": "Pretty already soldier common near in. Foot play friend sport government ground recent defense. About represent room have throughout somebody day."
            }
        },
        {
            "type": "marking-definition",
            "spec_version": "2.1",
            "id": "marking-definition--44ba8462-6d02-4309-a89d-b0dc9f6bbd5f",
            "created": "2022-05-30T01:42:40.969553Z",
            "definition_type": "statement",
            "name": "throughout",
            "definition": {
                "statement": "None soon institution book read. Both tell left. Group under way image why back stay."
            }
        },
        {
            "type": "identity",
            "spec_version": "2.1",
            "id": "identity--07c1a93b-9efa-447e-a1dd-12697fdca67a",
            "created": "2022-03-10T16:10:50.382011Z",
            "modified": "2022-04-01T15:31:58.801586Z",
            "name": "Collins PLC",
            "labels": [
                "coach",
                "move",
                "only"
            ]
        },
        {
            "type": "relationship",
            "spec_version": "2.1",
            "id": "relationship--521b2089-5e4e-4bd9-91d4-310513e74494",
            "created": "2022-06-21T07:09:25.386934Z",
            "modified": "2023-01-23T05:53:41.345107Z",
            "relationship_type": "targets",
            "description": "Write hit ever face. End model apply become group similar.",
            "source_ref": "attack-pattern--d32d4297-cd41-44b0-a143-9f53c71f969e",
            "target_ref": "identity--6fa2c060-a444-49aa-ab4f-263f661fed40",
            "start_time": "2023-03-07T21:44:27.483897Z",
            "confidence": 77,
            "lang": "en",
            "external_references": [
                {
                    "source_name": "born",
                    "external_id": "lCndL"
                },
                {
                    "source_name": "trouble",
                    "description": "Month he page career such might other.",
                    "url": "https://www.perez.com/"
                }
            ]
        }
        ]

        for (let i = 0; i < public_data_2.length; i++) {
            public_data_2[i].docType = 'object';
            public_data_2[i].collection_id = public_data_2_collection_id;

            await ctx.stub.putState(public_data_2[i].id, Buffer.from(JSON.stringify(public_data_2[i])));
            console.info('Added <--> ', public_data_2[i][i]);
        }

        // Collection 3 ( Private for Org2 only )
        console.info('============= Adding to collection 64993447-4d7e-4f70-b94d-d7f33742ee63 ===========');
        let private_data_3_collection_id = '64993447-4d7e-4f70-b94d-d7f33742ee63';
        let private_data_3 = [
            
            {
                "type": "malware",
                "spec_version": "2.1",
                "id": "malware--fdd60b30-b67c-41e3-b0b9-f01faf20d111",
                "created": "2014-02-20T09:16:08.989Z",
                "modified": "2014-02-20T09:16:08.989Z",
                "name": "Poison Ivy",
                "malware_types": [
                    "remote-access-trojan"
                ],
                "is_family": false
            },
            {
                "type": "malware",
                "id": "malware--efd5ac80-79ba-45cc-9293-01460ad85303",
                "created": "2017-07-18T22:00:30.405Z",
                "modified": "2017-07-18T22:00:30.405Z",
                "name": "IMDDOS",
                "labels": [
                  "bot",
                  "ddos"
                ],
                "description": "Once infected with this malware, a host becomes part of the IMDDOS Botnet",
                "kill_chain_phases": [
                  {
                    "kill_chain_name": "lockheed-martin-cyber-kill-chain",
                    "phase_name": "exploit"
                  }
                ]
              }
              ,
            {
                "type": "malware",
                "id": "malware--feda5c80-79ba-45cc-9293-01460ad85404",
                "created": "2017-07-18T22:00:30.405Z",
                "modified": "2017-07-18T22:00:30.405Z",
                "name": "Fake malware",
                "labels": [
                  "bot",
                  "ddos"
                ],
                "description": "Once infected with this malware, a host becomes part of the SODMIS Botnet",
                "kill_chain_phases": [
                  {
                    "kill_chain_name": "lockheed-martin-cyber-kill-chain",
                    "phase_name": "exploit"
                  }
                ]
              }
              ,
              {
                "type": "malware",
                "spec_version": "2.1",
                "is_family": true,
                "id": "malware--17099f03-5ec8-456d-a2de-968aebaafc78",
                "created": "2015-05-15T09:12:16.432Z",
                "modified": "2015-05-15T09:12:16.432Z",
                "name": "PIVY Variant (b1deff736b6d12b8d98b485e20d318ea)",
                "description": "The sample b1deff736b6d12b8d98b485e20d318ea connected to autuo.xicp.net with the password keaidestone.",
                "malware_types": [
                  "remote-access-trojan"
                ]
              },
              {
                "type": "malware",
                "spec_version": "2.1",
                "is_family": false,
                "id": "malware--2485b844-4efe-4343-84c8-eb33312dd56f",
                "created": "2015-05-15T09:12:16.432Z",
                "modified": "2015-05-15T09:12:16.432Z",
                "name": "MANITSME",
                "malware_types": [
                  "backdoor",
                  "dropper",
                  "remote-access-trojan"
                ],
                "description": "This malware will beacon out at random intervals to the remote attacker. The attacker can run programs, execute arbitrary commands, and easily upload and download files."
              },
              {
                "type": "malware",
                "spec_version": "2.1",
                "is_family": false,
                "id": "malware--c0217091-9d3d-42a1-8952-ccc12d4ad8d0",
                "created": "2015-05-15T09:12:16.432Z",
                "modified": "2015-05-15T09:12:16.432Z",
                "name": "WEBC2-UGX",
                "malware_types": [
                  "backdoor",
                  "remote-access-trojan"
                ],
                "description": "A WEBC2 backdoor is designed to retrieve a Web page from a C2 server. It expects the page to contain special HTML tags; the backdoor will attempt to interpret the data between the tags as commands."
              }
        ]

        for (let i = 0; i < public_data_3.length; i++) {
            public_data_3[i].docType = 'object';
            public_data_3[i].collection_id = public_data_3_collection_id;

            await ctx.stub.putState(public_data_3[i].id, Buffer.from(JSON.stringify(public_data_3[i])));
            console.info('Added <--> ', public_data_3[i][i]);
        }

        console.info('============= END : Adding objects to collection through Data Contract ===========');

    }






}

module.exports = DataContract;
