import React from "react";

import AutocompleteField from "./autocomplete-field";
import DateRangeField from "./date-range-field";
import Field from "./field";
import GroupField from "./group-field";
import HiddenField from "./hidden-field";
import JsonEditorField from "./json-editor-field";
import NoWrapField from "./no-wrap-field";
import PaginationField from "./pagination-field";
import RadioField from "./radio-field";
import SelectField from "./select-field";
import TextareaField from "./textarea-field";
import CheckboxField from "./checkbox-field";

export type FieldComponentType = React.ComponentType<any> & {
  jsClass?: string;
};

export type FieldComponentRegistry = Record<string, FieldComponentType>;

const fieldComponents: FieldComponentRegistry = {
  AutocompleteField,
  Field,
  SelectField,
  radio: RadioField,
  RadioField,
  CheckboxField,
  checkbox: CheckboxField,
  JsonEditorField,
  GroupField,
  HiddenField,
  hidden: HiddenField,
  NoWrapField,
  TextareaField,
  DateRangeField,
  PaginationField,
};

export const addFields = (components: Partial<FieldComponentRegistry>): void => {
  Object.assign(fieldComponents, components);
};

export default fieldComponents;
