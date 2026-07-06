import React, { FC, JSX, Component, ExoticComponent } from "react";

import Field, { FieldProps, FieldState } from "./field";

export interface PaginationFieldTexts {
  first: string;
  previus: string;
  next: string;
  last: string;
  pages: string;
  goto: string;
}

export interface PaginationFieldState extends FieldState {
  total?: number;
}

export interface PaginationFieldProps extends FieldProps {
  total?: number;
  firstBtn?: boolean;
  previusBtn?: boolean;
  nextBtn?: boolean;
  lastBtn?: boolean;
  texts?: PaginationFieldTexts;
}

export default class PaginationField extends Field<
  PaginationFieldProps,
  PaginationFieldState
> {
  static jsClass = "PaginationField";
  static defaultProps: Partial<PaginationFieldProps> = {
    ...Field.defaultProps,
    total: 1,
    default: 1,
    firstBtn: true,
    previusBtn: true,
    nextBtn: true,
    lastBtn: true,
    texts: {
      first: "Primer página",
      previus: "Página Anterior",
      next: "Siguiente página",
      last: "Última página",
      pages: "Páginas",
      goto: "Ir a la página...",
    },
  };

  tag:
    | keyof JSX.IntrinsicElements
    | typeof Component
    | FC<{}>
    | ExoticComponent<{}> = "nav";

  constructor(props: PaginationFieldProps) {
    super(props);
    Object.assign(this.state, {
      total: props.total,
    });
  }

  onUpdate({ total, ...data }: any) {
    if (total) this.setState({ total } as PaginationFieldState);
    super.onUpdate(data);
  }

  get type() {
    return "number";
  }

  get inputProps() {
    const props = super.inputProps;
    props.className = "page-link border-end-0 text-end pe-0";
    props.style = {
      ...props.style,
      width: 58,
    };
    props.max = (this.state as PaginationFieldState).total;
    props.min = 1;
    return props;
  }

  isFirst() {
    return this.state.value == 1;
  }

  isLast() {
    return this.state.value == (this.state as PaginationFieldState).total;
  }

  gotoPage(newPage: any) {
    let { value } = this.state;
    value = parseInt(value);
    switch (newPage) {
      case "first":
        value = 1;
        break;
      case "last":
        value = (this.state as PaginationFieldState).total;
        break;
      default:
        value += newPage;
        break;
    }
    this.setState(
      {
        value,
      },
      () => this.returnData()
    );
  }

  returnData(value = this.state.value) {
    const { total } = this.state as PaginationFieldState;
    if (value > total!) {
      value = total;
    } else if (value < 1) {
      value = 1;
    }
    super.returnData(value);
  }

  content(children = this.props.children) {
    const { paginationClasses, texts, firstBtn, previusBtn, nextBtn, lastBtn } =
      this.props;
    const { total } = this.state as PaginationFieldState;
    const cn = ["pagination", paginationClasses];
    const isFirst = this.isFirst();
    const isLast = this.isLast();
    const toReturn = React.createElement(
      "ul",
      { className: cn.flat().join(" ") },
      firstBtn &&
        React.createElement(
          "li",
          {
            className: "page-item" + (isFirst ? " disabled" : ""),
            title: texts.first,
          },
          React.createElement(
            "button",
            {
              type: "button",
              className: "page-link",
              disabled: isFirst,
              onClick: () => this.gotoPage("first"),
            },
            React.createElement("span", {}, "«")
          )
        ),
      previusBtn &&
        React.createElement(
          "li",
          {
            className: "page-item" + (isFirst ? " disabled" : ""),
            title: texts.previus,
          },
          React.createElement(
            "button",
            {
              type: "button",
              className: "page-link",
              disabled: isFirst,
              onClick: () => this.gotoPage(-1),
            },
            React.createElement("span", {}, "‹")
          )
        ),
      React.createElement(
        "li",
        { className: "page-item", title: texts.goto },
        this.inputNode
      ),
      React.createElement(
        "li",
        { className: "page-item" },
        React.createElement(
          "span",
          {
            className: "page-link border-start-0 border-end-0 px-1",
            style: { pointerEvents: "none" },
          },
          " /"
        )
      ),
      React.createElement(
        "li",
        {
          className: "page-item disabled",
          title: total + " " + texts.pages,
          style: {
            width: 58,
            "--bs-pagination-disabled-color": "var(--bs-pagination-color)",
            "--bs-pagination-disabled-bg": "var(--bs-pagination-bg)",
          },
        },
        React.createElement(
          "span",
          { className: "page-link border-start-0" },
          total
        )
      ),
      nextBtn &&
        React.createElement(
          "li",
          {
            className: "page-item" + (isLast ? " disabled" : ""),
            title: texts.next,
          },
          React.createElement(
            "button",
            {
              type: "button",
              className: "page-link",
              disabled: isLast,
              onClick: () => this.gotoPage(1),
            },
            React.createElement("span", {}, "›")
          )
        ),
      lastBtn &&
        React.createElement(
          "li",
          {
            className: "page-item" + (isLast ? " disabled" : ""),
            title: texts.last,
          },
          React.createElement(
            "button",
            {
              type: "button",
              className: "page-link",
              disabled: isLast,
              onClick: () => this.gotoPage("last"),
            },
            React.createElement("span", {}, "»")
          )
        )
    );
    return children ? (
      <>
        {toReturn}
        {children}
      </>
    ) : (
      toReturn
    );
  }
}
