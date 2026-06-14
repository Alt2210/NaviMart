import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button', () => {
  it('renders its children', () => {
    render(<Button>Đăng nhập</Button>);
    expect(screen.getByRole('button', { name: /Đăng nhập/i })).toBeInTheDocument();
  });

  it('fires onClick when pressed', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Lưu</Button>);
    await userEvent.click(screen.getByRole('button', { name: /Lưu/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not fire onClick when disabled', async () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        Gửi
      </Button>,
    );
    await userEvent.click(screen.getByRole('button', { name: /Gửi/i }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders the icon glyph when provided', () => {
    render(<Button icon="arrow_forward">Tiếp</Button>);
    expect(screen.getByText('arrow_forward')).toBeInTheDocument();
  });
});
