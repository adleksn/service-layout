import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('home transitional responsiveness', () => {
  it('interpolates the tablet Pen hero without reverting to the compressed legacy type scale', () => {
    const css = readFileSync('src/styles/main.css', 'utf8');

    expect(css).toContain('@media (min-width: 768px) and (max-width: 959px)');
    expect(css).toContain('.hero h1 { font: 700 clamp(32px, 3.5vw, 36px) / 1.22 Inter, system-ui, sans-serif; }');
    expect(css).toContain('.hero p:not(.eyebrow) { max-width: none; font-size: 16px; line-height: 26px; }');
    expect(css).toContain('.hero__metrics { margin-top: 0; gap: 12px; font-size: 14px; }');
  });
});
