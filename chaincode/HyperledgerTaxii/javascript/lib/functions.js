const fs = require('fs');
const path = require('path');


export function readFromInitialData(json_filename) {
    const json_obj = fs.readFileSync(path.join(process.cwd(), `initial_data/${json_filename}.json`), 'utf8')
    return JSON.parse(json_obj)
}

