import CheckboxField, {
  CheckboxFieldProps,
  CheckboxFieldState,
} from "./checkbox-field";

export interface SwitchFieldProps extends CheckboxFieldProps {}
export interface SwitchFieldState extends CheckboxFieldState {}

export default class SwitchField extends CheckboxField<
  SwitchFieldProps,
  SwitchFieldState
> {
  static jsClass = "SwitchField";

  static defaultProps: Partial<SwitchFieldProps> = {
    ...CheckboxField.defaultProps,
    format: "switch",
  };
}
