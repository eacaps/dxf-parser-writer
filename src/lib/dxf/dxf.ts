export interface dxfJson {
    header: dxfHeader,
    tables: {
        viewPort: dxfViewportContainer,
        lineType: dxfLineTypeContainer,
        layer: dxfLayerContainer
    }
    blocks: blockTypeObject,
    entities: dxfEntity[]
}

export interface blockTypeObject { [key: string]: blockObject };

export interface blockObject extends dxfBlock {
    layer: string;
    paperSpace?: boolean;
    name: string;
    position: xyzTriplet;
    name2: string;
    xrefPath: string;
}

export interface dxfEntity extends dxfBlock { };

export type shapeType = 'LWPOLYLINE' | 'POLYLINE' | 'VERTEX';

export interface shapeEntity extends dxfEntity {
    type: shapeType;
    vertices: xyPair[] | polylineVertex[];
    layer: string;
    shape?: boolean;
    hasContinuousLinetypePattern?: boolean;
    color?: number;
    colorIndex?: number;
    lineweight?: number;
}

export interface lwPolylineShapeEntity extends shapeEntity {
    type: 'LWPOLYLINE';
    vertices: xyPair[];
}

export interface polylineVertex extends shapeEntity, xyzTriplet {
    type: 'VERTEX';
}

export interface polylineShapeEntity extends shapeEntity {
    type: 'POLYLINE';
    vertices: polylineVertex[];
}

export function isLWPOLYLINE(thing: any): thing is lwPolylineShapeEntity {
    return thing.type && thing.type == 'LWPOLYLINE';
}

export function isPOLYLINE(thing: any): thing is polylineShapeEntity {
    return thing.type && thing.type == 'POLYLINE';
}

export interface xyzTriplet {
    "x": number,
    "y": number,
    "z": number
};

export type xyPair = {
    "x": number,
    "y": number
}

export interface dxfBlock {
    handle: string;
    ownerHandle: string;
}

export interface dxfTables {
    viewPort: dxfViewportContainer;
    lineType: dxfLineTypeContainer;
    layer: dxfLayerContainer;
}

export interface dxfViewportContainer extends dxfBlock {
    viewPorts: dxfViewport[];
}

export interface dxfViewport {
    name: string;
    ownerHandle: string;
    lowerLeftCorner: xyPair;
    upperRightCorner: xyPair;
    center: xyPair;
    snapBasePoint: xyPair;
    snapSpacing: xyPair;
    gridSpacing: xyPair;
    viewDirectionFromTarget: xyzTriplet;
    viewTarget: xyzTriplet;
    lensLength: number;
    frontClippingPlane: number;
    backClippingPlane: number;
    snapRotationAngle: number;
    viewTwistAngle: number;
    renderMode: number;
    ucsOrigin: xyzTriplet;
    ucsXAxis: xyzTriplet;
    ucsYAxis: xyzTriplet;
    orthographicType: number;
    defaultLightingOn: boolean;
    ambientColor: number;
}

export interface lineTypeObject { [key: string]: dxfLineType };

export interface dxfLineTypeContainer extends dxfBlock {
    lineTypes: lineTypeObject
}

export interface dxfLineType {
    name: string;
    description: string;
    patternLength: number;
}

export interface layerObject { [key: string]: dxfLayer };

export interface dxfLayerContainer extends dxfBlock {
    layers: layerObject;
}

export interface dxfLayer {
    name: string;
    frozen: boolean;
    visible: boolean;
    colorIndex: number;
    color: number;
}

