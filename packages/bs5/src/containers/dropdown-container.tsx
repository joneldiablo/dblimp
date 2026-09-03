import React, { createRef } from "react";
import Dropdown from "bootstrap/js/dist/dropdown";
import DropdownButtonContainer, {
  DropdownButtonContainerProps,
} from "./dropdown-button-container";

export interface DropdownContainerProps extends DropdownButtonContainerProps {
  label?: React.ReactNode;
  value?: React.ReactNode;
  btnClasses?: string;
  dropdownClass?: boolean;
  disabled?: boolean;
}

/**
 * Dropdown container triggered by an inline span element instead of a standard button.
 */
export default class DropdownContainer extends DropdownButtonContainer {
  static override jsClass = "DropdownContainer";

  private spanRef = createRef<HTMLSpanElement>();
  private spanDropdown?: Dropdown;

  override componentDidMount(): void {
    if (this.spanRef.current) {
      this.spanDropdown = new Dropdown(this.spanRef.current);
    }
  }

  override componentWillUnmount(): void {
    this.spanDropdown?.dispose();
  }

  override content(children: React.ReactNode = this.props.children): React.ReactNode {
    const { btnClasses = "", label, value, dropdownClass, disabled, menu = [] } =
      this.props as DropdownContainerProps;

    const classNames = [btnClasses];
    if (dropdownClass !== false) {
      classNames.unshift("dropdown-toggle");
    }

    return (
      <div className="dropdown d-inline-block">
        {(label || value) && (
          <span
            className={classNames.filter(Boolean).join(" ")}
            data-bs-toggle="dropdown"
            ref={this.spanRef}
            style={{ cursor: disabled ? "not-allowed" : "pointer" }}
          >
            {label || value}
          </span>
        )}
        {menu && menu.length > 0 ? (
          <ul className="dropdown-menu">
            {menu.map((item, i) => (
              <li key={i}>
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={item.onClick}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          children
        )}
      </div>
    );
  }
}
