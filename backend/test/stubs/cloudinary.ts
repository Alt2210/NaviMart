/**
 * Test-only stub for the `cloudinary` SDK.
 *
 * `cloudinary` is a declared dependency but the uploads module only needs it at
 * import time for app bootstrap; e2e suites here never exercise image uploads.
 * Wired via `moduleNameMapper` in test/jest-e2e.json so the full AppModule can
 * boot without the real (sometimes uninstalled) native package.
 */
export type UploadApiResponse = Record<string, unknown>;

export const v2 = {
  config: () => undefined,
  uploader: {
    upload_stream: () => ({ end: () => undefined }),
  },
};
