import React from 'react';
import { render, screen } from '@testing-library/react';
import Field from '../fields/field';

const FieldComp = Field as unknown as React.ComponentType<any>;

test('renders field component', () => {
  expect(() => render(<FieldComp name="email" label="Email" />)).not.toThrow();
});
