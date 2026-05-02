import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // NOTICE:
    // Workspace-level runs (`pnpm test:run`) do not recurse into a child
    // project's nested `projects:` config in vitest 4 — they pick up files
    // matching the child's include glob into the root's forks pool, which
    // breaks browser-mode tests (`*.browser.test.ts`) that import
    // `vitest/browser`. Exclude browser specs here so the root run stays
    // green; run them per-package with
    // `pnpm -F @proj-airi/stage-ui exec vitest run`.
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/*.browser.test.ts',
      '**/*.browser.spec.ts',
    ],
    // NOTICE:
    // `vishot-runner-browser` integration tests boot a real Vite dev server
    // and `rm -r` the served fixture in afterEach. In-flight Vite `resolveId`
    // promises reject with `ERR_CLOSED_SERVER` after the test asserts —
    // benign teardown noise that vitest counts as suite-level errors and
    // exits 1 with. The same flag is set in
    // `packages/vishot-runner-browser/vitest.config.ts` for per-package runs;
    // setting it here covers the workspace `pnpm test:run` path because
    // child project flags are not propagated to the root pool in vitest 4.
    // Removal condition: when `captureBrowserRoots` awaits in-flight
    // resolveId promises before returning, or when Vite no longer rejects
    // resolveId during shutdown.
    dangerouslyIgnoreUnhandledErrors: true,
    projects: [
      'apps/server',
      'apps/ui-server-auth',
      'apps/stage-tamagotchi',
      'packages/audio-pipelines-transcribe',
      'packages/cap-vite',
      'packages/core-agent',
      'packages/vishot-runner-browser',
      'packages/plugin-sdk',
      'packages/plugin-sdk-tamagotchi',
      'packages/server-runtime',
      'packages/server-sdk',
      'packages/stage-shared',
      'packages/stage-ui',
      'packages/vishot-runtime',
      'packages/vite-plugin-warpdrive',
    ],
  },
})
