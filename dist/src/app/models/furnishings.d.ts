declare const FURNISHINGS: {
    title: string;
    rooms: {
        title: string;
        width: number;
        height: number;
    }[];
    tables: ({
        title: string;
        width: number;
        height: number;
        lrSpacing: number;
        tbSpacing: number;
        shape: string;
        fill: string;
        selectionBackgroundColor: string;
        chairs: number;
        topChairs?: undefined;
        bottomChairs?: undefined;
        leftChairs?: undefined;
        rightChairs?: undefined;
    } | {
        title: string;
        width: number;
        height: number;
        lrSpacing: number;
        tbSpacing: number;
        shape: string;
        fill: string;
        chairs: number;
        selectionBackgroundColor?: undefined;
        topChairs?: undefined;
        bottomChairs?: undefined;
        leftChairs?: undefined;
        rightChairs?: undefined;
    } | {
        title: string;
        width: number;
        height: number;
        lrSpacing: number;
        tbSpacing: number;
        shape: string;
        fill: string;
        topChairs: number;
        bottomChairs: number;
        leftChairs: number;
        rightChairs: number;
        selectionBackgroundColor?: undefined;
        chairs?: undefined;
    })[];
    chairs: ({
        title: string;
        width: number;
        height: number;
        lrSpacing: number;
        tbSpacing: number;
        borderColor: string;
        strokeWidth: string;
        fill: string;
        stroke: string;
        parts: {
            stroke: string;
            borderColor: string;
            strokeWidth: string;
            fill: string;
            type: string;
            definition: {
                left: number;
                top: number;
                width: number;
                height: number;
            };
        }[];
        source?: undefined;
    } | {
        title: string;
        width: number;
        height: number;
        lrSpacing: number;
        tbSpacing: number;
        parts: {
            type: string;
            definition: {
                originX: string;
                originY: string;
                radius: number;
            };
        }[];
        borderColor?: undefined;
        strokeWidth?: undefined;
        fill?: undefined;
        stroke?: undefined;
        source?: undefined;
    } | {
        title: string;
        width: number;
        height: number;
        lrSpacing: number;
        tbSpacing: number;
        parts: {
            type: string;
            definition: {
                left: number;
                top: number;
                width: number;
                height: number;
            };
        }[];
        borderColor?: undefined;
        strokeWidth?: undefined;
        fill?: undefined;
        stroke?: undefined;
        source?: undefined;
    } | {
        title: string;
        width: number;
        height: number;
        lrSpacing: number;
        tbSpacing: number;
        parts: ({
            type: string;
            definition: {
                width: number;
                height: number;
                top?: undefined;
            };
        } | {
            type: string;
            definition: {
                width: number;
                height: number;
                top: number;
            };
        })[];
        borderColor?: undefined;
        strokeWidth?: undefined;
        fill?: undefined;
        stroke?: undefined;
        source?: undefined;
    } | {
        title: string;
        source: string;
        width: number;
        height: number;
        lrSpacing: number;
        tbSpacing: number;
        parts: ({
            type: string;
            definition: {
                width: number;
                height: number;
                top?: undefined;
            };
        } | {
            type: string;
            definition: {
                width: number;
                height: number;
                top: number;
            };
        })[];
        borderColor?: undefined;
        strokeWidth?: undefined;
        fill?: undefined;
        stroke?: undefined;
    })[];
    miscellaneous: ({
        title: string;
        width: number;
        height: number;
        flexible: boolean;
        parts: {
            type: string;
            definition: {
                left: number;
                top: number;
                width: number;
                height: number;
            };
        }[];
    } | {
        title: string;
        width: number;
        height: number;
        parts: ({
            type: string;
            definition: {
                left: number;
                top: number;
                width: number;
                height: number;
                stroke: string;
            };
            path?: undefined;
        } | {
            type: string;
            path: string;
            definition: {
                left?: undefined;
                top?: undefined;
                width?: undefined;
                height?: undefined;
                stroke?: undefined;
            };
        } | {
            type: string;
            definition: {
                left: number;
                top: number;
                width: number;
                height: number;
                stroke?: undefined;
            };
            path?: undefined;
        })[];
        flexible?: undefined;
    } | {
        title: string;
        width: number;
        height: number;
        parts: ({
            type: string;
            definition: {
                left: number;
                top: number;
                strokeWidth: number;
                stroke: string;
                originX: string;
                originY: string;
                radius: number;
            };
            path?: undefined;
        } | {
            type: string;
            path: string;
            definition: {
                strokeWidth: number;
                stroke: string;
                left?: undefined;
                top?: undefined;
                originX?: undefined;
                originY?: undefined;
                radius?: undefined;
            };
        })[];
        flexible?: undefined;
    })[];
    doors: {
        title: string;
        parts: ({
            type: string;
            definition: {
                left: number;
                width: number;
                top: number;
                height: number;
                fill: string;
                strokeWidth: number;
                originX: string;
                originY: string;
                stroke?: undefined;
            };
            line?: undefined;
            path?: undefined;
        } | {
            type: string;
            line: (string | number)[];
            definition: {
                stroke: string;
                strokeWidth: number;
                left?: undefined;
                width?: undefined;
                top?: undefined;
                height?: undefined;
                fill?: undefined;
                originX?: undefined;
                originY?: undefined;
            };
            path?: undefined;
        } | {
            type: string;
            path: string;
            definition: {
                stroke: string;
                strokeWidth: number;
                fill: string;
                left?: undefined;
                width?: undefined;
                top?: undefined;
                height?: undefined;
                originX?: undefined;
                originY?: undefined;
            };
            line?: undefined;
        })[];
    }[];
    windows: {
        title: string;
        parts: {
            type: string;
            definition: {
                left: number;
                width: number;
                top: number;
                height: number;
                fill: string;
                strokeWidth: number;
                originX: string;
                originY: string;
            };
        }[];
    }[];
};
export { FURNISHINGS };
