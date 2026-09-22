import path from 'node:path';
import { pathToFileURL } from 'node:url';
const srcURL = pathToFileURL(path.resolve('./src')).href + '/';

export async function resolve(specifier, context, next) {
  if (specifier.startsWith('@/')) {
    return resolve(new URL(specifier.slice(2), srcURL).href, context, next);
  }
  try {
    return await next(specifier, context);
  } catch (err) {
    if (err && (err.code === 'ERR_MODULE_NOT_FOUND' || err.code === 'ERR_UNSUPPORTED_DIR_IMPORT')
        && (specifier.startsWith('.') || specifier.startsWith('file:'))) {
      const base = specifier.startsWith('file:') ? specifier : new URL(specifier, context.parentURL).href;
      for (const cand of [base + '.js', base + '/index.js']) {
        try { return await next(cand, context); } catch {}
      }
    }
    throw err;
  }
}
