import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react';
import App from './App';

test('renders game board', () => {
  render(<App />);
  const playBtn = screen.getByText('play');
  expect(playBtn).toBeInTheDocument();
});
