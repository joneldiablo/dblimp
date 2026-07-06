import React from 'react';
import { render, screen } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SideNavigation, { SideNavigationItem } from '../navigation/side-navigation';

test('toggle stick mode on click', () => {
  const menu: SideNavigationItem[] = [
    { path: '/', label: 'Home', icon: 'house' }
  ];
  render(
    <MemoryRouter>
      <SideNavigation menu={menu} />
    </MemoryRouter>
  );

  const wrapper = screen.getByRole('list').parentElement as HTMLElement;
  expect(wrapper.className).not.toContain('stick');
  fireEvent.click(wrapper.querySelector('.wrap-collapse-arrow') as HTMLElement);
  expect(wrapper.className).toContain('stick');
});
