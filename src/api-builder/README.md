# API Builder (minimal)

This folder contains a compact API Builder used by the frontend to query and mutate backend resources.

Usage (app startup)

1. Import and call the registry refresh on app boot:

```ts
import { initRegistryRefresh } from '@/api-builder/registry';
initRegistryRefresh();
```

2. Use the public API:

```ts
import { query, mutate } from '@/api-builder';
// example
query({ resource: 'users', fields: ['id','name'], limit: 25 });
```

What is included
- `manifest.json` — baked-in manifest (schemaVersion + resources)
- `registry.ts` — returns manifest quickly, refreshes from backend with ETag, caches in localStorage
- `security.ts` — builds consistent security headers (Authorization, x-request-id, Idempotency-Key)
- `validate.ts` — lightweight field/filter checks
- `serialize.ts` — wire-shape serialization for GET and POST
- `client.ts` — fetch wrapper with timeout and retry-on-timeout behavior
- `index.ts` — public `query()` and `mutate()` functions
- `presets/` — optional convenience presets per screen

Notes
- The builder validates client requests early but the backend remains the source of truth.
- The registry fetch endpoint `/schema/resources` should return the same manifest shape and ideally provide an `ETag` header for efficient refresh.