export interface dxfHeader {
    "$ACADVER": string,
    "$ACADMAINTVER": number,
    "$DWGCODEPAGE": string,
    "$INSBASE": xyzTriplet,
    "$EXTMIN": xyzTriplet,
    "$EXTMAX": xyzTriplet,
    "$LIMMIN": xyPair,
    "$LIMMAX": xyPair,
    "$ORTHOMODE": number,
    "$REGENMODE": number,
    "$FILLMODE": number,
    "$QTEXTMODE": number,
    "$MIRRTEXT": number,
    "$LTSCALE": number,
    "$ATTMODE": number,
    "$TEXTSIZE": number,
    "$TRACEWID": number,
    "$TEXTSTYLE": string,
    "$CLAYER": string,
    "$CELTYPE": string,
    "$CECOLOR": number,
    "$CELTSCALE": number,
    "$DISPSILH": number,
    "$DIMSCALE": number,
    "$DIMASZ": number,
    "$DIMEXO": number,
    "$DIMDLI": number,
    "$DIMRND": number,
    "$DIMDLE": number,
    "$DIMEXE": number,
    "$DIMTP": number,
    "$DIMTM": number,
    "$DIMTXT": number,
    "$DIMCEN": number,
    "$DIMTSZ": number,
    "$DIMTOL": number,
    "$DIMLIM": number,
    "$DIMTIH": number,
    "$DIMTOH": number,
    "$DIMSE1": number,
    "$DIMSE2": number,
    "$DIMTAD": number,
    "$DIMZIN": number,
    "$DIMBLK": string,
    "$DIMASO": number,
    "$DIMSHO": number,
    "$DIMPOST": string,
    "$DIMAPOST": string,
    "$DIMALT": number,
    "$DIMALTD": number,
    "$DIMALTF": number,
    "$DIMLFAC": number,
    "$DIMTOFL": number,
    "$DIMTVP": number,
    "$DIMTIX": number,
    "$DIMSOXD": number,
    "$DIMSAH": number,
    "$DIMBLK1": string,
    "$DIMBLK2": string,
    "$DIMSTYLE": string,
    "$DIMCLRD": number,
    "$DIMCLRE": number,
    "$DIMCLRT": number,
    "$DIMTFAC": number,
    "$DIMGAP": number,
    "$DIMJUST": number,
    "$DIMSD1": number,
    "$DIMSD2": number,
    "$DIMTOLJ": number,
    "$DIMTZIN": number,
    "$DIMALTZ": number,
    "$DIMALTTZ": number,
    "$DIMUPT": number,
    "$DIMDEC": number,
    "$DIMTDEC": number,
    "$DIMALTU": number,
    "$DIMALTTD": number,
    "$DIMTXSTY": string,
    "$DIMAUNIT": number,
    "$DIMADEC": number,
    "$DIMALTRND": number,
    "$DIMAZIN": number,
    "$DIMDSEP": number,
    "$DIMATFIT": number,
    // not in sample
    "$DIMFAC"?: number,
    "$DIMFRAC": number,
    "$DIMLDRBLK": string,
    "$DIMLUNIT": number,
    "$DIMLWD": number,
    "$DIMLWE": number,
    "$DIMTMOVE": number,
    "$DIMFXL": number,
    "$DIMFXLON": number,
    "$DIMJOGANG": number,
    "$DIMTFILL": number,
    "$DIMTFILLCLR": number,
    "$DIMARCSYM": number,
    "$DIMLTYPE": string,
    "$DIMLTEX1": string,
    "$DIMLTEX2": string,
    "$DIMTXTDIRECTION": number,
    "$LUNITS": number,
    "$LUPREC": number,
    "$SKETCHINC": number,
    "$FILLETRAD": number,
    "$AUNITS": number,
    "$AUPREC": number,
    "$MENU": string,
    "$ELEVATION": number,
    "$PELEVATION": number,
    "$THICKNESS": number,
    "$LIMCHECK": number,
    "$CHAMFERA": number,
    "$CHAMFERB": number,
    "$CHAMFERC": number,
    "$CHAMFERD": number,
    "$SKPOLY": number,
    "$TDCREATE": number,
    "$TDUCREATE": number,
    "$TDUPDATE": number,
    "$TDUUPDATE": number,
    "$TDINDWG": number,
    "$TDUSRTIMER": number,
    "$USRTIMER": number,
    "$ANGBASE": number,
    "$ANGDIR": number,
    "$PDMODE": number,
    "$PDSIZE": number,
    "$PLINEWID": number,
    "$SPLFRAME": number,
    "$SPLINETYPE": number,
    "$SPLINESEGS": number,
    "$HANDSEED": string,
    "$SURFTAB1": number,
    "$SURFTAB2": number,
    "$SURFTYPE": number,
    "$SURFU": number,
    "$SURFV": number,
    "$UCSBASE": string,
    "$UCSNAME": string,
    "$UCSORG": xyzTriplet,
    "$UCSXDIR": xyzTriplet,
    "$UCSYDIR": xyzTriplet,
    "$UCSORTHOREF": string,
    "$UCSORTHOVIEW": number,
    "$UCSORGTOP": xyzTriplet,
    "$UCSORGBOTTOM": xyzTriplet,
    "$UCSORGLEFT": xyzTriplet,
    "$UCSORGRIGHT": xyzTriplet,
    "$UCSORGFRONT": xyzTriplet,
    "$UCSORGBACK": xyzTriplet,
    "$PUCSBASE": string,
    "$PUCSNAME": string,
    "$PUCSORG": xyzTriplet,
    "$PUCSXDIR": xyzTriplet,
    "$PUCSYDIR": xyzTriplet,
    "$PUCSORTHOREF": string,
    "$PUCSORTHOVIEW": number,
    "$PUCSORGTOP": xyzTriplet,
    "$PUCSORGBOTTOM": xyzTriplet,
    "$PUCSORGLEFT": xyzTriplet,
    "$PUCSORGRIGHT": xyzTriplet,
    "$PUCSORGFRONT": xyzTriplet,
    "$PUCSORGBACK": xyzTriplet,
    "$USERI1": number,
    "$USERI2": number,
    "$USERI3": number,
    "$USERI4": number,
    "$USERI5": number,
    "$USERR1": number,
    "$USERR2": number,
    "$USERR3": number,
    "$USERR4": number,
    "$USERR5": number,
    "$WORLDVIEW": number,
    "$SHADEDGE": number,
    "$SHADEDIF": number,
    "$TILEMODE": number,
    "$MAXACTVP": number,
    "$PINSBASE": xyzTriplet,
    "$PLIMCHECK": number,
    "$PEXTMIN": xyzTriplet,
    "$PEXTMAX": xyzTriplet,
    "$PLIMMIN": xyPair,
    "$PLIMMAX": xyPair,
    "$UNITMODE": number,
    "$VISRETAIN": number,
    "$PLINEGEN": number,
    "$PSLTSCALE": number,
    "$TREEDEPTH": number,
    "$CMLSTYLE": string,
    "$CMLJUST": number,
    "$CMLSCALE": number,
    "$PROXYGRAPHICS": number,
    "$MEASUREMENT": number,
    "$CELWEIGHT": number,
    "$ENDCAPS": number,
    "$JOINSTYLE": number,
    "$LWDISPLAY": boolean,
    "$INSUNITS": number,
    "$HYPERLINKBASE": string,
    "$STYLESHEET": string,
    "$XEDIT": boolean,
    "$CEPSNTYPE": number,
    // not in sample
    "$CEPSNID"?: number,
    "$PSTYLEMODE": boolean,
    "$FINGERPRINTGUID": string,
    "$VERSIONGUID": string,
    "$EXTNAMES": boolean,
    "$PSVPSCALE": number,
    "$OLESTARTUP": boolean,
    "$SORTENTS": number,
    "$INDEXCTL": number,
    "$HIDETEXT": number,
    "$XCLIPFRAME": number,
    "$HALOGAP": number,
    "$OBSCOLOR": number,
    "$OBSLTYPE": number,
    "$INTERSECTIONDISPLAY": number,
    "$INTERSECTIONCOLOR": number,
    "$DIMASSOC": number,
    "$PROJECTNAME": string,
    "$CAMERADISPLAY": boolean,
    "$LENSLENGTH": number,
    "$CAMERAHEIGHT": number,
    "$STEPSPERSEC": number,
    "$STEPSIZE": number,
    "$3DDWFPREC": number,
    "$PSOLWIDTH": number,
    "$PSOLHEIGHT": number,
    "$LOFTANG1": number,
    "$LOFTANG2": number,
    "$LOFTMAG1": number,
    "$LOFTMAG2": number,
    "$LOFTPARAM": number,
    "$LOFTNORMALS": number,
    "$LATITUDE": number,
    "$LONGITUDE": number,
    "$NORTHDIRECTION": number,
    "$TIMEZONE": number,
    "$LIGHTGLYPHDISPLAY": number,
    "$TILEMODELIGHTSYNCH": number,
    "$CMATERIAL": string,
    "$SOLIDHIST": number,
    "$SHOWHIST": number,
    "$DWFFRAME": number,
    "$DGNFRAME": number,
    "$REALWORLDSCALE": boolean,
    "$INTERFERECOLOR": number,
    "$CSHADOW": number,
    "$SHADOWPLANELOCATION": number,
    // not in sample
    "$DRAGVS"?: number,
    "$INTERFEREOBJVS"?: number,
    "$INTERFEREVPVS"?: number
}

export type dxfHeaderKeys = keyof dxfHeader;

export type numberPair = [number, number];
export type numberTriplet = [number, number, number];