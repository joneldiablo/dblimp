import { ControllerProps } from "@dblimp/core";

import BaseController, { SeedControllerState } from "./base-controller";

interface GalleryState extends SeedControllerState {
  status: "idle" | "loading" | "ready" | "error";
  error: unknown;
}

export default class GalleryController extends BaseController<
  ControllerProps,
  GalleryState
> {
  static readonly jsClass = "GalleryController";

  constructor(props: ControllerProps) {
    super(props);
    this.state = {
      ...this.state,
      status: "ready",
      error: null,
    };
  }
}