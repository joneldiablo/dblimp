import { ControllerProps } from "@dblimp/core";

import BaseController from "./base-controller";

export default class RootController extends BaseController<ControllerProps> {
  static readonly jsClass = "RootController";

  mutations(name: string): { [key: string]: unknown } | void {
    switch (name) {
      case "rootHeader":
        return {
          classes: "seed-root-header",
        };
      default:
        return super.mutations(name, {} as any);
    }
  }
}