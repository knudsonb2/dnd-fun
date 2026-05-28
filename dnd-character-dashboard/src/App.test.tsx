import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders dice roller navigation link', () => {
  render(<App />);
  const linkElement = screen.getByText(/dice roller/i);
  expect(linkElement).toBeInTheDocument();
});
