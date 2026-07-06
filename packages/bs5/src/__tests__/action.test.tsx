import React from 'react';
import { render, fireEvent } from '@testing-library/react';
jest.mock('../actions/action', () => (props: any) => <button {...props} />);
import Action from '../actions/action';

function setup(props: any) {
  const navigate = jest.fn();
  const utils = render(<Action {...props} navigate={navigate} />);
  return { ...utils, navigate };
}

test('action component renders', () => {
  expect(() => setup({ type: 'button', name: 'go' })).not.toThrow();
});
