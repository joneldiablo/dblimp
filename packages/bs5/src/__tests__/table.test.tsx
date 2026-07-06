import React from 'react';
import { render, screen } from '@testing-library/react';
import Table from '../tables/table';

const TableComp = Table as unknown as React.ComponentType<any>;

test('renders table component', () => {
  const columns = { name: { label: 'Name' } };
  const data = [{ id: 1, name: 'Alice' }];
  expect(() => render(<TableComp name="tbl" columns={columns} data={data} />)).not.toThrow();
});
