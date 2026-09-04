import { ControllerProps } from "@dblimp/core";

import BaseController, { SeedControllerState } from "./base-controller";

interface ScreenPreviewState extends SeedControllerState {
  status: "idle" | "loading" | "ready" | "error";
  error: unknown;
}

export default class ScreenPreviewController extends BaseController<
  ControllerProps,
  ScreenPreviewState
> {
  static readonly jsClass = "ScreenPreviewController";

  constructor(props: ControllerProps) {
    super(props);
    this.state = {
      ...this.state,
      status: "ready",
      error: null,
    };
  }
}