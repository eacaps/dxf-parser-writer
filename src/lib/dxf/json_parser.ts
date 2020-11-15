import { dxfHeader, dxfJson, dxfHeaderKeys, numberTriplet, numberPair, xyzTriplet, xyPair } from "./dxf";
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
        const values: string[] = [];
        // dope: https://effectivetypescript.com/2020/05/26/iterate-objects/
        let k: keyof typeof header;
        for (k in header) {
            const value = header[k];
            const type = dxfHeaderGroupType[k];
            const typeValueArray = this.getHeaderValueString(type, value);

            if (typeValueArray.length > 0) {
                values.push('  ' + 9);
                values.push(k);
                values.push(...typeValueArray);
            }
        }
        return [
            SECTION,
            HEADER,
            ...values,
            END_SECTION
        ];
    }

    getHeaderValueString(type: number | numberPair | numberTriplet, value: string | number | boolean | xyzTriplet | xyPair | undefined): string[] {
        let values: string[] = [];
        if (typeof type === 'number') {
            values.push(' ' + type);
            values.push('' + value);
        } else if (Array.isArray(type) && type.length == 2) {
            const val = value as xyPair;
            values.push(' ' + type[0]);
            values.push('' + val.x);
            values.push(' ' + type[1]);
            values.push('' + val.y);
        } else if (Array.isArray(type) && type.length == 3) {
            const val = value as xyzTriplet;
            values.push(' ' + type[0]);
            values.push('' + val.x);
            values.push(' ' + type[1]);
            values.push('' + val.y);
            values.push(' ' + type[2]);
            values.push('' + val.z);
        }
        return values;
    }
}

