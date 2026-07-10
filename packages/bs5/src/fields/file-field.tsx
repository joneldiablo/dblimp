import React from "react";
import bytes from "bytes";
import LZMA from "lzma";

import { eventHandler, extractNodeString } from "@dblimp/core";
import { Goat } from "@dblimp/core";

import Field, { FieldProps, FieldState } from "./field";

export interface FileFieldProps extends FieldProps {}

export interface FileFieldState extends FieldState {}

export default class FileField extends Field<FileFieldProps, FileFieldState> {
  static defaultProps: Partial<FileFieldProps> = {
    ...Field.defaultProps,
    multiple: false,
    format: "base64",
    zip: false,
  };

  static jsClass = "FileField";

  goat;

  constructor(props: FileFieldProps) {
    super(props);
    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    if (props.hidden)
      Object.assign(this.state, { localClasses: "cursor-pointer" });
    if (props.mutations) {
      const { mutations, ...propsSub } = props;
      this.goat = new Goat(propsSub, mutations);
    }
  }

  get componentProps() {
    const _props = this.props._props;
    return {
      onDragEnter: this.onDragEnter,
      onDragLeave: this.onDragLeave,
      onDrop: this.onDrop,
      onDragOver: this.onDragOver,
      ..._props,
    };
  }

  onDragOver(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this.deleteClasses("drag-over");
  }

  onDragEnter(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this.addClasses("drag-over");
  }

  onDragLeave(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this.deleteClasses("drag-over");
  }

  onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    this.deleteClasses("drag-over");
    const dt = e.dataTransfer;
    const files = dt.files;
    (this.input.current as HTMLInputElement).files = files;
    this.onChange({
      target: this.input.current,
    } as React.ChangeEvent<HTMLInputElement>);
  }

  get type() {
    return "file";
  }

  isInvalid(value: any) {
    const current = this.input.current as HTMLInputElement;
    if (this.props.maxSize && current?.files) {
      const files = Array.from(current.files);
      const error = files.some(
        (file) => file.size > Number(bytes(this.props.maxSize, { unit: "B" }))
      );
      if (error) {
        current.setCustomValidity(extractNodeString(this.props.errorMessage));
        return true;
      }
    }
    return super.isInvalid(value);
  }

  async onChange(e: React.ChangeEvent<HTMLInputElement>) {
    let { value, files } = e.target;
    const arrayFiles = Array.from(files ?? []);
    const newState: any = {
      value: [],
      error: this.isInvalid(value),
    };
    this.setState(newState);
    if (!arrayFiles.length || newState.error) return this.returnData(null);

    const p6s = arrayFiles.map(async (file) => {
      const readFile = await this.readAs(file, this.props.format);
      newState.value.push({
        name: file.name,
        file: readFile,
      });
      return readFile;
    });
    const final = await Promise.all(p6s);
    if (this.props.multiple) {
      this.returnData(final);
    } else {
      this.returnData(final[0]);
    }
  }

  readAs(file: File, format = "base64") {
    if (!file) return null;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      switch (format) {
        case "base64":
          reader.readAsDataURL(file);
          break;
        case "text":
          reader.readAsText(file);
          break;
        case "zip":
          reader.readAsArrayBuffer(file);
          break;
        case "arrayBuffer":
          reader.readAsArrayBuffer(file);
          break;
        case "blob":
          return resolve(file);
        default:
          break;
      }
      const onFinish = (result: any, error?: Error) => {
        eventHandler.dispatch("zipping." + this.props.name, {
          [this.props.name]: "end",
        });
        if (error) reject(error);
        else resolve(result);
      };
      const onPercentage = (percentage: number) =>
        eventHandler.dispatch("zipping." + this.props.name, {
          [this.props.name]: percentage,
        });
      reader.onload = () => {
        if (this.props.format !== "zip") return resolve(reader.result);
        eventHandler.dispatch("zipping." + this.props.name, {
          [this.props.name]: "start",
        });
        const array = new Uint8Array(reader.result as ArrayBuffer);
        const mode = this.props.zip || 9;
        LZMA.compress(array, mode, onFinish, onPercentage);
      };
      reader.onerror = (error) => reject(error);
    });
  }

  get inputProps() {
    const ip = super.inputProps;
    ip.required = ip.required && !this.state.value;
    delete ip.value;
    return ip;
  }

  get inputNode(): any {
    const { inline, disabled, readOnly } = this.props;
    const { value } = this.state;
    const links = [value]
      .flat()
      .map((l: any, i) => {
        if (!l) return false;
        let nameFile;
        const lrename = l;
        if (typeof l === "string")
          nameFile = lrename
            .split(/[\/\\]/)
            .pop()
            .split("?")[0];
        else nameFile = lrename.name;
        if (this.goat)
          return this.goat.buildContent({
            name: `${this.props.name}.file.${i}`,
            tag: "span",
            value: l,
            content: nameFile,
          });
        if (typeof l === "string") {
          return React.createElement(
            "a",
            { href: l, target: "_blank", className: "" },
            nameFile
          );
        } else {
          return React.createElement(
            "span",
            { name: l.name, classes: "" },
            nameFile
          );
        }
      })
      .filter((l) => !!l);

    const inputNode = React.createElement(
      React.Fragment,
      {},
      !(value && (disabled || readOnly))
        ? React.createElement("input", { ...this.inputProps })
        : React.createElement(
            "p",
            { className: "form-control mb-1 disabled" },
            ...links
          ),
      value &&
        !(disabled || readOnly) &&
        React.createElement(
          "p",
          { className: "text-end my-1" },
          React.createElement("small", {}, ...links)
        )
    );
    return inline
      ? React.createElement("div", { className: "col-auto" }, inputNode)
      : inputNode;
  }
}
