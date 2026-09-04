import { Controller, ControllerProps, ControllerState } from "@dblimp/core";

export interface SeedControllerProps extends ControllerProps {}

export interface SeedControllerState extends ControllerState {
  status?: "idle" | "loading" | "ready" | "error";
  error?: unknown;
  [key: string]: any;
}

export default class BaseController<
  TProps extends SeedControllerProps = SeedControllerProps,
  TState extends SeedControllerState = SeedControllerState
> extends Controller<TProps, TState> {
  static jsClass = "BaseController";

  state = {
    status: "idle",
    error: null,
  } as TState;

  async asyncSetState(nextState: Partial<TState>) {
    return new Promise<boolean>((resolve) => {
      this.setState(nextState as TState, () => resolve(true));
    });
  }
}