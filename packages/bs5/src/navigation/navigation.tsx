import React, { createRef } from "react";
import { NavLink } from "react-router-dom";
import Collapse from "bootstrap/js/dist/collapse";

import { eventHandler, deepMerge, splitAndFlat, extractNodeString } from "@dblimp/core";
import Goat from "@dblimp/core/goat";
import Icons from "@dblimp/icomoon";
import Component, { ComponentProps, ComponentState } from "@dblimp/core/component";
import FloatingContainer from "@dblimp/floating";

export interface NavigationItem {
  active?: boolean;
  classes?: string | string[];
  content?: React.ReactNode | string;
  disabled?: boolean;
  end?: boolean;
  floatingClasses?: string | string[];
  hasAnActive?: boolean;
  href?: string;
  icon?: false | string;
  iconProps?: Record<string, any>;
  itemClasses?: string | string[];
  itemProps?: Record<string, any>;
  label?: React.ReactNode;
  menu?: NavigationItem[] | Record<string, NavigationItem>;
  name: string;
  parent?: NavigationItem | string;
  path?: string;
  strict?: boolean;
  to?: string;
  open?: boolean;
  activeCaretClasses?: string | string[];
  caretClasses?: string | string[];
  iconClasses?: string | string[];
  title?: string | React.ReactNode;
}

export interface NavigationProps<TItem extends NavigationItem = NavigationItem>
  extends ComponentProps {
  menu?: TItem[] | Record<string, TItem>;
  caretIcons?: [string, string];
  navLink?: boolean;
  activeClasses?: string;
  inactiveClasses?: string;
  pendingClasses?: string;
  transitioningClasses?: string;
  itemTag?: keyof React.JSX.IntrinsicElements;
  itemClasses?: string;
  floatingClasses?: string;
  iconClasses?: string;
  toggle?: string;
  location?: { pathname: string };
}

export interface NavigationState extends ComponentState {
  carets: Record<string, string>;
  open: boolean;
  localClasses: string;
}

export default class Navigation<
  TItem extends NavigationItem = NavigationItem,
  TProps extends NavigationProps<TItem> = NavigationProps<TItem>,
  TState extends NavigationState = NavigationState
