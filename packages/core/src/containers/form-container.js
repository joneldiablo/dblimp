"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const event_handler_1 = __importDefault(require("dbl-utils/event-handler"));
const component_1 = __importDefault(require("../component"));
class FormContainer extends component_1.default {
    constructor(props) {
        super(props);
        this.form = (0, react_1.createRef)();
        this.mergeDefault = null;
        this.events = [];
        this.readyEvents = [];
        this.onUpdate = ({ data, reset, default: dataDefault, update = true, clearData, mergeDefault, }) => {
            if (clearData) {
                this.setState({ data: {} });
            }
            if (dataDefault) {
                this.mergeDefault = mergeDefault;
                this.onDefault(dataDefault);
            }
            if (data) {
                if (update) {
                    Object.keys(data).forEach((fieldName) => {
                        event_handler_1.default.dispatch("update." + fieldName, {
                            value: data[fieldName],
                        });
                    });
                }
                this.setState({ data: { ...this.state.data, ...data } }, this.checkValidity);
            }
            if (typeof reset === "boolean") {
                this.reset();
            }
        };
        this.onDefault = (data) => {
            const defaultValues = {};
            this.fieldsForEach((field) => {
                defaultValues[field.name] = data[field.name];
            });
            if (this.mergeDefault) {
                Object.assign(this.state.defaultValues, defaultValues);
            }
            else {
                Object.assign(this.state, { defaultValues });
            }
            this.mergeDefault = null;
        };
        this.onInvalid = () => {
            clearTimeout(this.timeoutInvalid);
            this.timeoutInvalid = setTimeout(() => {
                event_handler_1.default.dispatch("invalid." + this.props.name, this.state.invalidFields);
            }, 400);
        };
        this.onInvalidField = (invalidData) => {
            Object.assign(this.state.invalidFields, invalidData);
        };
        this.onSubmit = async (e) => {
            e.preventDefault();
            e.stopPropagation();
            event_handler_1.default.dispatch(this.props.name, this.state.data);
        };
        this.state = this.state;
        Object.assign(this.state, {
            data: {},
            invalidFields: {},
            defaultValues: {},
        });
        this.onChange = this.onChange.bind(this);
        this.checkValidity = this.checkValidity.bind(this);
        this.events.push(["update." + props.name, this.onUpdate], ["default." + props.name, this.onDefault]);
        this.readyEvents = [];
        this.fieldsForEach((field) => {
            this.events.push([field.name, this.onChange]);
            this.events.push(["invalid." + field.name, this.onInvalidField]);
            this.readyEvents.push([
                "ready." + field.name,
                this.onReadyOnce.bind(this),
            ]);
            if (typeof field.default !== "undefined")
                Object.assign(this.state.defaultValues, {
                    [field.name]: field.default,
                });
        });
        delete this.eventHandlers.onChange;
    }
    componentDidMount() {
        this.events.forEach((event) => event_handler_1.default.subscribe(...event, this.name));
        this.readyEvents.forEach((event) => event_handler_1.default.subscribe(...event, this.name));
        this.reset();
    }
    componentWillUnmount() {
        clearTimeout(this.timeoutInvalid);
        clearTimeout(this.timeoutOnChange);
        clearTimeout(this.timeoutCheckValidity);
        this.events.forEach(([eventName]) => event_handler_1.default.unsubscribe(eventName, this.name));
    }
    checkValidity() {
        clearTimeout(this.timeoutCheckValidity);
        this.timeoutCheckValidity = setTimeout(() => {
            var _a;
            if ((_a = this.form.current) === null || _a === void 0 ? void 0 : _a.checkValidity()) {
                event_handler_1.default.dispatch("valid." + this.props.name, this.state.data);
            }
        }, 310);
    }
    onReadyOnce() {
        this.readyEvents.forEach(([eventName]) => event_handler_1.default.unsubscribe(eventName, this.name));
        event_handler_1.default.dispatch("ready." + this.props.name);
    }
    fieldsForEach(func) {
        const { fields } = this.props;
        if (Array.isArray(fields)) {
            fields.forEach((f, i) => func(typeof f === "string" ? { name: f } : f, i));
        }
        else {
            Object.keys(fields).forEach((name, i) => func({ name, ...fields[name] }, i));
        }
    }
    reset() {
        this.fieldsForEach((field) => {
            if (this.state.defaultValues[field.name] !== undefined)
                event_handler_1.default.dispatch("update." + field.name, {
                    value: this.state.defaultValues[field.name],
                });
            else
                event_handler_1.default.dispatch("update." + field.name, {
                    clear: true,
                    error: false,
                });
        });
        this.setState({ data: {} });
    }
    onChange(fieldData) {
        const { data, invalidFields } = this.state;
        Object.keys(fieldData).forEach((key) => delete invalidFields[key]);
        Object.assign(data, fieldData);
        this.setState({ data, invalidFields });
        event_handler_1.default.dispatch("change." + this.props.name, data);
        this.checkValidity();
    }
    content(children = this.props.children) {
        const { label, labelClasses, name } = this.props;
        return (react_1.default.createElement("form", { onSubmit: this.onSubmit, onInvalid: this.onInvalid, ref: this.form, id: `${name}-form` },
            label && react_1.default.createElement("label", { className: labelClasses }, label),
            children));
    }
}
FormContainer.jsClass = "FormContainer";
FormContainer.defaultProps = {
    ...component_1.default.defaultProps,
    fields: [],
};
exports.default = FormContainer;
//# sourceMappingURL=form-container.js.map