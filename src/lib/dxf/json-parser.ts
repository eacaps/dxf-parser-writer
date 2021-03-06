/* eslint-disable */
// TODO: fix lint
import {
  dxfHeader,
  dxfJson,
  dxfHeaderKeys,
  numberTriplet,
  numberPair,
  xyzTriplet,
  xyPair,
  dxfTables,
  dxfBlock,
  dxfViewportContainer,
  dxfViewport,
  dxfLineTypeContainer,
  lineTypeObject,
  dxfLayerContainer,
  layerObject,
  blockTypeObject,
  dxfEntity,
  isLWPOLYLINE,
} from './dxf';
import {
  AC_DB_BLOCK_BEGIN,
  AC_DB_BLOCK_END,
  AC_DB_ENTITY,
  AC_DB_LAYER_TABLE_RECORD,
  AC_DB_LINETYPE_TABLE_RECORD,
  AC_DB_POLYLINE,
  AC_DB_SYMBOL_TABLE,
  AC_DB_SYMBOL_TABLE_RECORD,
  AC_DB_VIEWPORT_TABLE_RECORD,
  BLANK_AC_DB_SYMBOL_TABLE,
  BLOCK,
  BLOCKS,
  ENDTAB,
  END_BLOCK,
  END_SECTION,
  ENTITIES,
  EOF,
  HEADER,
  INNER_LAYER,
  INNER_LTYPE,
  INNER_VPORT,
  LAYER,
  LTYPE,
  LWPOLYLINE,
  SECTION,
  TABLE,
  TABLES,
  VPORT,
} from './strings';

export default class JsonParser {
  constructor() {}

  /**
   * parseJson turns a dxfJson into a string array representing the json in
   * dxf format
   * @param dxf the JSON object to turn into a dxf
   */
  parseJson(dxf: dxfJson): string[] {
    const header = this.parseHeader(dxf.header);
    const tables = this.parseTables(dxf.tables);
    const blocks = this.parseBlocks(dxf.blocks);
    const entities = this.parseEntities(dxf.entities);
    return [...header, ...tables, ...blocks, ...entities, EOF];
  }

  /**
   * parseEntities parses the entity block of the dxfJson and returns a
   * whole section
   * @param entities the entities to convert
   */
  parseEntities(entities: dxfEntity[]): string[] {
    const shapes = this.parseEntityObjects(entities);
    return [SECTION, ENTITIES, ...shapes, END_SECTION];
  }

  /**
   * parseEntityObjects iterates over the dxfEntity objects and turns them
   * into string arrays
   * @param entities the entities to convert
   */
  parseEntityObjects(entities: dxfEntity[]): string[] {
    // TODO: refactor to take a single entity
    const values: string[] = [];
    for (const entity of entities) {
      if (isLWPOLYLINE(entity)) {
        const blockValues = this.writeBlockValues(entity);
        values.push(LWPOLYLINE);
        values.push(...blockValues);
        values.push(AC_DB_ENTITY);
        values.push(`  8`);
        values.push(entity.layer);
        values.push(AC_DB_POLYLINE);
        values.push(` 90`);
        values.push(`        ${entity.vertices.length}`);
        values.push(` 70`);
        values.push(`     ${entity.shape ? 1 : 0}`);
        // what is hasContinuousLinetypePattern?
        values.push(` 43`);
        values.push(`0.0`);
        for (const pair of entity.vertices) {
          const pointValues = this.writePair(` 10`, ` 20`, pair);
          values.push(...pointValues);
        }
      }
    }
    return values;
  }

  /**
   * parseBlocks parses the blocks block of the dxfJson and returns a whole
   * section
   * @param blocks the blocks to convert
   */
  parseBlocks(blocks: blockTypeObject): string[] {
    const blockValues = this.parseBlocksObject(blocks);
    return [SECTION, BLOCKS, ...blockValues, END_SECTION];
  }

