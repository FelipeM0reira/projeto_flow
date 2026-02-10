import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import App from './App';

// Mock services
jest.mock('./services/api', () => ({
  authAPI: {
    me: jest.fn().mockRejectedValue(new Error('Not authenticated')),
  },
  dashboardAPI: { get: jest.fn() },
  projectAPI: { list: jest.fn() },
  taskAPI: { list: jest.fn() },
}));

describe('App', () => {
  test('renders login page when not authenticated', async () => {
    render(<App />);
    // Should show login since no authenticated user
    const loginElements = await screen.findAllByText(/Entrar|Bem-vindo/i);
    expect(loginElements.length).toBeGreaterThan(0);
  });

  test('renders ProjetoFlow branding', async () => {
    render(<App />);
    const brandElements = await screen.findAllByText(/ProjetoFlow/i);
    expect(brandElements.length).toBeGreaterThan(0);
  });
});
