import JsonParser from './lib/dxf/json_parser';
import { readFileSync } from 'fs';
import { dxfJson } from './lib/dxf/dxf';

const fileString = readFileSync('./data/01.mod.json').toString();
const dxfJson = JSON.parse(fileString) as dxfJson;

const parser = new JsonParser();
const lines = parser.parseJson(dxfJson);

for (const line of lines) {
    console.log(line);
}
// console.log(lines);