  /**
   * parseBlocksObject iterates over the blockTypeObjects and turns them into
   * string arrays
   * @param blocks the blocks to convert
   */
  parseBlocksObject(blocks: blockTypeObject): string[] {
    // TODO: refactor to do one block
    const values: string[] = [];
    for (const k in blocks) {
      const block = blocks[k];
      values.push(BLOCK);
      values.push(`  5`);
      values.push(block.handle);
      values.push(`330`);
      values.push(block.ownerHandle);
      values.push(AC_DB_ENTITY);
      if (!block.name.includes('Model_Space')) {
        values.push(` 67`);
        values.push(`     1`);
      }
      values.push(`  8`);
      values.push(block.layer);
      values.push(AC_DB_BLOCK_BEGIN);
      values.push(`  2`);
      values.push(block.name);
      values.push(` 70`);
      values.push(`     0`);
      values.push(...this.writeTriplet(' 10', ' 20', ' 30', block.position));
      values.push(`  3`);
      values.push(block.name2);
      values.push(`  1`);
      values.push(block.xrefPath);
      values.push(END_BLOCK);
      values.push(`  5`);
      // this is an incremented version of handle??? 20 -> 21, 1C -> 1D
      values.push(block.handle);
      values.push(`330`);
      values.push(block.ownerHandle);
      if (!block.name.includes('Model_Space')) {
        values.push(` 67`);
        values.push(`     1`);
      }
      values.push(`  8`);
      values.push(block.layer);
      values.push(AC_DB_BLOCK_END);
    }
    return values;
  }

  /**
   * parseTables parses the tables block of the dxfJson and returns a whole
   * section
   * @param tables the tables to convert
   */
  parseTables(tables: dxfTables): string[] {
    const viewPortContainerValues = this.parseViewPortContainer(
      tables.viewPort
    );
    const lineTypeContainerValues = this.parseLineTypeContainer(
      tables.lineType
    );
    const layerContainerValues = this.parseLayerContainer(tables.layer);
    return [
      SECTION,
      TABLES,
      ...viewPortContainerValues,
      ...lineTypeContainerValues,
      ...layerContainerValues,
      END_SECTION,
    ];
  }

  /**
   * parseLayerContainer processes the layer table
   * @param layer the layer container object
   */
  parseLayerContainer(layer: dxfLayerContainer): string[] {
    const blockValues = this.writeBlockValues(layer);
    const layers = this.parseLayers(layer.layers, layer.handle);
    const layerCount = Object.keys(layer.layers).length;

    return [
      TABLE,
      LAYER,
      ...blockValues,
      AC_DB_SYMBOL_TABLE,
      `     ${layerCount}`,
      ...layers,
      ENDTAB,
    ];
  }

  /**
   * parseLayers iterates over the dxfLayer objects and turns them into
   * string arrays
   * @param layerObject the layer map object
   * @param handle the handle for the layer object
   */
  parseLayers(layerObject: layerObject, handle: string): string[] {
    // TODO: do one layer here
    const values: string[] = [];
    for (const k in layerObject) {
      const layer = layerObject[k];
      values.push(INNER_LAYER);
      values.push(`  5`);
      // dunno what this is, or if it has to be different
      values.push(`10`);
      values.push(`330`);
      values.push(handle);
      values.push(AC_DB_SYMBOL_TABLE_RECORD);
      values.push(AC_DB_LAYER_TABLE_RECORD);
      values.push(`  2`);
      values.push(layer.name);
      values.push(` 70`);
      values.push(`     ${layer.frozen ? 1 : 0}`);
      values.push(` 62`);
      values.push(`     ${layer.colorIndex}`);
      values.push(`  6`);
      // associated linetype name in the dxf file is always CONTINUOUS
      values.push(`Continuous`);
      values.push(`370`);
      values.push(`    -3`);
      values.push(`390`);
      values.push(`F`);
      values.push(`347`);
      values.push(`3E`);
      values.push(`348`);
      values.push(`0`);
    }
    return values;
  }

  /**
   * parseLineTypeContainer processes the lineType table
   * @param layer the lineType container object
   */
  parseLineTypeContainer(lineType: dxfLineTypeContainer): string[] {
    const blockValues = this.writeBlockValues(lineType);
    const linetypes = this.parseLineTypes(lineType.lineTypes, lineType.handle);
    return [
      TABLE,
      LTYPE,
      ...blockValues,
      BLANK_AC_DB_SYMBOL_TABLE,
      ...linetypes,
      ENDTAB,
    ];
  }

