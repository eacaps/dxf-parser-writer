import JsonParser from './lib/dxf/json_parser';
import { readFileSync } from 'fs';
import { dxfJson } from './lib/dxf/dxf';

const args = process.argv.slice(2);
if (args.length < 1) {
    console.log('Usage: dxf_json_writer.js <dxf_json_file>');
    process.exit();
}

const fileName = args[0];

const fileString = readFileSync(fileName).toString();
const dxfJson = JSON.parse(fileString) as dxfJson;

const parser = new JsonParser();
const lines = parser.parseJson(dxfJson);

for (const line of lines) {
    console.log(line);
}