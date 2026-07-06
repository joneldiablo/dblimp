import AutocompleteField from "./autocomplete-field";
import CheckboxField from "./checkbox-field";
import DateRangeField from "./date-range-field";
import DropFileField from "./drop-file-field";
import Field from "./field";
import FileButtonField from "./file-button-field";
import FileField from "./file-field";
import GroupField from "./group-field";
import HiddenField from "./hidden-field";
import JsonEditorField from "./json-editor-field";
import NewPasswordField from "./new-password-field";
import NoWrapField from "./no-wrap-field";
import PaginationField from "./pagination-field";
import RadioField from "./radio-field";
import RangeField from "./range-field";
import SelectField from "./select-field";
import SwitchField from "./switch-field";
import TextareaField from "./textarea-field";

const fieldComponents = {
  AutocompleteField,
  checkbox: CheckboxField,
  CheckboxField,
  DateRangeField,
  DropFileField,
  Field,
  FileButtonField,
  FileField,
  GroupField,
  hidden: HiddenField,
  JsonEditorField,
  NewPasswordField,
  NoWrapField,
  PaginationField,
  radio: RadioField,
  RadioField,
  RangeField,
  select: SelectField,
  SelectField,
  SwitchField,
  TextareaField,
};

export const addFields = (_components: Record<string, any>) => {
  Object.assign(fieldComponents, _components);
};

export default fieldComponents;