  /**
   * parseLineTypes iterates over the dxfLineType objects and turns them
   * into string arrays
   * @param lineTypeObject the lineType map object
   * @param handle the handle for the lineType object
   */
  parseLineTypes(lineTypeObject: lineTypeObject, handle: string): string[] {
    const values: string[] = [];
    // TODO: one dxfLineType here
    for (const k in lineTypeObject) {
      const lineType = lineTypeObject[k];
      values.push(INNER_LTYPE);
      values.push(`  5`);
      values.push(`14`);
      values.push(`330`);
      values.push(handle);
      values.push(AC_DB_SYMBOL_TABLE_RECORD);
      values.push(AC_DB_LINETYPE_TABLE_RECORD);
      values.push(`  2`);
      values.push(lineType.name);
      values.push(` 70`);
      values.push(`     0`);
      values.push(`  3`);
      values.push(lineType.description);
      values.push(` 72`);
      values.push(`    65`);
      values.push(` 73`);
      values.push(`     0`);
      values.push(` 40`);
      // 0.0?
      values.push(`${lineType.patternLength}`);
    }
    return values;
  }

  /**
   * parseViewPortContainer processes the viewport table
   * @param viewPort the viewport container object
   */
  parseViewPortContainer(viewPort: dxfViewportContainer): string[] {
    const blockValues = this.writeBlockValues(viewPort);
    const viewports = this.parseViewPorts(viewPort.viewPorts, viewPort.handle);
    return [
      TABLE,
      VPORT,
      ...blockValues,
      BLANK_AC_DB_SYMBOL_TABLE,
      ...viewports,
      ENDTAB,
    ];
  }

  /**
   * parseViewPorts iterates over the dxfViewport objects and turns them
   * into string arrays
   * @param viewPorts the viewports to convert
   * @param handle the handle for the viewport object
   */
  parseViewPorts(viewPorts: dxfViewport[], handle: string): string[] {
    const values: string[] = [];
    for (const viewPort of viewPorts) {
      values.push(INNER_VPORT);
      values.push(`  5`);
      values.push(`29`);
      values.push(`330`);
      values.push(handle);
      values.push(AC_DB_SYMBOL_TABLE_RECORD);
      values.push(AC_DB_VIEWPORT_TABLE_RECORD);
      values.push(`  2`);
      values.push(viewPort.name);
      values.push(` 70`);
      values.push(`     0`);

      values.push(...this.writePair(` 10`, ` 20`, viewPort.lowerLeftCorner));

      values.push(...this.writePair(` 11`, ` 21`, viewPort.upperRightCorner));

      values.push(...this.writePair(` 12`, ` 22`, viewPort.center));

      values.push(...this.writePair(` 13`, ` 23`, viewPort.snapBasePoint));

      values.push(...this.writePair(` 14`, ` 24`, viewPort.snapSpacing));

      values.push(...this.writePair(` 15`, ` 25`, viewPort.gridSpacing));

      values.push(
        ...this.writeTriplet(
          ` 16`,
          ` 26`,
          ` 36`,
          viewPort.viewDirectionFromTarget
        )
      );

      values.push(
        ...this.writeTriplet(` 17`, ` 27`, ` 37`, viewPort.viewTarget)
      );

      // 40 and 41 are missing from the json, i dont know if this is important
      // values.push(` 40`);
      // values.push(`124.4170638339396`);
      // values.push(` 41`);
      // values.push(`2.234395750332005`)

      values.push(` 42`);
      values.push(`${viewPort.lensLength}`);
      values.push(` 43`);
      values.push(`${viewPort.frontClippingPlane}`);
      values.push(` 44`);
      values.push(`${viewPort.backClippingPlane}`);
      values.push(` 50`);
      values.push(`${viewPort.snapRotationAngle}`);
      values.push(` 51`);
      values.push(`${viewPort.viewTwistAngle}`);

      // 71 - 78 are in the dxf but not the json
      /**
             71
                0
            72
            100
            73
                1
            74
                3
            75
                0
            76
                0
            77
                0
            78
                0
             */

      values.push(`281`);
      values.push(`     ${viewPort.renderMode}`);

      /**
             65
                1
             */

      values.push(
        ...this.writeTriplet(`110`, `120`, `130`, viewPort.ucsOrigin)
      );
      values.push(...this.writeTriplet(`111`, `121`, `131`, viewPort.ucsXAxis));
      values.push(...this.writeTriplet(`110`, `120`, `130`, viewPort.ucsYAxis));

      values.push(` 79`);
      values.push(`     ${viewPort.orthographicType}`);

      /**
            146
            0.0
            348
            2F
             60
                 3
             61
                 5
             */
      if (viewPort.defaultLightingOn) {
        values.push(`292`);
        values.push(`     1`);
      }
      /**
            282
                 1
            141
            0.0
            142
            0.0
             */
      values.push(` 63`);
      values.push(`   ${viewPort.ambientColor}`);
      /**
            361
            3F
            1001
            ACAD_NAV_VCDISPLAY
            1070
                3
             */
    }
    return values;
  }

