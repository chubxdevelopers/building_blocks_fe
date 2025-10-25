import bakedManifest from './manifest.json';

export type ResourceDef = {
  name: string;
  endpoint: string;
  fields: string[];
  allowedOps: any;
};

export type Manifest = {
  schemaVersion: string;
  generatedAt: string;
  resources: ResourceDef[];
};

const STORAGE_KEY = 'api_builder_manifest';
const ETAG_KEY = 'api_builder_manifest_etag';

let currentManifest: Manifest = bakedManifest as Manifest;

// attempt to hydrate from localStorage immediately (fast start)
try {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    currentManifest = JSON.parse(raw) as Manifest;
  }
} catch (e) {
  // ignore JSON errors and keep baked-in manifest
}

export function getResource(name: string): ResourceDef {
  const res = currentManifest.resources.find((r) => r.name === name);
  if (!res) throw new Error(`Resource not found: ${name}`);
  return res;
}

export function getSchemaVersion(): string {
  return currentManifest.schemaVersion;
}

// Background refresh using ETag; if server returns 304 we keep current manifest.
export async function initRegistryRefresh(options?: { url?: string; onUpdated?: (m: Manifest) => void }) {
  const url = options?.url ?? '/schema/resources';
  const cachedEtag = localStorage.getItem(ETAG_KEY);

  try {
    const headers: Record<string, string> = {};
    if (cachedEtag) headers['If-None-Match'] = cachedEtag;

    const res = await fetch(url, { method: 'GET', headers });
    if (res.status === 304) {
      // unchanged
      return;
    }

    if (!res.ok) {
      // don't overwrite on failure
      return;
    }

    const newManifest = (await res.json()) as Manifest;
    const etag = res.headers.get('ETag');
    currentManifest = newManifest;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newManifest));
      if (etag) localStorage.setItem(ETAG_KEY, etag);
    } catch (e) {
      // ignore storage quota errors
    }

    if (options?.onUpdated) options.onUpdated(newManifest);
  } catch (e) {
    // network failed - silently keep baked-in or cached manifest
  }
}

export function getCurrentManifest(): Manifest {
  return currentManifest;
}
