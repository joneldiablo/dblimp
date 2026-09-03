import React from "react";
import { RouteProps } from "./route";
interface SchemaProps {
    test?: boolean;
    theme?: string;
    routes: RouteProps | RouteProps[];
    defaultController?: any;
    forceRebuild?: boolean;
}
export default class SchemaController extends React.Component<SchemaProps> {
    static jsClass: string;
    static defaultProps: Partial<SchemaProps>;
    routeNodes: any[];
    routesHash?: number;
    constructor(props: SchemaProps);
    buildRoutes(): void;
    componentDidUpdate(prevProps: SchemaProps): void;
    views: (route: RouteProps, i?: number) => React.JSX.Element;
    render(): React.JSX.Element;
}
export declare const BrowserRouterSchema: React.FC<SchemaProps>;
export declare const HashRouterSchema: React.FC<SchemaProps>;
export {};
//# sourceMappingURL=react-router-schema.d.ts.map