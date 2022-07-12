const fs = require('fs');
const path = require('path');


module.exports = {
    makeAttributesMandatory: function makeAttributesMandatory(attrs) {
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
    ,
    otherMethod: function test() {
        console.log("test")
    },
};
