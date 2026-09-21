export function sitePath(path, basePath = import.meta.env.BASE_URL) {
  const normalizedBase = basePath.endsWith('/') ? basePath : `${basePath}/`;
  return `${normalizedBase}${path.replace(/^\//, '')}`;
}

export function resolveSitePaths(root, basePath = import.meta.env.BASE_URL) {
  root.querySelectorAll('[href^="/"], [src^="/"]').forEach((element) => {
    const attribute = element.hasAttribute('href') ? 'href' : 'src';
    const value = element.getAttribute(attribute);
    if (value.startsWith('//')) return;
    element.setAttribute(attribute, sitePath(value, basePath));
  });
}
