import React, { createRef, RefObject } from "react";
import { TabulatorFull as TabulatorTable, Options } from "tabulator-tables";
import { Component, ComponentProps, ComponentState } from "@dblimp/core";

export interface TabulatorProps extends ComponentProps {
  options?: Options;
  data?: any[];
  columns?: any[];
  layout?: "fitData" | "fitColumns" | "fitDataFill" | "fitDataStretch";
  onRowClick?: (e: UIEvent, row: any) => void;
  onTableBuilt?: () => void;
}

export interface TabulatorState extends ComponentState {}

/**
 * Tabulator tables component integrated with the DBLimp Component system.
 */
export default class Tabulator extends Component<
  TabulatorProps,
  TabulatorState
> {
  static override jsClass = "Tabulator";

  private tableRef: RefObject<HTMLDivElement | null> = createRef();
  public tabulatorInstance: TabulatorTable | null = null;

  override componentDidMount(): void {
    if (!this.tableRef.current) return;

    const { options = {}, data = [], columns = [], layout = "fitColumns" } =
      this.props;

    this.tabulatorInstance = new TabulatorTable(this.tableRef.current, {
      data,
      columns,
      layout,
      ...options,
    });

    if (this.props.onTableBuilt) {
      this.tabulatorInstance.on("tableBuilt", this.props.onTableBuilt);
    }
    if (this.props.onRowClick) {
      this.tabulatorInstance.on("rowClick", this.props.onRowClick);
    }
  }

  override componentDidUpdate(prevProps: Readonly<TabulatorProps>): void {
    if (this.tabulatorInstance && prevProps.data !== this.props.data) {
      this.tabulatorInstance.setData(this.props.data || []);
    }
  }

  override componentWillUnmount(): void {
    if (this.tabulatorInstance) {
      this.tabulatorInstance.destroy();
      this.tabulatorInstance = null;
    }
  }

  override content(): React.ReactNode {
    return <div ref={this.tableRef} className="tabulator-container" />;
  }
}
