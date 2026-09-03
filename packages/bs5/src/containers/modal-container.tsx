import React from "react";
import Modal, { ModalOptions } from "bootstrap/js/dist/modal";

import { eventHandler, splitAndFlat } from "@dblimp/core";

import Component, { ComponentProps, ComponentState } from "../component";

export interface ModalContainerProps extends ComponentProps {
  modal?: ModalOptions;
  modalClasses?: string;
  headerClasses?: string;
  bodyClasses?: string;
  footerClasses?: string;
  closeModalClasses?: string;
  moveElement?: boolean;
  headerTheme?: string | null;
  showClose?: boolean;
  open?: boolean;
}

export interface ModalContainerState extends ComponentState {
  showModal: boolean;
}

export default class ModalContainer extends Component<
  ModalContainerProps,
  ModalContainerState
> {
  //PATCH: se implementó un clone del elemento para colocarlo hasta el body, esta solución corrige cuando un modal se mete dentro de un contenedor flex que no permite acomodar el modal correctamente
  static jsClass = 'ModalContainer';
  static defaultProps = {
    ...Component.defaultProps,
    modal: {},
    modalClasses: '',
    headerClasses: '',
    bodyClasses: '',
    footerClasses: '',
    closeModalClasses: '',
    moveElement: false,
    headerTheme: null,
  }

  protected events: string[] = [
    'show',
    'shown',
    'hide',
    'hidden',
    'hidePrevented'
  ];
  protected modal?: Modal | null;

  constructor(props: ModalContainerProps) {
    super(props);
    this.state.showModal = !!props.open;
  }

  componentDidMount() {
    const { name } = this.props;
    eventHandler.subscribe('update.' + name, this.onUpdateModal, name);
  }

  componentWillUnmount() {
    const { name } = this.props;
    this.destroy();
    eventHandler.unsubscribe('update.' + name, name);
  }

  onEvent = (e: Event) => {
    const { name } = this.props;
    eventHandler.dispatch(name, { [name]: e.type.split('.')[0] });
  }

  onClickClose = (e: React.MouseEvent) => {
    this.modal?.hide();
  }

  onUpdateModal = ({ open: showModal }: { open: boolean }) => {
    if (!showModal) {
      return this.modal?.hide();
    }
    this.setState({ showModal });
  }

  destroy = () => {
    if (this.modal) {
      this.modal?.dispose();
      this.modal = null;
    }
    this.setState({ showModal: false });
  }

  onModalRef = (refOriginal: any) => {
    if (refOriginal) {
      const ref = this.props.moveElement ? refOriginal.cloneNode(true) : refOriginal;
      if (this.props.moveElement) refOriginal.style.display = 'none';
      this.modal = new Modal(ref, this.props.modal);
      this.events.forEach(event => {
        ref.addEventListener(event + '.bs.modal', this.onEvent, false);
      });
      ref.addEventListener('hidden.bs.modal', this.destroy, false);
      if (this.props.moveElement) document.body.appendChild(ref);
      this.modal.show();
    }
  }

  content(children: React.ReactNode = this.props.children) {
    const { modalClasses, name, showClose, headerClasses,
      bodyClasses, footerClasses, closeModalClasses, headerTheme } = this.props;
    const { showModal } = this.state;
    const cnModal = ['modal-dialog', modalClasses];
    const cg = (Array.isArray(children) ? children : [children]).reduce((reducer, childRaw) => {
      const child = childRaw as React.ReactNode & {
        props?: { container?: string; children?: any };
      };
      if (!child) return reducer;
      // Se separa el contenido según tipo de container header, body, footer o ninguno
      if (['string', 'number'].includes(typeof child)) {
        reducer.body.push(child);
        return reducer;
      }
      const childProps = child.props?.container
        ? child.props
        : child.props?.children?.props;
      const container = (childProps && reducer[childProps.container]) || reducer.content;
      container.push(child);
      return reducer;
    }, { header: [] as React.ReactNode[], body: [] as React.ReactNode[], footer: [] as React.ReactNode[], content: [] as React.ReactNode[] });
    return showModal && React.createElement('div',
      {
        ref: this.onModalRef,
        className: "modal fade",
        id: name + '-modal',
        tabIndex: "-1"
      },
      React.createElement('div',
        { className: cnModal.flat().join(' ') },
        React.createElement('div',
          { className: "modal-content" },
          showClose && !cg.header.length && React.createElement('button',
            {
              type: 'button',
              className: splitAndFlat([
                'btn-close position-absolute end-0 m-3',
                closeModalClasses
              ], ' ').join(' '),
              'aria-label': 'Close',
              'data-bs-dismiss': 'modal', style: { zIndex: 1 }
            }
          ),
          cg.content,
          !!cg.header.length && React.createElement('div',
            {
              className: splitAndFlat(['modal-header ', headerClasses]).join(' '),
              'data-bs-theme': headerTheme
            },
            showClose && React.createElement('button',
              {
                type: 'button',
                className: splitAndFlat([
                  'btn-close position-absolute end-0 m-3',
                  closeModalClasses
                ], ' ').join(' '),
                'aria-label': 'Close',
                'data-bs-dismiss': 'modal', style: { zIndex: 1 }
              }
            ),
            cg.header
          ),
          !!cg.body.length && React.createElement('div',
            { className: splitAndFlat(['modal-body ', bodyClasses], ' ').join(' ') },
            cg.body
          ),
          !!cg.footer.length && React.createElement('div',
            { className: splitAndFlat(['modal-footer ', footerClasses], ' ').join(' ') },
            cg.footer
          )
        )
      )
    );
  }
}