> extends Component<TProps, TState> {
  static jsClass = "Navigation";

  static defaultProps: Partial<NavigationProps> = {
    ...Component.defaultProps,
    menu: [],
    caretIcons: ["angle-up", "angle-down"],
    navLink: true,
    activeClasses: "active",
    inactiveClasses: "",
    pendingClasses: "pending",
    transitioningClasses: "transitioning",
    itemTag: "div",
    itemClasses: "",
    floatingClasses: "",
    iconClasses: "mx-2",
  };

  protected tag: any = "nav";
  protected events: [string, (...args: any[]) => void][] = [];
  protected activeElements: Record<string, boolean> = {};
  protected flatItems: Record<string, TItem> = {};
  protected collapses = createRef<Record<string, any>>();
  protected itemsRefs = createRef<Record<string, any>>();
  protected goat: Goat;
  protected activeItem?: TItem;
  protected pathname?: string;

  constructor(props: TProps) {
    super(props);

    const open = typeof props.open !== "boolean" || props.open;

    Object.assign(this.state, {
      carets: {},
      open,
      localClasses: `nav ${open ? "label-show" : "label-collapsed"}`,
    });

    this.collapses.current = {};
    this.itemsRefs.current = {};
    this.goat = new Goat(props);

    this.hide = this.hide.bind(this);
    this.link = this.link.bind(this);
    this.onToggleBtn = this.onToggleBtn.bind(this);

    // Agrega el evento solo si existe `toggle`
    if (props.toggle) {
      this.events.push([props.toggle, this.onToggleBtn]);
    }
  }
  componentDidMount(): void {
    this.findFirstActive(this.props.menu);
    // Suscribimos a todos los eventos almacenados en `this.events`
    this.events.forEach(([evt, handler]) => eventHandler.subscribe(evt, handler, this.name));
  }

  componentDidUpdate(prevProps: NavigationProps<TItem>): void {
    // Verificar si `open` cambió y actualizar
    if (typeof this.props.open === "boolean" && prevProps.open !== this.props.open) {
      this.toggleText(this.props.open);
    }

    // Manejo de cambio en `toggle`
    if (this.props.toggle && prevProps.toggle !== this.props.toggle) {
      // Desuscribimos del evento anterior si existía
      if (prevProps.toggle) {
        eventHandler.unsubscribe(prevProps.toggle, this.name);
      }

      // Actualizar el array de eventos con el nuevo toggle
      const index = this.events.findIndex(([evtName]) => evtName === prevProps.toggle);
      if (index !== -1) {
        this.events.splice(index, 1); // Eliminamos el evento anterior
      }

      // Evitamos duplicar eventos
      if (!this.events.some(([evtName]) => evtName === this.props.toggle)) {
        this.events.push([this.props.toggle, this.onToggleBtn]); // Añadir el nuevo evento
        eventHandler.subscribe(this.props.toggle, this.onToggleBtn, this.name); // Suscribir
      }
    }
  }

  componentWillUnmount(): void {
    // Desuscribimos de todos los eventos cuando el componente se desmonta
    this.events.forEach(([evt]) => eventHandler.unsubscribe(evt, this.name));
  }

  /**
   * Busca el primer ítem activo en el menú y lo marca como tal.
   * @param menu Lista de ítems del menú
   * @param parent (Opcional) Ítem padre del menú
   * @returns El primer ítem activo encontrado o `undefined`
   */
  protected findFirstActive(
    menu: TItem[] | Record<string, TItem> | undefined,
    parent?: TItem
  ): TItem | undefined {
    const items = Array.isArray(menu)
      ? menu
      : menu
        ? Object.entries(menu).map(([name, item]) => ({ name, ...(item as any) }))
        : undefined;
    let foundItem: TItem | undefined;

    items?.some(item => {
      item.parent = parent;
      this.flatItems[item.name] = item;
      item.hasAnActive = false;

      if (this.props.location?.pathname === (item.path || item.to)) {
        this.onChangeRoute(this.props.location!);
        foundItem = item;
        return true;
      } else if (item.menu) {
        foundItem = this.findFirstActive(
          Object.entries(item.menu).map(([n, item]) => ({ name: n, ...item as any }))
          , item);
        return !!foundItem;
      }
      return false;
    });

    this.onChangeLocation(this.props.location!);
    return foundItem;
  }
  /**
 * Maneja el cambio de ruta y actualiza el estado del componente.
 * @param location Objeto de ubicación con la nueva ruta.
 */
  protected onChangeRoute(location: { pathname: string }): void {
    this.pathname = location.pathname;
    eventHandler.dispatch(this.props.name, {
      pathname: this.pathname,
      item: this.activeItem,
      open: this.state.open,
    });
  }

  /**
   * Maneja la acción de alternar la visibilidad del menú.
   */
  protected onToggleBtn(): void {
    this.toggleText();
  }

  /**
   * Alterna el estado de `open` y actualiza las clases del componente.
   * @param open (Opcional) Nuevo estado de visibilidad.
   */
  protected toggleText(open: boolean = !this.state.open): void {
    this.setState(
      {
        open,
        localClasses: open ? "nav label-show" : "nav label-collapsed",
      },
      () =>
        eventHandler.dispatch(this.props.name, {
          pathname: this.pathname,
          item: this.activeItem,
          open: this.state.open,
        })
    );
  }

  /**
   * Asigna una referencia de colapsable a un ítem de navegación.
   * @param ref Referencia del DOM.
   * @param item Ítem de navegación asociado.
   */
  protected collapseRef(ref: HTMLElement | null, item: TItem): void {
    if (!ref) return;
    if (!this.collapses.current) this.collapses.current = {};
    if (this.collapses.current[item.name]?.ref === ref) return;

    this.collapses.current[item.name] = {
      ref,
      item,
      submenuOpen: false,
    };
  }

  /**
   * Maneja la apertura y cierre de submenús dentro de la navegación.
   * @param e Evento de clic.
   * @param item Ítem de navegación asociado.
   */
  protected onToggleSubmenu(e: React.MouseEvent, item: TItem): void {
    if (!item.menu?.length || !this.state.open) return;
    e.stopPropagation();
    e.preventDefault();

    const itemControl = this.collapses.current![item.name];
    if (!itemControl.collapse) {
      itemControl.ref.removeEventListener("hidden.bs.collapse", this.hide);
      itemControl.collapse = Collapse.getOrCreateInstance(itemControl.ref, {
        autoClose: false,
        toggle: false,
      } as any);
      itemControl.ref.addEventListener("hidden.bs.collapse", this.hide);
    }

    if (!itemControl.submenuOpen) {
      this.state.carets[item.name] = this.props.caretIcons?.[0] ?? "angle-up";
      this.setState({ carets: this.state.carets }, () => itemControl.collapse.show());
    } else {
      // Cierra todos los submenús dentro del ítem actual
      Array.from(itemControl.ref.querySelectorAll(".collapse"))
        .reverse()
        .forEach((collapse: any) => Collapse.getInstance(collapse)?.hide());

      itemControl.collapse.hide();
    }
    itemControl.submenuOpen = !itemControl.submenuOpen;
  }

  /**
   * Muestra el menú flotante de un ítem cuando se pasa el cursor sobre él.
   * @param e Evento de mouse.
   * @param item Ítem de navegación asociado.
   */
  protected onToggleFloating(e: React.MouseEvent, item: TItem): void {
    eventHandler.dispatch(`update.${item.name}Floating`, { open: true });

    // Forzar actualización después de un breve tiempo para cargar referencias
    setTimeout(() => {
      this.forceUpdate();
    }, 350);
  }

  /**
   * Maneja la acción de ocultar un submenú cuando la animación de colapso finaliza.
   * @param e Evento del DOM.
   */
  protected hide(e: Event): void {
    const itemName = (e.target as any).id.split("-collapse")[0];
    const itemControl = this.collapses.current![itemName];
    const caretClose = this.props.caretIcons?.[1] ?? "angle-down";

    itemControl.submenuOpen = false;
    this.state.carets[itemName] = caretClose;
    this.setState({ carets: this.state.carets });
  }
  /**
   * Establece el estado de un ítem de navegación como activo o inactivo.
   * @param name Nombre del ítem.
   * @param isActive Indica si el ítem está activo.
   * @returns Siempre retorna `false` para evitar propagaciones no deseadas.
   */
  protected setActive(name: string, isActive: boolean): false {
    this.activeElements[name] = isActive;
    return false;
  }

  /**
   * Verifica si un ítem tiene un padre activo y lo propaga hacia arriba.
   * @param menuItem Ítem del menú a evaluar.
   * @returns El nombre del ítem raíz activo.
   */
  protected hasAnActive(menuItem: TItem): string {
    if (!menuItem.parent) return menuItem.name;
    const parent = this.flatItems[menuItem.parent as string];
    if (parent) {
      parent.hasAnActive = true;
      return this.hasAnActive(parent);
    }
    return menuItem.name;
  }

  /**
   * Maneja los cambios de ubicación y actualiza los ítems activos.
   * @param location Objeto de ubicación con la nueva ruta.
   */
  protected onChangeLocation(location: { pathname: string }): void {
    let activeItem: TItem | undefined;

    Object.values(this.flatItems).forEach(item => {
      const path = item.path || item.to;
      item.hasAnActive = false;
      if (path === location.pathname) activeItem = item;
    });

    if (activeItem) {
      this.activeItem = activeItem;
      this.hasAnActive(activeItem);

      if (!this.state.open && activeItem.parent) {
        eventHandler.dispatch(`update.${(activeItem.parent as TItem).name}Floating`, { open: false });
      }
    }

    this.forceUpdate();
  }

  /**
   * Genera un enlace de navegación basado en la estructura del menú.
   * @param itemRaw Ítem del menú sin procesar.
   * @param i Índice del ítem dentro de su lista.
   * @param parent (Opcional) Ítem padre del menú.
   * @returns Un nodo React representando el enlace del menú.
   */
  protected link(itemRaw: TItem, i: number, parent?: TItem): React.ReactNode {
    if (!itemRaw) return null;

    const {
      caretIcons = ["angle-up", "angle-down"],
      navLink,
      itemTag = "div",
      linkClasses,
      floatingClasses,
      activeClasses,
      inactiveClasses,
      pendingClasses,
      transitioningClasses,
      caretClasses,
      activeCaretClasses,
    } = this.props;

    const { carets, open: stateOpen } = this.state;

    const modifiedItem = this.props.mutations
      ? this.props.mutations(`${this.props.name}.${itemRaw.name}`, itemRaw) || {}
      : {};
    this.flatItems[itemRaw.name] = { ...this.flatItems[itemRaw.name], ...itemRaw, ...modifiedItem };
    const item = this.flatItems[itemRaw.name];
    item.parent = parent;

    const open = typeof item.open === "boolean" ? item.open : stateOpen;

    if (item.active === false) return null;

    carets[item.name] = carets[item.name] || caretIcons[1];

    const iconStyle = { style: { fill: "currentColor" } };

    const innerNode = (
      <span>
        {item.content
          ? open
            ? this.goat.buildContent((item.content as Array<any>)[0])
            : this.goat.buildContent((item.content as Array<any>)[1])
          : (
            <>
              {item.icon !== false && (
                <Icons
                  icon={item.icon}
                  className={splitAndFlat([item.iconClasses || this.props.iconClasses], " ").join(" ")}
                  title={item.title || extractNodeString(item.label)}
                  {...iconStyle}
                  {...deepMerge(this.props.iconProps || {}, item.iconProps || {})}
                />
              )}
              {(open || !!parent) && <span className="label">{this.goat.buildContent(item.label)}</span>}
            </>
          )}
      </span>
    );

    const disabled = item.disabled || this.props.disabled;
    const className = splitAndFlat(
      [
        item.classes || linkClasses,
        !(item.path || item.to) && "cursor-pointer",
        item.hasAnActive && [activeClasses, "has-an-active"],
        navLink && "nav-link",
        !!item.menu?.length && "has-submenu",
        disabled && "disabled",
      ],
      " "
    ).join(" ");

    const propsLink = item.path || item.to
      ? {
        id: `${item.name}-link`,
        onClick: (e: React.MouseEvent) => !disabled && !!item.menu?.length && this.onToggleSubmenu(e, item),
        to: item.path || item.to,
        className: ({ isActive, isPending, isTransitioning }: any) =>
          splitAndFlat(
            [
              isActive ? activeClasses : inactiveClasses,
              isPending ? pendingClasses : "",
              isTransitioning ? transitioningClasses : "",
              className,
              this.setActive(item.name, isActive),
            ],
            " "
          ).join(" "),
        strict: item.strict,
        end: item.end,
        disabled,
        style: {} as any,
      }
      : item.href
        ? {
          tag: "a",
          name: item.name,
          classes: splitAndFlat([className, inactiveClasses], " ").join(" "),
          disabled,
          style: {} as any,
          _props: {
            id: `${item.name}-link`,
            href: item.href,
            target: "_blank",
            onClick: (e: React.MouseEvent) => !disabled && !!item.menu?.length && this.onToggleSubmenu(e, item),
          },
        }
        : {
          tag: "span",
          name: item.name,
          classes: splitAndFlat([className, inactiveClasses], " ").join(" "),
          disabled,
          style: {} as any,
          _props: {
            id: `${item.name}-link`,
            onClick: (e: React.MouseEvent) => !disabled && !!item.menu?.length && this.onToggleSubmenu(e, item),
          },
        };

    const styleWrapCaret = { position: "relative" };
    if (!!item.menu?.length && open) {
      propsLink.style.paddingRight = "2.3rem";
    }

    const itemProps = {
      key: item.name,
      ...(item.itemProps || {}),
      ref: (ref: HTMLElement | null) => {
        if (ref) this.itemsRefs.current![item.name] = ref;
      },
      className: splitAndFlat(
        [
          item.itemClasses || this.props.itemClasses,
          this.activeElements[item.name] || item.hasAnActive ? "active" : "",
        ],
        " "
      ).join(" "),
    };

    return React.createElement(
      itemTag,
      itemProps,
      <>
        <div style={styleWrapCaret as any}>
          {item.path || item.to ? (
            <NavLink {...(propsLink as any)}>{innerNode}</NavLink>
          ) : (
            <Component {...(propsLink as any)}>{innerNode}</Component>
          )}
          {!!item.menu?.length && open && (
            <span
              className={splitAndFlat(
                [
                  "position-absolute top-50 end-0 translate-middle-y caret-icon p-1 cursor-pointer",
                  this.activeElements[item.name] || item.hasAnActive
                    ? item.activeCaretClasses || activeCaretClasses
                    : item.caretClasses || caretClasses,
                ],
                " "
              ).join(" ")}
              onClick={(e) => !disabled && this.onToggleSubmenu(e, item)}
            >
              <Icons icon={carets[item.name]} {...iconStyle} inline={false} className="rounded-circle" />
            </span>
          )}
          {!!item.menu?.length && !open && (
            <span
              className={splitAndFlat(
                [
                  "position-absolute top-50 end-0 translate-middle-y caret-icon p-1 cursor-pointer",
                  this.activeElements[item.name] || item.hasAnActive
                    ? item.activeCaretClasses || activeCaretClasses
                    : item.caretClasses || caretClasses,
                ],
                " "
              ).join(" ")}
              onClick={(e) => !disabled && this.onToggleFloating(e, item)}
            >
              <Icons
                icon="angle-right"
                {...iconStyle}
                inline={false}
                style={{ width: "1.8rem", padding: ".5rem", transform: "scale(.8)" }}
                className="rounded-circle"
              />
            </span>
          )}
        </div>
        {!!item.menu?.length &&
          (open ? (
            <div
              ref={(ref) => this.collapseRef(ref, item)}
              id={`${item.name}-collapse`}
              className="collapse"
            >
              {this.state.carets[item.name] === (this.props.caretIcons?.[0] ?? "angle-up") &&
                (item.menu as TItem[]).map((m, i) => this.link(m, i, item)).filter(Boolean)}
            </div>
          ) : (
            this.itemsRefs.current?.[item.name] && (
              <FloatingContainer
                name={`${item.name}Floating`}
                floatAround={this.itemsRefs.current[item.name]}
                placement="right"
                card={false}
                allowedPlacements={["right", "bottom", "top"]}
                classes={splitAndFlat([item.floatingClasses || floatingClasses], " ").join(" ")}
              >
                {(item.menu as TItem[]).map((m, i) => this.link(m, i, item)).filter(Boolean)}
              </FloatingContainer>
            )
          ))}
      </>
    );
  }

  /**
   * Renderiza el contenido del componente de navegación.
   * @param children Elementos secundarios a renderizar junto con el menú.
   * @returns Un fragmento React con los elementos del menú y sus submenús.
   */
  protected content(children: React.ReactNode = this.props.children): React.ReactNode {
    return (
      <>
        {(this.props.menu as TItem[] | undefined)?.map((m, i) => this.link(m, i)).filter(Boolean)}
        {children}
      </>
    );
  }

}
