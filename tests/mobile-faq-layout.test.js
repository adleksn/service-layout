import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('mobile FAQ layout', () => {
  it('keeps an expanded answer inside the card width at 375 px', () => {
    const css = readFileSync('src/styles/main.css', 'utf8');

    expect(css).toContain('@media (max-width: 767px) {\n  .faq { gap: 10px; }');
    expect(css).toContain('.faq > div > div { box-sizing: border-box; width: 100%; margin: 0; padding: 12px 14px; }');
    expect(css).not.toContain('.faq > div > div { box-sizing: content-box; width: 100%; margin: 0 -1px -1px; padding: 12px 14px; }');
  });
});
