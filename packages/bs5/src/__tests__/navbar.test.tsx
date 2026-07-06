import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar, { NavbarMenuItem } from '../navigation/navbar';

test('renders menu items', () => {
  const menu: Record<string, NavbarMenuItem> = {
    home: { path: '/', label: 'Home' },
    about: { path: '/about', label: 'About' }
  };

  render(
    <MemoryRouter>
      <Navbar menu={menu} logo="logo.png" site={<span>Site</span>} />
    </MemoryRouter>
  );

  expect(screen.getByRole('img')).toHaveAttribute('src', 'logo.png');
  expect(screen.getByText('Home')).toBeInTheDocument();
  expect(screen.getByText('About')).toBeInTheDocument();
});
