import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('rating empty state', () => {
  it('uses the virtual-cards empty-result composition for an empty rating filter', () => {
    const app = readFileSync('src/js/app.js', 'utf8');
    const css = readFileSync('src/styles/main.css', 'utf8');

    expect(app).toContain("emptyState.classList.add('empty-state--catalog')");
    expect(app).toContain('Под выбранные условия не подошёл ни один сервис. Попробуйте убрать часть фильтров или сбросить их полностью.');
    expect(css).toContain('.empty-state--catalog {');
    expect(css).toContain('border: 1px solid #e6e6e6;');
    expect(css).toContain('.empty-state--catalog .button {');
    expect(css).toContain('background: #fff;');
  });
});
