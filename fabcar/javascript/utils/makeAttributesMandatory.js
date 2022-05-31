const fs = require('fs');
const path = require('path');




function makeAttributesMandatory(attrs) {
    let attr_reqs = [];      
    for (const index in attrs) {
        let req = {
            name: attrs[index]['name'],
            optional: false,
        };
        attr_reqs.push(req);
    }
    return attr_reqs

}

let x = makeAttributesMandatory()
console.log(x)

module.exports = makeAttributesMandatory
