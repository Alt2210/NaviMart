import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DialogProvider, useDialog } from './DialogContext';

describe('DialogContext', () => {
  it('throws when useDialog is used outside a provider', () => {
    // Silence the expected React error boundary log.
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useDialog())).toThrow(
      /must be used within a DialogProvider/,
    );
    spy.mockRestore();
  });

  it('showAlert renders the alert modal and closes on dismiss', async () => {
    const user = userEvent.setup();
    const { result } = renderHook(() => useDialog(), { wrapper: DialogProvider });

    act(() => result.current.showAlert('Heads up'));
    expect(screen.getByText('Heads up')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Đóng' }));
    expect(screen.queryByText('Heads up')).not.toBeInTheDocument();
  });

  describe('showConfirm', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it('runs the callback on accept and clears the message after the animation delay', () => {
      const onConfirm = vi.fn();
      const { result } = renderHook(() => useDialog(), {
        wrapper: DialogProvider,
      });

      act(() => result.current.showConfirm('Delete this?', onConfirm));
      expect(screen.getByText('Delete this?')).toBeInTheDocument();

      // Click "Đồng ý"
      act(() => {
        screen.getByRole('button', { name: 'Đồng ý' }).click();
      });
      expect(onConfirm).toHaveBeenCalledTimes(1);

      // Modal hides immediately; message string is cleared after 200ms.
      expect(screen.queryByText('Delete this?')).not.toBeInTheDocument();
      act(() => vi.advanceTimersByTime(200));
    });

    it('does not run the callback when cancelled', () => {
      const onConfirm = vi.fn();
      const { result } = renderHook(() => useDialog(), {
        wrapper: DialogProvider,
      });

      act(() => result.current.showConfirm('Sure?', onConfirm));
      act(() => {
        screen.getByRole('button', { name: 'Hủy' }).click();
      });

      expect(onConfirm).not.toHaveBeenCalled();
      act(() => vi.advanceTimersByTime(200));
    });
  });

  it('confirm modal shows the standard title', () => {
    render(
      <DialogProvider>
        <ConfirmTrigger />
      </DialogProvider>,
    );
    act(() => {
      screen.getByRole('button', { name: 'trigger' }).click();
    });
    expect(screen.getByText('Xác nhận')).toBeInTheDocument();
  });
});

function ConfirmTrigger() {
  const { showConfirm } = useDialog();
  return (
    <button onClick={() => showConfirm('Body text', () => {})}>trigger</button>
  );
}
