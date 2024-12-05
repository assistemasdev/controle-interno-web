function colorToHex(color) {
    const rgbMatch = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(\.\d+)?))?\)$/i);

    if (rgbMatch) {
        let r = parseInt(rgbMatch[1]);
        let g = parseInt(rgbMatch[2]);
        let b = parseInt(rgbMatch[3]);
        return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
    }

    const hslMatch = color.match(/^hsla?\((\d+),\s*(\d+)%\s*,\s*(\d+)%\s*(?:,\s*(\d+(\.\d+)?))?\)$/i);

    if (hslMatch) {
        let h = parseInt(hslMatch[1]) / 360;
        let s = parseInt(hslMatch[2]) / 100;
        let l = parseInt(hslMatch[3]) / 100;
        let a = hslMatch[4] ? parseFloat(hslMatch[4]) : 1;
        
        const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
        };

        let r, g, b;
        if (s === 0) {
        r = g = b = l; 
        } else {
        let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        let p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
        }
        
        r = Math.round(r * 255);
        g = Math.round(g * 255);
        b = Math.round(b * 255);

        return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
    }

    return color;
}


export default colorToHex