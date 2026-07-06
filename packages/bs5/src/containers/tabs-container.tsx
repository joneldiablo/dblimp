import React from "react";
import Container from "./container";

export interface TabItem {
  label: React.ReactNode;
  eventKey: string;
  content: React.ReactNode;
}

export interface TabsContainerProps {
  tabs?: TabItem[];
  navClasses?: string;
  contentClasses?: string;
}

export default class TabsContainer extends Container<TabsContainerProps> {
  static jsClass = 'TabsContainer';
  static defaultProps: Partial<TabsContainerProps> = {
    ...Container.defaultProps,
    tabs: [],
    navClasses: 'nav nav-tabs mb-3',
    contentClasses: 'tab-content'
  };

  state = { active: this.props.tabs?.[0]?.eventKey };

  onSelect = (key: string) => {
    this.setState({ active: key });
  };

  content(children: React.ReactNode = this.props.children): React.ReactNode {
    const { tabs, navClasses, contentClasses } = this.props;
    const { active } = this.state as any;
    if (tabs && tabs.length) {
      return (
        <>
          <ul className={navClasses} role="tablist">
            {tabs.map(tab => (
              <li className="nav-item" key={tab.eventKey}>
                <button
                  className={"nav-link" + (active === tab.eventKey ? " active" : "")}
                  onClick={() => this.onSelect(tab.eventKey)}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
          <div className={contentClasses}>
            {tabs.map(tab => (
              <div
                key={tab.eventKey}
                className={"tab-pane fade" + (active === tab.eventKey ? " show active" : "")}
              >
                {tab.content}
              </div>
            ))}
            {children}
          </div>
        </>
      );
    }
    return <div className={contentClasses}>{children}</div>;
  }
}
