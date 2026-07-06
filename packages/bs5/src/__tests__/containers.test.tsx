import React from 'react';
import { render } from '@testing-library/react';
import {
  AlertContainer,
  CardContainer,
  ModalContainer,
  OffcanvasContainer,
  PanelContainer,
  GridContainer,
  TabsContainer,
  ScrollContainer,
  SlideContainer,
  FooterContainer,
  ModalButtonContainer,
  DropdownButtonContainer,
} from '../containers';

jest.mock('bootstrap/js/dist/modal', () => {
  return jest.fn().mockImplementation(() => ({ show: jest.fn(), hide: jest.fn(), dispose: jest.fn() }));
});

jest.mock('bootstrap/js/dist/offcanvas', () => {
  return jest.fn().mockImplementation(() => ({ show: jest.fn(), hide: jest.fn(), dispose: jest.fn() }));
});

jest.mock('bootstrap/js/dist/dropdown', () => {
  return jest.fn().mockImplementation(() => ({ toggle: jest.fn(), show: jest.fn(), hide: jest.fn(), dispose: jest.fn() }));
});

jest.mock('@splidejs/react-splide', () => ({
  Splide: ({ children }: any) => <div>{children}</div>,
  SplideSlide: ({ children }: any) => <div>{children}</div>
}));

describe('container components render', () => {
  const cases: Array<[string, React.ComponentType<any>, any]> = [
    ['AlertContainer', AlertContainer as any, { name: 'alert', label: 'Info' }],
    ['CardContainer', CardContainer as any, { name: 'card' }],
    ['ModalContainer', ModalContainer as any, { name: 'modal' }],
    ['OffcanvasContainer', OffcanvasContainer as any, { name: 'offcanvas' }],
    ['PanelContainer', PanelContainer as any, { name: 'panel' }],
    ['GridContainer', GridContainer as any, { name: 'grid' }],
    ['TabsContainer', TabsContainer as any, { name: 'tabs' }],
    ['ScrollContainer', ScrollContainer as any, { name: 'scroll' }],
    ['SlideContainer', SlideContainer as any, { name: 'slide' }],
    ['FooterContainer', FooterContainer as any, { name: 'footer' }],
    ['ModalButtonContainer', ModalButtonContainer as any, { name: 'modalBtn', target: 'modal' }],
    ['DropdownButtonContainer', DropdownButtonContainer as any, { name: 'dropdownBtn', menu: [] }],
  ];

  test.each(cases)('renders %s', (_label, Comp, props) => {
    expect(() => render(<Comp {...props} />)).not.toThrow();
  });
});
