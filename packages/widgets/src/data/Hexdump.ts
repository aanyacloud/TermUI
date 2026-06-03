import {
    type Screen,
    type Style,
    styleToCellAttrs,
    caps
} from '@termuijs/core';

import { Widget } from '../base/Widget.js';

export interface HexdumpOptions {
    /** Bytes per row. Default: 16 */
    bytesPerRow?: number;

    /** Character shown for non-printable bytes */
    placeholder?: string;
}

export class Hexdump extends Widget {
    private _data: Uint8Array;

    private _bytesPerRow: number;

    private _placeholder: string;

    constructor(
        data: Uint8Array,
        style: Partial<Style> = {},
        opts: HexdumpOptions = {}
    ) {
        super(style);

        this._data = data;
        this._bytesPerRow = opts.bytesPerRow ?? 16;
        this._placeholder = opts.placeholder ?? '.';
    }

    setData(data: Uint8Array): void {
        this._data = data;
        this.markDirty();
    }

    protected _renderSelf(screen: Screen): void {
        const rect = this._getContentRect();

        const { x, y, width, height } = rect;

        if (width <= 0 || height <= 0) {
            return;
        }

        const attrs = styleToCellAttrs(this._style);

        const separator = caps.unicode ? ' │ ' : ' | ';

        for (let row = 0; row < height; row++) {
            const start = row * this._bytesPerRow;

            if (start >= this._data.length) {
                break;
            }

            const chunk = this._data.slice(
                start,
                start + this._bytesPerRow
            );

            const offset = start
                .toString(16)
                .padStart(8, '0');

            const hex = Array.from(chunk)
                .map(byte =>
                    byte.toString(16).padStart(2, '0')
                )
                .join(' ');

            const ascii = Array.from(chunk)
                .map(byte => {
                    const printable =
                        byte >= 32 && byte <= 126;

                    return printable
                        ? String.fromCharCode(byte)
                        : this._placeholder;
                })
                .join('');

            const line =
                `${offset}${separator}${hex}${separator}${ascii}`;

            screen.writeString(
                x,
                y + row,
                line.slice(0, width),
                attrs
            );
        }
    }
}