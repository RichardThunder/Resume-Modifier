// Asset path utility functions
export function getAssetPath(path) {
  const basePath = '/modifier'; // Hardcoded to match next.config.mjs
  return `${basePath}${path.startsWith('/') ? path : `/${path}`}`;
}

// Add other utility functions as needed 