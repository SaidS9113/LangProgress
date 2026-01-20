// global.d.ts
interface R2Object {
  arrayBuffer(): Promise<ArrayBuffer>;
}

interface R2Bucket {
  get(key: string): Promise<R2Object | null>;
  put(key: string, value: ArrayBuffer | Uint8Array | string): Promise<void>;
}

declare const CLOUDFLARE_R2_BUCKET: R2Bucket;
