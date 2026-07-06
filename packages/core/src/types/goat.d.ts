/**
 * Global module declarations used across the project.
 *
 * @example
 * import flag from "./i18n/flags/mx.svg";
 */
declare module "*.svg" {
  const content: string;
  export default content;
}
