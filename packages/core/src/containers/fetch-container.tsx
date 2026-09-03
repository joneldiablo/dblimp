import React, { ReactNode } from "react";
import Component, { ComponentProps, ComponentState } from "../component";

export interface FetchContainerProps extends ComponentProps {
  url: string;
  fetchProps?: RequestInit;
}

export interface FetchContainerState extends ComponentState {
  fetchContent?: string;
}

/**
 * Container that fetches HTML or text from an endpoint and renders it.
 */
export default class FetchContainer extends Component<
  FetchContainerProps,
  FetchContainerState
> {
  static override jsClass = "FetchContainer";

  override state: FetchContainerState = {
    localClasses: "",
    localStyles: {},
    fetchContent: "",
  };

  override componentDidMount(): void {
    this.fetchData();
  }

  async fetchData(): Promise<void> {
    const { url, fetchProps } = this.props;
    if (!url) return;
    try {
      const response = await fetch(url, fetchProps);
      const text = await response.text();
      this.setState({ fetchContent: text });
    } catch (err) {
      console.error("FetchContainer error:", err);
    }
  }

  override content(children: ReactNode = this.props.children): ReactNode {
    return (
      <>
        <div
          dangerouslySetInnerHTML={{
            __html: this.state.fetchContent || "",
          }}
        />
        {children}
      </>
    );
  }
}
