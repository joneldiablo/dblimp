import { ControllerProps } from "@dblimp/core";

import BaseController, { SeedControllerState } from "./base-controller";

interface HomeState extends SeedControllerState {
  status: "idle" | "loading" | "ready" | "error";
  error: unknown;
  hero: {
    eyebrow: string;
    title: string;
    body: string;
    primaryCta: string;
    secondaryCta: string;
  };
}

export default class HomeController extends BaseController<
  ControllerProps,
  HomeState
> {
  static readonly jsClass = "HomeController";

  constructor(props: ControllerProps) {
    super(props);
    this.state = {
      ...this.state,
      status: "ready",
      error: null,
      hero: {
        eyebrow: "Seed Contract",
        title: "dbl-seed trae un esqueleto frontend real",
        body: "Esta ruta demuestra el flujo mínimo completo: schema, definiciones, controller, componente reutilizable y estructura lista para documentar.",
        primaryCta: "Personaliza el contenido",
        secondaryCta: "Conserva la estructura estable",
      },
    };
  }

  mutations(name: string): { [key: string]: unknown } | void {
    switch (name) {
      case "homeHero":
        return this.state.hero;
      default:
        return super.mutations(name, {} as any);
    }
  }
}