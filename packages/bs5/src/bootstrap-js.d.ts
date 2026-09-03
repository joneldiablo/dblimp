declare module "bootstrap/js/dist/collapse" {
  export interface CollapseOptions {
    animation?: boolean;
    autoClose?: boolean | "inside" | "outside";
    parent?: Element | null;
    toggle?: boolean;
  }

  export default class Collapse {
    static getOrCreateInstance(element: Element, config?: CollapseOptions): Collapse;
    static getInstance(element: Element): Collapse | null;
    constructor(element: Element, config?: CollapseOptions);
    show(): void;
    hide(): void;
    toggle(): void;
    dispose(): void;
  }
}

declare module "bootstrap/js/dist/dropdown" {
  export interface DropdownOptions {
    autoClose?: boolean | "inside" | "outside";
    boundary?: Element | "clippingParents" | "scrollParent" | "viewport" | ((element: Element) => Element);
    display?: "dynamic" | "static";
    flip?: boolean;
    offset?: [number, number] | null | ((data: unknown) => unknown);
    orientation?: "auto" | "start" | "end";
    placement?: "auto" | "auto-start" | "auto-end" | "top" | "top-start" | "top-end" | "bottom" | "bottom-start" | "bottom-end" | "right" | "right-start" | "right-end" | "left" | "left-start" | "left-end";
    popperConfig?: unknown | null;
    reference?: Element | "toggle" | "parent" | ((element: Element) => Element);
    toggle?: boolean;
  }

  export default class Dropdown {
    static getOrCreateInstance(element: Element, config?: DropdownOptions): Dropdown;
    static getInstance(element: Element): Dropdown | null;
    constructor(element: Element | string, config?: DropdownOptions);
    show(): void;
    hide(): void;
    toggle(): void;
    dispose(): void;
    update(): void;
  }
}

declare module "bootstrap/js/dist/modal" {
  export interface ModalOptions {
    backdrop?: boolean | "static";
    focus?: boolean;
    keyboard?: boolean;
  }

  export default class Modal {
    static getOrCreateInstance(element: Element, config?: ModalOptions): Modal;
    static getInstance(element: Element): Modal | null;
    constructor(element: Element | string, config?: ModalOptions);
    show(): void;
    hide(): void;
    toggle(): void;
    dispose(): void;
    handleUpdate(): void;
  }
}

declare module "bootstrap/js/dist/offcanvas" {
  export interface OffcanvasOptions {
    backdrop?: boolean | "static";
    keyboard?: boolean;
    scroll?: boolean;
  }

  export default class Offcanvas {
    static getOrCreateInstance(element: Element, config?: OffcanvasOptions): Offcanvas;
    static getInstance(element: Element): Offcanvas | null;
    constructor(element: Element | string, config?: OffcanvasOptions);
    show(): void;
    hide(): void;
    toggle(): void;
    dispose(): void;
  }
}
