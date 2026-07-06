import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BrandNavigation from '../navigation/brand-navigation';

test('renders brand navigation', () => {
  expect(() =>
    render(
      <MemoryRouter>
        <BrandNavigation name="nav" brandName="MyBrand" logoSrc="logo.png" path="/home" slogan="My slogan" />
      </MemoryRouter>
    )
  ).not.toThrow();
});