export const dxfHeaderGroupType: { [key in dxfHeaderKeys]: number | numberPair | numberTriplet } = {
    "$ACADVER": 1,
    "$ACADMAINTVER": 70,
    "$DWGCODEPAGE": 3,
    "$INSBASE": [10, 20, 30],
    "$EXTMIN": [10, 20, 30],
    "$EXTMAX": [10, 20, 30],
    "$LIMMIN": [10, 20],
    "$LIMMAX": [10, 20],
    "$ORTHOMODE": 70,
    "$REGENMODE": 70,
    "$FILLMODE": 70,
    "$QTEXTMODE": 70,
    "$MIRRTEXT": 70,
    "$LTSCALE": 40,
    "$ATTMODE": 70,
    "$TEXTSIZE": 40,
    "$TRACEWID": 40,
    "$TEXTSTYLE": 7,
    "$CLAYER": 8,
    "$CELTYPE": 6,
    "$CECOLOR": 62,
    "$CELTSCALE": 40,
    "$DISPSILH": 70,
    "$DIMSCALE": 40,
    "$DIMASZ": 40,
    "$DIMEXO": 40,
    "$DIMDLI": 40,
    "$DIMRND": 40,
    "$DIMDLE": 40,
    "$DIMEXE": 40,
    "$DIMTP": 40,
    "$DIMTM": 40,
    "$DIMTXT": 40,
    "$DIMCEN": 40,
    "$DIMTSZ": 40,
    "$DIMTOL": 70,
    "$DIMLIM": 70,
    "$DIMTIH": 70,
    "$DIMTOH": 70,
    "$DIMSE1": 70,
    "$DIMSE2": 70,
    "$DIMTAD": 70,
    "$DIMZIN": 70,
    "$DIMBLK": 1,
    "$DIMASO": 70,
    "$DIMSHO": 70,
    "$DIMPOST": 1,
    "$DIMAPOST": 1,
    "$DIMALT": 70,
    "$DIMALTD": 70,
    "$DIMALTF": 40,
    "$DIMLFAC": 40,
    "$DIMTOFL": 70,
    "$DIMTVP": 40,
    "$DIMTIX": 70,
    "$DIMSOXD": 70,
    "$DIMSAH": 70,
    "$DIMBLK1": 1,
    "$DIMBLK2": 1,
    "$DIMSTYLE": 2,
    "$DIMCLRD": 70,
    "$DIMCLRE": 70,
    "$DIMCLRT": 70,
    "$DIMTFAC": 40,
    "$DIMGAP": 40,
    "$DIMJUST": 70,
    "$DIMSD1": 70,
    "$DIMSD2": 70,
    "$DIMTOLJ": 70,
    "$DIMTZIN": 70,
    "$DIMALTZ": 70,
    "$DIMALTTZ": 70,
    "$DIMUPT": 70,
    "$DIMDEC": 70,
    "$DIMTDEC": 70,
    "$DIMALTU": 70,
    "$DIMALTTD": 70,
    "$DIMTXSTY": 7,
    "$DIMAUNIT": 70,
    "$DIMADEC": 70,
    "$DIMALTRND": 40,
    "$DIMAZIN": 70,
    "$DIMDSEP": 70,
    "$DIMATFIT": 70,
    "$DIMFAC": 40,
    "$DIMFRAC": 70,
    "$DIMLDRBLK": 1,
    "$DIMLUNIT": 70,
    "$DIMLWD": 70,
    "$DIMLWE": 70,
    "$DIMTMOVE": 70,
    "$DRAGVS": 349,
    "$LUNITS": 70,
    "$LUPREC": 70,
    "$SKETCHINC": 40,
    "$FILLETRAD": 30,
    "$AUNITS": 70,
    "$AUPREC": 70,
    "$MENU": 1,
    "$ELEVATION": 40,
    "$PELEVATION": 40,
    "$THICKNESS": 40,
    "$LIMCHECK": 70,
    "$CHAMFERA": 40,
    "$CHAMFERB": 40,
    "$CHAMFERC": 40,
    "$CHAMFERD": 40,
    "$SKPOLY": 70,
    "$TDCREATE": 40,
    "$TDUCREATE": 40,
    "$TDUPDATE": 40,
    "$TDUUPDATE": 40,
    "$TDINDWG": 40,
    "$TDUSRTIMER": 40,
    "$USRTIMER": 70,
    "$ANGBASE": 50,
    "$ANGDIR": 70,
    "$PDMODE": 70,
    "$PDSIZE": 40,
    "$PLINEWID": 40,
    "$SPLINETYPE": 70,
    "$SPLINESEGS": 70,
    "$HANDSEED": 5,
    "$SURFTAB1": 70,
    "$SURFTAB2": 70,
    "$SURFTYPE": 70,
    "$SURFU": 70,
    "$SURFV": 70,
    "$UCSBASE": 2,
    "$UCSNAME": 2,
    "$UCSORG": [10, 20, 30],
    "$UCSXDIR": [10, 20, 30],
    "$UCSYDIR": [10, 20, 30],
    "$UCSORTHOREF": 2,
    "$UCSORTHOVIEW": 70,
    "$UCSORGTOP": [10, 20, 30],
    "$UCSORGBOTTOM": [10, 20, 30],
    "$UCSORGLEFT": [10, 20, 30],
    "$UCSORGRIGHT": [10, 20, 30],
    "$UCSORGFRONT": [10, 20, 30],
    "$UCSORGBACK": [10, 20, 30],
    "$PUCSBASE": 2,
    "$PUCSNAME": 2,
    "$PUCSORG": [10, 20, 30],
    "$PUCSXDIR": [10, 20, 30],
    "$PUCSYDIR": [10, 20, 30],
    "$PUCSORTHOREF": 2,
    "$PUCSORTHOVIEW": 70,
    "$PUCSORGTOP": [10, 20, 30],
    "$PUCSORGBOTTOM": [10, 20, 30],
    "$PUCSORGLEFT": [10, 20, 30],
    "$PUCSORGRIGHT": [10, 20, 30],
    "$PUCSORGFRONT": [10, 20, 30],
    "$PUCSORGBACK": [10, 20, 30],
    "$USERI1": 70,
    "$USERI2": 70,
    "$USERI3": 70,
    "$USERI4": 70,
    "$USERI5": 70,
    "$USERR1": 40,
    "$USERR2": 40,
    "$USERR3": 40,
    "$USERR4": 40,
    "$USERR5": 40,
    "$WORLDVIEW": 70,
    "$SHADEDGE": 70,
    "$SHADEDIF": 70,
    "$TILEMODE": 70,
    "$MAXACTVP": 70,
    "$PINSBASE": [10, 20, 30],
    "$PLIMCHECK": 70,
    "$PEXTMIN": [10, 20, 30],
    "$PEXTMAX": [10, 20, 30],
    "$PLIMMIN": [10, 20],
    "$PLIMMAX": [10, 20],
    "$UNITMODE": 70,
    "$VISRETAIN": 70,
    "$PLINEGEN": 70,
    "$PSLTSCALE": 70,
    "$TREEDEPTH": 70,
    "$CMLSTYLE": 2,
    "$CMLJUST": 70,
    "$CMLSCALE": 40,
    "$PROXYGRAPHICS": 70,
    "$MEASUREMENT": 70,
    "$CELWEIGHT": 370,
    "$ENDCAPS": 280,
    "$JOINSTYLE": 280,
    "$LWDISPLAY": 290,
    "$INSUNITS": 70,
    "$HYPERLINKBASE": 1,
    "$XEDIT": 290,
    "$CEPSNTYPE": 380,
    "$CEPSNID": 390,
    "$PSTYLEMODE": 290,
    "$FINGERPRINTGUID": 2,
    "$VERSIONGUID": 2,
    "$EXTNAMES": 290,
    "$PSVPSCALE": 40,
    "$SORTENTS": 280,
    "$INDEXCTL": 280,
    "$HIDETEXT": 290,
    "$XCLIPFRAME": 290,
    "$HALOGAP": 280,
    "$OBSCOLOR": 70,
    "$OBSLTYPE": 280,
    "$INTERSECTIONDISPLAY": 290,
    "$INTERSECTIONCOLOR": 70,
    "$DIMASSOC": 280,
    "$PROJECTNAME": 1,
    "$INTERFERECOLOR": 62,
    "$CSHADOW": 280,
    "$SHADOWPLANELOCATION": 40,
    "$INTERFEREOBJVS": 345,
    "$INTERFEREVPVS": 346,
    // not in standard
    "$DIMFXL": 40,
    "$DIMFXLON": 70,
    "$DIMJOGANG": 40,
    "$DIMTFILL": 70,
    "$DIMTFILLCLR": 70,
    "$DIMARCSYM": 70,
    "$DIMLTYPE": 6,
    "$DIMLTEX1": 6,
    "$DIMLTEX2": 6,
    "$DIMTXTDIRECTION": 70,
    "$SPLFRAME": 70,
    "$STYLESHEET": 1,
    "$LENSLENGTH": 40,
    "$CAMERAHEIGHT": 40,
    "$STEPSPERSEC": 40,
    "$STEPSIZE": 40,
    "$3DDWFPREC": 40,
    "$PSOLWIDTH": 40,
    "$PSOLHEIGHT": 40,
    "$LOFTANG1": 40,
    "$LOFTANG2": 40,
    "$LOFTMAG1": 40,
    "$LOFTMAG2": 40,
    "$LOFTPARAM": 70,
    "$LOFTNORMALS": 280,
    "$LATITUDE": 40,
    "$LONGITUDE": 40,
    "$NORTHDIRECTION": 40,
    "$TIMEZONE": 70,
    "$LIGHTGLYPHDISPLAY": 280,
    "$TILEMODELIGHTSYNCH": 280,
    "$CMATERIAL": 347,
    "$SOLIDHIST": 280,
    "$SHOWHIST": 280,
    "$DWFFRAME": 280,
    "$DGNFRAME": 280,
    "$CAMERADISPLAY": 290,
    "$REALWORLDSCALE": 290,
    "$OLESTARTUP": 290
}