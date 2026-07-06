import React from 'react';
import { render } from '@testing-library/react';
import fields from '../fields';

const { Field, NewPasswordField, ...rest } = fields as Record<string, React.ComponentType<any>>;

const extraProps: Record<string, any> = {
  RadioField: { options: [{ label: 'One', value: 1 }] },
  radio: { options: [{ label: 'One', value: 1 }] },
  CheckboxField: { options: [{ label: 'One', value: 1 }] },
  checkbox: { options: [{ label: 'One', value: 1 }] },
};

describe('field components render', () => {
  for (const [name, Comp] of Object.entries(rest)) {
    test(`renders ${name}`, () => {
      expect(() =>
        render(<Comp name="test" label="Test" {...(extraProps[name] || {})} />)
      ).not.toThrow();
    });
  }
});
