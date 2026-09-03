"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addFields = void 0;
const components_1 = require("./components");
const FIELDS = {};
const addFields = (fields) => {
    Object.assign(FIELDS, fields);
    (0, components_1.addComponents)(fields);
};
exports.addFields = addFields;
exports.default = FIELDS;
//# sourceMappingURL=fields.js.map