interface ImportMetaEnv {
  readonly VITE_BASE_API: string;
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
