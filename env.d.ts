/// <reference types="vite/client" />
export interface ImportMetaEnv {
  VITE_API_WEBSOCKET_PROXY: string
  VITE_API_HTTPS_PROXY: string
  VITE_API_WEBSOCKET_URL: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}