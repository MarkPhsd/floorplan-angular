import { fabric } from 'fabric';
declare const RL_FILL = "white", RL_STROKE = "green", RL_PREVIEW_WIDTH = 140, RL_PREVIEW_HEIGHT = 120, RL_CHAIR_STROKE = "white", RL_CHAIR_FILL = "purple", RL_CHAIR_TUCK = 6, RL_VIEW_WIDTH = 120, RL_VIEW_HEIGHT = 56, RL_FOOT = 12, RL_AISLEGAP: number, RL_ROOM_OUTER_SPACING = 48, RL_ROOM_INNER_SPACING = 4, RL_ROOM_STROKE = "#000", RL_CORNER_FILL = "#88f", RL_UNGROUPABLES: string[], RL_CREDIT_TEXT = "", RL_CREDIT_TEXT_PARAMS: {
    fontSize: number;
    fontFamily: string;
    fill: string;
    left: number;
};
declare const createText: (properties: any) => fabric.IText;
/** Create Basic Shape  */
declare const createBasicShape: (part: any, stroke?: string, fill?: string) => any;
declare const createFurniture: (type: string, object: any, chair?: {}) => any;
/** Adding Chairs */
declare const createShape: (object: any, stroke?: string, fill?: string, type?: string) => fabric.Group;
declare const createTable: (def: any, RL_DEFAULT_CHAIR: any, type?: string) => fabric.Group;
export { createBasicShape, createTable, createShape, createText, createFurniture, RL_FILL, RL_STROKE, RL_CHAIR_STROKE, RL_CHAIR_FILL, RL_CHAIR_TUCK, RL_PREVIEW_HEIGHT, RL_PREVIEW_WIDTH, RL_VIEW_WIDTH, RL_VIEW_HEIGHT, RL_FOOT, RL_AISLEGAP, RL_ROOM_OUTER_SPACING, RL_ROOM_INNER_SPACING, RL_ROOM_STROKE, RL_CORNER_FILL, RL_UNGROUPABLES, RL_CREDIT_TEXT, RL_CREDIT_TEXT_PARAMS };
