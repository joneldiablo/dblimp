import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HeaderNavigation from '../navigation/header-navigation';
import CardListNavigation from '../navigation/card-list-navigation';
import CardsNavigation from '../navigation/cards-navigation';

describe('additional navigation components render', () => {
  const cases: Array<[string, React.ComponentType<any>]> = [
    ['HeaderNavigation', HeaderNavigation as any],
    ['CardListNavigation', CardListNavigation as any],
    ['CardsNavigation', CardsNavigation as any],
  ];

  test.each(cases)('renders %s', (_label, Comp) => {
    expect(() =>
      render(
        <MemoryRouter>
          <Comp name="nav" />
        </MemoryRouter>
      )
    ).not.toThrow();
  });
});
