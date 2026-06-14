import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';
import { useAuth } from '../contexts/AuthContext';

vi.mock('../contexts/AuthContext', () => ({ useAuth: vi.fn() }));

// Keep the real router (Link needs it) but spy on navigation.
const navigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => navigate };
});

const mockUseAuth = useAuth as Mock;
const login = vi.fn();

function renderLogin() {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>,
  );
}

describe('Login page', () => {
  beforeEach(() => {
    mockUseAuth.mockReset();
    navigate.mockReset();
    login.mockReset();
    mockUseAuth.mockReturnValue({ login });
  });

  it('shows a validation message and does not call login when fields are empty', async () => {
    renderLogin();
    await userEvent.click(screen.getByRole('button', { name: /Đăng nhập/i }));

    expect(
      screen.getByText('Vui lòng nhập đầy đủ thông tin đăng nhập.'),
    ).toBeInTheDocument();
    expect(login).not.toHaveBeenCalled();
  });

  it('logs in and navigates a regular user to /home', async () => {
    login.mockResolvedValue({ role: 'user' });
    renderLogin();

    await userEvent.type(
      screen.getByPlaceholderText('Nhập số điện thoại hoặc email'),
      'me@example.com',
    );
    await userEvent.type(screen.getByPlaceholderText('Nhập mật khẩu'), 'pw');
    await userEvent.click(screen.getByRole('button', { name: /Đăng nhập/i }));

    await waitFor(() =>
      expect(login).toHaveBeenCalledWith('me@example.com', 'pw', false),
    );
    expect(navigate).toHaveBeenCalledWith('/home');
  });

  it('navigates an admin to /admin', async () => {
    login.mockResolvedValue({ role: 'admin' });
    renderLogin();

    await userEvent.type(
      screen.getByPlaceholderText('Nhập số điện thoại hoặc email'),
      'admin@example.com',
    );
    await userEvent.type(screen.getByPlaceholderText('Nhập mật khẩu'), 'pw');
    await userEvent.click(screen.getByRole('button', { name: /Đăng nhập/i }));

    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/admin'));
  });

  it('surfaces the error message when login fails', async () => {
    login.mockRejectedValue(new Error('Sai thông tin đăng nhập'));
    renderLogin();

    await userEvent.type(
      screen.getByPlaceholderText('Nhập số điện thoại hoặc email'),
      'me@example.com',
    );
    await userEvent.type(screen.getByPlaceholderText('Nhập mật khẩu'), 'wrong');
    await userEvent.click(screen.getByRole('button', { name: /Đăng nhập/i }));

    expect(
      await screen.findByText('Sai thông tin đăng nhập'),
    ).toBeInTheDocument();
    expect(navigate).not.toHaveBeenCalled();
  });
});
