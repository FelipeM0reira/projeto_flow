import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import api from './services/api';

jest.mock('./services/api');

describe('App Component', () => {
  beforeEach(() => {
    api.getUsers.mockResolvedValue({
      data: {
        results: [
          { id: 1, username: 'user1', email: 'user1@test.com', theme_preference: 'light' },
          { id: 2, username: 'user2', email: 'user2@test.com', theme_preference: 'dark' }
        ]
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders app title', async () => {
    render(<App />);
    const titleElement = screen.getByText(/Theme Switcher Application/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('loads and displays users', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('user1')).toBeInTheDocument();
      expect(screen.getByText('user2')).toBeInTheDocument();
    });
  });

  test('theme switcher is disabled when no user is selected', () => {
    render(<App />);
    const themeSwitcher = screen.getByRole('button', { name: /Modo Claro|Modo Escuro/i });
    expect(themeSwitcher).toBeDisabled();
  });

  test('creates a new user', async () => {
    const user = userEvent.setup();
    api.createUser.mockResolvedValue({ data: { id: 3, username: 'newuser' } });
    
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('user1')).toBeInTheDocument();
    });

    const usernameInput = screen.getByPlaceholderText(/Digite o nome de usuário/i);
    const emailInput = screen.getByPlaceholderText(/Digite o email/i);
    const passwordInput = screen.getByPlaceholderText(/Digite a senha/i);
    const submitButton = screen.getByRole('button', { name: /Criar Usuário/i });

    await user.type(usernameInput, 'newuser');
    await user.type(emailInput, 'new@test.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(api.createUser).toHaveBeenCalledWith({
        username: 'newuser',
        email: 'new@test.com',
        password: 'password123',
        theme_preference: 'light'
      });
    });
  });
});
