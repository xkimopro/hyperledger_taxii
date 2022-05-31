/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const Bootstrap = require('./lib/bootstrap');
const Collection = require('./lib/collection');

module.exports.Bootstrap = Bootstrap;
module.exports.Collection = Collection;
module.exports.contracts = [ Bootstrap,  Collection ];
