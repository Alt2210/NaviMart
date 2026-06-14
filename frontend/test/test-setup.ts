import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// react-testing-library only auto-cleans when test globals are enabled — do it explicitly.
afterEach(() => {
  cleanup();
});
