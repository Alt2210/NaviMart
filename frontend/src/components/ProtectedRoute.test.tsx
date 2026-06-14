import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';

vi.mock('../contexts/AuthContext', () => ({ useAuth: vi.fn() }));

const mockUseAuth = useAuth as Mock;

function renderGuard(requireAdmin = false) {
  return render(
    <MemoryRouter initialEntries={['/secret']}>
      <Routes>
        <Route element={<ProtectedRoute requireAdmin={requireAdmin} />}>
          <Route path="/secret" element={<div>Secret Content</div>} />
        </Route>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/home" element={<div>Home Page</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ProtectedRoute', () => {
  beforeEach(() => mockUseAuth.mockReset());

  it('redirects unauthenticated users to /login', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, user: null });
    renderGuard();
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Secret Content')).not.toBeInTheDocument();
  });

  it('renders the protected outlet for an authenticated user', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { role: 'user' },
    });
    renderGuard();
    expect(screen.getByText('Secret Content')).toBeInTheDocument();
  });

  it('redirects a non-admin away from an admin-only route', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { role: 'user' },
    });
    renderGuard(true);
    expect(screen.getByText('Home Page')).toBeInTheDocument();
    expect(screen.queryByText('Secret Content')).not.toBeInTheDocument();
  });

  it('allows an admin into an admin-only route', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { role: 'admin' },
    });
    renderGuard(true);
    expect(screen.getByText('Secret Content')).toBeInTheDocument();
  });
});
