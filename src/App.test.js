import { render, screen } from '@testing-library/react';
import App from './App';

test('renders game board', () => {
  render(<App />);
  const gameId = screen.getByID('game');
  expect(gameId).toBeInTheDocument();
});