  /**
   * writePair takes the strings that should preceed each value of a pair
   * and writes a 4 length string array
   * @param xString the string to preceed the x value
   * @param yString the string to preceed the y value
   * @param pair the pair to write
   */
  writePair(xString: string, yString: string, pair: xyPair): string[] {
    const values = [];
    values.push(xString);
    values.push(`${pair.x}`);
    values.push(yString);
    values.push(`${pair.y}`);
    return values;
  }

  /**
   * writeTriplet takes the strings that should preceed each value of a triplet
   * and writes a 6 length string array
   * @param xString the string to preceed the x value
   * @param yString the string to preceed the y value
   * @param zString the string to preceed the z value
   * @param triplet the triple to write
   */
  writeTriplet(
    xString: string,
    yString: string,
    zString: string,
    triplet: xyzTriplet
  ): string[] {
    const values = [];
    values.push(xString);
    values.push(`${triplet.x}`);
    values.push(yString);
    values.push(`${triplet.y}`);
    values.push(zString);
    values.push(`${triplet.z}`);
    return values;
  }

  /**
   * writeBlockValues is a utility method to read a block and write the basic
   * values to a string array
   * @param block the block element
   */
  writeBlockValues(block: dxfBlock): string[] {
    const values = [];
    // if(block.handle) {
    values.push(`  5`);
    values.push(block.handle);
    // }
    values.push(`330`);
    values.push(block.ownerHandle);
    return values;
  }

  /**
   * parseHeader iterates over the keys in the header and writes out the
   * string array for each value using the getHeaderValueString method
   * @param header the header section
   */
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
    return [SECTION, HEADER, ...values, END_SECTION];
  }

  /**
   * getHeaderValueString checks the type for this key and returns a string array containing the type(s) and the value(s) based on the type
   * @param type the type for this key
   * @param value the value from the json
   */
  getHeaderValueString(
    type: number | numberPair | numberTriplet,
    value: string | number | boolean | xyzTriplet | xyPair | undefined
  ): string[] {
    let values: string[] = [];
    /*
            $ACADVER
             1
            AC1024
              9
        */
    if (typeof type === 'number') {
      values.push(' ' + type);
      values.push(`${value}`);
    } else if (Array.isArray(type) && type.length == 2) {
      /*
            $PLIMMIN
             10
            0.0
             20
            0.0
              9
        */
      const val = value as xyPair;
      values.push(' ' + type[0]);
      values.push(`${val.x}`);
      values.push(' ' + type[1]);
      values.push(`${val.y}`);
    } else if (Array.isArray(type) && type.length == 3) {
      /*
            $EXTMIN
             10
            1.000000000000000E+20
             20
            1.000000000000000E+20
             30
            1.000000000000000E+20
              9
         */
      const val = value as xyzTriplet;
      values.push(' ' + type[0]);
      values.push(`${val.x}`);
      values.push(' ' + type[1]);
      values.push(`${val.y}`);
      values.push(' ' + type[2]);
      values.push(`${val.z}`);
    }
    return values;
  }
}

/**
 * dxfHeaderGroupType provides a mapping of values for use in constructing the header
 */
