import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navigation, { NavigationItem } from '../navigation/navigation';

test('renders navigation component', () => {
  const menu: NavigationItem[] = [
    { name: 'home', label: 'Home', path: '/', iconClasses: '', title: 'Home' }
  ];
  expect(() =>
    render(
      <MemoryRouter initialEntries={['/']}>
        <Navigation name="nav" menu={menu} location={{ pathname: '/' }} />
      </MemoryRouter>
    )
  ).not.toThrow();
});

test('shows navigation collapsed without error', () => {
  const menu: NavigationItem[] = [
    { name: 'parent', label: 'Parent', icon: 'folder', iconClasses: '', title: 'Parent', menu: [
      { name: 'child', label: 'Child', path: '/child', iconClasses: '', title: 'Child' }
    ] }
  ];
  expect(() =>
    render(
      <MemoryRouter initialEntries={['/']}>
        <Navigation name="nav" menu={menu} location={{ pathname: '/' }} open={false} />
      </MemoryRouter>
    )
  ).not.toThrow();
});
