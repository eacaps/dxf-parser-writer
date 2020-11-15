import { dxfHeader, dxfJson } from "./dxf";
import { END_SECTION, EOF, HEADER, SECTION, START } from "./strings";

export default class JsonParser {

    constructor() {

    }

    parseJson(dxf: dxfJson): string[] {
        const header = this.parseHeader(dxf.header);
        return [
            START,
            ...header,
            EOF
        ];
    }

    parseHeader(header: dxfHeader): string[] {
        return [
            SECTION,
            HEADER,
            END_SECTION
        ];
    }
}