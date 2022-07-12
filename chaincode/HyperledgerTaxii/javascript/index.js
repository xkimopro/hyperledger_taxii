/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const Bootstrap = require('./lib/bootstrap');
const Collection = require('./lib/collection');
const DataContract = require('./lib/data_contract');
const HTTPContract = require('./lib/http');


module.exports.Bootstrap = Bootstrap;
module.exports.Collection = Collection;
module.exports.DataContract = DataContract;
module.exports.HTTPContract = HTTPContract;

module.exports.contracts = [ Bootstrap,  Collection, DataContract, HTTPContract ];
