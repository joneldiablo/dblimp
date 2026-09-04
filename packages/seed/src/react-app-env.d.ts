/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly REACT_APP_API?: string;
    readonly REACT_APP_API_HEADERS?: string;
    readonly PUBLIC_URL?: string;
  }
}