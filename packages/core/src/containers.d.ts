import Component, { ComponentProps } from "./component";
import Container from "./containers/container";
declare const CONTAINERS: Record<string, typeof Container<any, any> | React.FC<ComponentProps> | typeof Component<any, any>>;
export declare const addContainers: (containers: Record<string, typeof Container> | React.FC<ComponentProps>) => void;
export default CONTAINERS;
//# sourceMappingURL=containers.d.ts.map