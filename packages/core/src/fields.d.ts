import Component, { ComponentProps } from "./component";
export type Fields = Record<string, typeof Component | React.FC<ComponentProps> | any>;
declare const FIELDS: Fields;
export declare const addFields: (fields: Fields) => void;
export default FIELDS;
//# sourceMappingURL=fields.d.ts.map