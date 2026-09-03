import React, { CSSProperties } from "react";
import { Stage, Layer, Line } from "react-konva";
import { Form } from "@dblimp/core";

export interface TrapezoidProps {
  className?: string;
  style?: CSSProperties;
  onChange?: (points: number[]) => void;
  sideB?: number;
  high?: number;
  sideA?: number;
}

export interface TrapezoidState {
  width: number;
  height: number;
  high?: number;
  points: number[];
}

/**
 * Parametric trapezoid visualizer using Konva canvas and DBLimp Form.
 */
export default class Trapezoid extends React.Component<
  TrapezoidProps,
  TrapezoidState
> {
  static jsClass = "Trapezoid";

  static defaultProps: Partial<TrapezoidProps> = {
    className: "",
    style: {},
  };

  state: TrapezoidState = {
    width: 0,
    height: 0,
    points: [],
  };

  private container: HTMLDivElement | null = null;

  propsForm = {
    name: "trapezoid",
    label: "Trapecio",
    onChange: this.onChange.bind(this),
    fields: [
      {
        name: "sideB",
        placeholder: "Base Menor",
        type: "number",
        min: 0,
        value: this.props.sideB,
      },
      {
        name: "high",
        placeholder: "Altura",
        type: "number",
        min: 0,
        value: this.props.high,
      },
      {
        name: "sideA",
        placeholder: "Base Mayor",
        type: "number",
        min: 0,
        value: this.props.sideA,
      },
    ],
  };

  onChange({ sideA, sideB, high }: { sideA?: any; sideB?: any; high?: any }) {
    if (!(sideA && sideB && high)) return;
    const numSideA = parseFloat(sideA);
    const numSideB = parseFloat(sideB);
    const numHigh = parseFloat(high);
    const diff = (numSideA - numSideB) / 2;
    const top = 0;
    const left = 0;

    let p1 = [diff + left, top];
    let p2 = [numSideB + diff + left, top];
    let p3 = [numSideA + left, top + numHigh];
    let p4 = [left, top + numHigh];

    if (diff < 0) {
      p1 = [left, top];
      p2 = [numSideB + left, top];
      p3 = [numSideA - diff + left, top + numHigh];
      p4 = [left - diff, top + numHigh];
    }

    const points = [...p1, ...p2, ...p3, ...p4];
    this.setState({ points, high: numHigh });

    if (typeof this.props.onChange === "function") {
      this.props.onChange(points);
    }
  }

  setContainer = (ref: HTMLDivElement | null) => {
    if (!ref) return;
    this.container = ref;
    this.setState({
      width: ref.offsetWidth,
      height: ref.offsetHeight,
    });
  };

  drawSvg() {
    const { points, high } = this.state;
    if (!points.length) return null;

    return (
      <Stage
        width={this.state.width}
        height={Math.max(this.state.height, (high ?? 0) + 2)}
      >
        <Layer>
          <Line
            points={points}
            fill="#00D2FF"
            stroke="black"
            strokeWidth={1}
            closed
          />
        </Layer>
      </Stage>
    );
  }

  render(): React.ReactNode {
    const { className, style } = this.props;

    return (
      <div
        className={`Trapezoid ${className ?? ""}`.trim()}
        style={{ display: "flex", gap: "1rem", ...style }}
      >
        <div style={{ flex: "0 0 auto" }}>
          <Form {...(this.propsForm as any)} />
        </div>
        <div
          style={{ flex: "1 1 auto", minHeight: 200 }}
          ref={this.setContainer}
        >
          {this.drawSvg()}
        </div>
      </div>
    );
  }
}
