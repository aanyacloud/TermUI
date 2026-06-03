import { describe, it, expect, vi } from 'vitest';

import { Screen, caps } from '@termuijs/core';

import { Hexdump } from './Hexdump.js';

describe('Hexdump', () => {
    it('renders offset, hex, and ASCII columns', () => {
        const screen = new Screen(60, 3);

        const hd = new Hexdump(
            new Uint8Array([0x48, 0x69])
        );

        hd.updateRect({
            x: 0,
            y: 0,
            width: 60,
            height: 3
        });

        hd.render(screen);

        const row = screen.back[0]
            .map(cell => cell.char)
            .join('');

        expect(row).toContain('00000000');
        expect(row).toContain('48');
        expect(row).toContain('69');
        expect(row).toContain('Hi');
    });

    it('printable bytes render in ASCII column', () => {
        const screen = new Screen(60, 3);

        const hd = new Hexdump(
            new Uint8Array([0x41, 0x42, 0x43])
        );

        hd.updateRect({
            x: 0,
            y: 0,
            width: 60,
            height: 3
        });

        hd.render(screen);

        const row = screen.back[0]
            .map(cell => cell.char)
            .join('');

        expect(row).toContain('ABC');
    });

    it('non-printable bytes render placeholder', () => {
        const screen = new Screen(60, 3);

        const hd = new Hexdump(
            new Uint8Array([0x00, 0x01]),
            {},
            {
                placeholder: '?'
            }
        );

        hd.updateRect({
            x: 0,
            y: 0,
            width: 60,
            height: 3
        });

        hd.render(screen);

        const row = screen.back[0]
            .map(cell => cell.char)
            .join('');

        expect(row).toContain('??');
    });

    it('bytesPerRow wraps rows correctly', () => {
        const screen = new Screen(60, 5);

        const hd = new Hexdump(
            new Uint8Array([
                0x41,
                0x42,
                0x43,
                0x44
            ]),
            {},
            {
                bytesPerRow: 2
            }
        );

        hd.updateRect({
            x: 0,
            y: 0,
            width: 60,
            height: 5
        });

        hd.render(screen);

        const row1 = screen.back[0]
            .map(cell => cell.char)
            .join('');

        const row2 = screen.back[1]
            .map(cell => cell.char)
            .join('');

        expect(row1).toContain('00000000');
        expect(row2).toContain('00000002');
    });

    it('uses ASCII fallback separator when unicode is disabled', () => {
        vi.spyOn(caps, 'unicode', 'get')
            .mockReturnValue(false);

        const screen = new Screen(60, 3);

        const hd = new Hexdump(
            new Uint8Array([0x48])
        );

        hd.updateRect({
            x: 0,
            y: 0,
            width: 60,
            height: 3
        });

        hd.render(screen);

        const row = screen.back[0]
            .map(cell => cell.char)
            .join('');

        expect(row).toContain('|');
    });
});