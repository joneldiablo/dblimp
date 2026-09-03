"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const goat_container_1 = __importDefault(require("../containers/goat-container"));
/**
 * View component that extends JsonRenderContainer
 */
class Controller extends goat_container_1.default {
    constructor(props) {
        super(props);
        this.tag = "article";
        this.state = this.state;
        Object.assign(this.state, {
            localClasses: this.props.test ? "test-view-wrapper" : "",
        });
    }
    get fixedProps() {
        return {
            ...this.props,
            childrenIn: this.props.routesIn,
        };
    }
    get childrenIn() {
        return this.props.routesIn || super.childrenIn;
    }
    get theView() {
        return this.props.content || super.theView;
    }
    componentDidUpdate(prevProps) {
        if (prevProps.test !== this.props.test) {
            const { localClasses } = this.state;
            const setClasses = new Set(localClasses.split(" "));
            if (this.props.test) {
                setClasses.add("test-view-wrapper");
            }
            else {
                setClasses.delete("test-view-wrapper");
            }
            this.setState({
                localClasses: [...setClasses].join(" "),
            });
        }
    }
}
Controller.jsClass = "Controller";
Controller.defaultProps = {
    ...goat_container_1.default.defaultProps,
    test: false,
};
Controller.template = null;
exports.default = Controller;
//# sourceMappingURL=controller.js.map