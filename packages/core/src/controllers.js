"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addControllers = void 0;
const title_controller_1 = __importDefault(require("./controllers/title-controller"));
const controller_1 = __importDefault(require("./controllers/controller"));
const CONTROLLERS = {
    TitleController: title_controller_1.default,
    Controller: controller_1.default
};
const addControllers = (controllers) => {
    Object.assign(CONTROLLERS, controllers);
};
exports.addControllers = addControllers;
exports.default = CONTROLLERS;
//# sourceMappingURL=controllers.js.map