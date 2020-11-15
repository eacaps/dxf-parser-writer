import { dxfHeader, dxfJson } from "./dxf";
import { END_SECTION, EOF, HEADER, SECTION } from "./strings";

export default class JsonParser {

    constructor() {

    }

    parseJson(dxf: dxfJson): string[] {
        const header = this.parseHeader(dxf.header);
        return [
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