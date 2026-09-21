import { describe, expect, it } from 'vitest';
import { sitePath } from '../src/js/site-paths.js';

describe('sitePath', () => {
  it('prefixes a page path with the GitHub Pages repository path', () => {
    expect(sitePath('contacts.html', '/service-layout/')).toBe('/service-layout/contacts.html');
  });

  it('keeps the site root within the GitHub Pages repository path', () => {
    expect(sitePath('', '/service-layout/')).toBe('/service-layout/');
  });
});
