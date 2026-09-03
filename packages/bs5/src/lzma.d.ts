declare module "lzma" {
  interface LZMALib {
    compress(
      data: string | Uint8Array | ArrayBuffer,
      mode?: number,
      onFinish?: (result: any, error?: Error) => void,
      onProgress?: (percent: number) => void
    ): void;
    decompress(
      data: Uint8Array | ArrayBuffer,
      onFinish?: (result: any, error?: Error) => void,
      onProgress?: (percent: number) => void
    ): void;
  }
  const LZMALib: LZMALib;
  export default LZMALib;
}