export const dxfHeaderGroupType: {
  [key in dxfHeaderKeys]: number | numberPair | numberTriplet;
} = {
  $ACADVER: 1,
  $ACADMAINTVER: 70,
  $DWGCODEPAGE: 3,
  $INSBASE: [10, 20, 30],
  $EXTMIN: [10, 20, 30],
  $EXTMAX: [10, 20, 30],
  $LIMMIN: [10, 20],
  $LIMMAX: [10, 20],
  $ORTHOMODE: 70,
  $REGENMODE: 70,
  $FILLMODE: 70,
  $QTEXTMODE: 70,
  $MIRRTEXT: 70,
  $LTSCALE: 40,
  $ATTMODE: 70,
  $TEXTSIZE: 40,
  $TRACEWID: 40,
  $TEXTSTYLE: 7,
  $CLAYER: 8,
  $CELTYPE: 6,
  $CECOLOR: 62,
  $CELTSCALE: 40,
  $DISPSILH: 70,
  $DIMSCALE: 40,
  $DIMASZ: 40,
  $DIMEXO: 40,
  $DIMDLI: 40,
  $DIMRND: 40,
  $DIMDLE: 40,
  $DIMEXE: 40,
  $DIMTP: 40,
  $DIMTM: 40,
  $DIMTXT: 40,
  $DIMCEN: 40,
  $DIMTSZ: 40,
  $DIMTOL: 70,
  $DIMLIM: 70,
  $DIMTIH: 70,
  $DIMTOH: 70,
  $DIMSE1: 70,
  $DIMSE2: 70,
  $DIMTAD: 70,
  $DIMZIN: 70,
  $DIMBLK: 1,
  $DIMASO: 70,
  $DIMSHO: 70,
  $DIMPOST: 1,
  $DIMAPOST: 1,
  $DIMALT: 70,
  $DIMALTD: 70,
  $DIMALTF: 40,
  $DIMLFAC: 40,
  $DIMTOFL: 70,
  $DIMTVP: 40,
  $DIMTIX: 70,
  $DIMSOXD: 70,
  $DIMSAH: 70,
  $DIMBLK1: 1,
  $DIMBLK2: 1,
  $DIMSTYLE: 2,
  $DIMCLRD: 70,
  $DIMCLRE: 70,
  $DIMCLRT: 70,
  $DIMTFAC: 40,
  $DIMGAP: 40,
  $DIMJUST: 70,
  $DIMSD1: 70,
  $DIMSD2: 70,
  $DIMTOLJ: 70,
  $DIMTZIN: 70,
  $DIMALTZ: 70,
  $DIMALTTZ: 70,
  $DIMUPT: 70,
  $DIMDEC: 70,
  $DIMTDEC: 70,
  $DIMALTU: 70,
  $DIMALTTD: 70,
  $DIMTXSTY: 7,
  $DIMAUNIT: 70,
  $DIMADEC: 70,
  $DIMALTRND: 40,
  $DIMAZIN: 70,
  $DIMDSEP: 70,
  $DIMATFIT: 70,
  $DIMFAC: 40,
  $DIMFRAC: 70,
  $DIMLDRBLK: 1,
  $DIMLUNIT: 70,
  $DIMLWD: 70,
  $DIMLWE: 70,
  $DIMTMOVE: 70,
  $DRAGVS: 349,
  $LUNITS: 70,
  $LUPREC: 70,
  $SKETCHINC: 40,
  $FILLETRAD: 30,
  $AUNITS: 70,
  $AUPREC: 70,
  $MENU: 1,
  $ELEVATION: 40,
  $PELEVATION: 40,
  $THICKNESS: 40,
  $LIMCHECK: 70,
  $CHAMFERA: 40,
  $CHAMFERB: 40,
  $CHAMFERC: 40,
  $CHAMFERD: 40,
  $SKPOLY: 70,
  $TDCREATE: 40,
  $TDUCREATE: 40,
  $TDUPDATE: 40,
  $TDUUPDATE: 40,
  $TDINDWG: 40,
  $TDUSRTIMER: 40,
  $USRTIMER: 70,
  $ANGBASE: 50,
  $ANGDIR: 70,
  $PDMODE: 70,
  $PDSIZE: 40,
  $PLINEWID: 40,
  $SPLINETYPE: 70,
  $SPLINESEGS: 70,
  $HANDSEED: 5,
  $SURFTAB1: 70,
  $SURFTAB2: 70,
  $SURFTYPE: 70,
  $SURFU: 70,
  $SURFV: 70,
  $UCSBASE: 2,
  $UCSNAME: 2,
  $UCSORG: [10, 20, 30],
  $UCSXDIR: [10, 20, 30],
  $UCSYDIR: [10, 20, 30],
  $UCSORTHOREF: 2,
  $UCSORTHOVIEW: 70,
  $UCSORGTOP: [10, 20, 30],
  $UCSORGBOTTOM: [10, 20, 30],
  $UCSORGLEFT: [10, 20, 30],
  $UCSORGRIGHT: [10, 20, 30],
  $UCSORGFRONT: [10, 20, 30],
  $UCSORGBACK: [10, 20, 30],
  $PUCSBASE: 2,
  $PUCSNAME: 2,
  $PUCSORG: [10, 20, 30],
  $PUCSXDIR: [10, 20, 30],
  $PUCSYDIR: [10, 20, 30],
  $PUCSORTHOREF: 2,
  $PUCSORTHOVIEW: 70,
  $PUCSORGTOP: [10, 20, 30],
  $PUCSORGBOTTOM: [10, 20, 30],
  $PUCSORGLEFT: [10, 20, 30],
  $PUCSORGRIGHT: [10, 20, 30],
  $PUCSORGFRONT: [10, 20, 30],
  $PUCSORGBACK: [10, 20, 30],
  $USERI1: 70,
  $USERI2: 70,
  $USERI3: 70,
  $USERI4: 70,
  $USERI5: 70,
  $USERR1: 40,
  $USERR2: 40,
  $USERR3: 40,
  $USERR4: 40,
  $USERR5: 40,
  $WORLDVIEW: 70,
  $SHADEDGE: 70,
  $SHADEDIF: 70,
  $TILEMODE: 70,
  $MAXACTVP: 70,
  $PINSBASE: [10, 20, 30],
  $PLIMCHECK: 70,
  $PEXTMIN: [10, 20, 30],
  $PEXTMAX: [10, 20, 30],
  $PLIMMIN: [10, 20],
  $PLIMMAX: [10, 20],
  $UNITMODE: 70,
  $VISRETAIN: 70,
  $PLINEGEN: 70,
  $PSLTSCALE: 70,
  $TREEDEPTH: 70,
  $CMLSTYLE: 2,
  $CMLJUST: 70,
  $CMLSCALE: 40,
  $PROXYGRAPHICS: 70,
  $MEASUREMENT: 70,
  $CELWEIGHT: 370,
  $ENDCAPS: 280,
  $JOINSTYLE: 280,
  $LWDISPLAY: 290,
  $INSUNITS: 70,
  $HYPERLINKBASE: 1,
  $XEDIT: 290,
  $CEPSNTYPE: 380,
  $CEPSNID: 390,
  $PSTYLEMODE: 290,
  $FINGERPRINTGUID: 2,
  $VERSIONGUID: 2,
  $EXTNAMES: 290,
  $PSVPSCALE: 40,
  $SORTENTS: 280,
  $INDEXCTL: 280,
  $HIDETEXT: 290,
  $XCLIPFRAME: 290,
  $HALOGAP: 280,
  $OBSCOLOR: 70,
  $OBSLTYPE: 280,
  $INTERSECTIONDISPLAY: 290,
  $INTERSECTIONCOLOR: 70,
  $DIMASSOC: 280,
  $PROJECTNAME: 1,
  $INTERFERECOLOR: 62,
  $CSHADOW: 280,
  $SHADOWPLANELOCATION: 40,
  $INTERFEREOBJVS: 345,
  $INTERFEREVPVS: 346,
  // not in standard
  $DIMFXL: 40,
  $DIMFXLON: 70,
  $DIMJOGANG: 40,
  $DIMTFILL: 70,
  $DIMTFILLCLR: 70,
  $DIMARCSYM: 70,
  $DIMLTYPE: 6,
  $DIMLTEX1: 6,
  $DIMLTEX2: 6,
  $DIMTXTDIRECTION: 70,
  $SPLFRAME: 70,
  $STYLESHEET: 1,
  $LENSLENGTH: 40,
  $CAMERAHEIGHT: 40,
  $STEPSPERSEC: 40,
  $STEPSIZE: 40,
  $3DDWFPREC: 40,
  $PSOLWIDTH: 40,
  $PSOLHEIGHT: 40,
  $LOFTANG1: 40,
  $LOFTANG2: 40,
  $LOFTMAG1: 40,
  $LOFTMAG2: 40,
  $LOFTPARAM: 70,
  $LOFTNORMALS: 280,
  $LATITUDE: 40,
  $LONGITUDE: 40,
  $NORTHDIRECTION: 40,
  $TIMEZONE: 70,
  $LIGHTGLYPHDISPLAY: 280,
  $TILEMODELIGHTSYNCH: 280,
  $CMATERIAL: 347,
  $SOLIDHIST: 280,
  $SHOWHIST: 280,
  $DWFFRAME: 280,
  $DGNFRAME: 280,
  $CAMERADISPLAY: 290,
  $REALWORLDSCALE: 290,
  $OLESTARTUP: 290,
};
