import React, { createRef } from "react";
import Dropdown from "bootstrap/js/dist/dropdown";
import Component, { ComponentProps } from "../component";

export interface DropdownItem {
  label: React.ReactNode;
  onClick?: () => void;
}

export interface DropdownButtonContainerProps extends ComponentProps {
  buttonClasses?: string;
  menu?: DropdownItem[];
}

export default class DropdownButtonContainer extends Component<DropdownButtonContainerProps> {
  static jsClass = 'DropdownButtonContainer';
  static defaultProps: Partial<DropdownButtonContainerProps> = {
    ...Component.defaultProps,
    buttonClasses: 'btn btn-secondary dropdown-toggle',
    menu: []
  };

  private btnRef = createRef<HTMLButtonElement>();
  private dropdown?: Dropdown;

  componentDidMount(): void {
    if (this.btnRef.current) {
      this.dropdown = new Dropdown(this.btnRef.current);
    }
  }

  componentWillUnmount(): void {
    this.dropdown?.dispose();
  }

  content(children: React.ReactNode = this.props.children): React.ReactNode {
    const { buttonClasses, menu } = this.props;
    return (
      <div className="dropdown">
        <button
          type="button"
          className={buttonClasses}
          data-bs-toggle="dropdown"
          ref={this.btnRef}
        >
          {children}
        </button>
        {menu && menu.length > 0 && (
          <ul className="dropdown-menu">
            {menu.map((item, i) => (
              <li key={i}>
                <button className="dropdown-item" onClick={item.onClick}>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}
