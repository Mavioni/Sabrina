import { join } from 'node:path'
import { cwd, env } from 'node:process'

import Vue from '@vitejs/plugin-vue'

import { playwright } from '@vitest/browser-playwright'
import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'

export default defineConfig(({ mode }) => {
  return {
    test: {
      // NOTICE:
      // Browser specs are routed to the `browser` sub-project below, but at
      // the workspace level (root `pnpm test:run`) vitest 4 does not always
      // recurse into nested `projects:` and falls back to the default include
      // glob, which would pull these into the forks pool and break with
      // `vitest/browser can be imported only inside the Browser Mode`.
      // Excluding here keeps both workspace-level and per-package runs green.
      // Run browser specs explicitly via:
      //   pnpm -F @proj-airi/stage-ui exec vitest run --project browser
      exclude: ['**/node_modules/**', '**/*.browser.test.ts', '**/*.browser.spec.ts'],
      projects: [
        {
          extends: true,
          test: {
            name: 'node',
            include: ['src/**/*.test.ts'],
            exclude: ['src/**/*.browser.test.ts'],
            env: loadEnv(mode, join(cwd(), 'packages', 'stage-ui'), ''),
          },
        },
        {
          extends: true,
          plugins: [
            Vue(),
          ],
          test: {
            name: 'browser',
            include: ['**/*.browser.{spec,test}.ts'],
            exclude: ['**/node_modules/**'],
            browser: {
              enabled: true,
              // NOTICE:
              // Default to headless so the browser project runs on CI and headless
              // dev sandboxes without an X server. Set VITEST_BROWSER_HEADED=1 for
              // interactive local runs to see the chromium window.
              headless: !env.VITEST_BROWSER_HEADED,
              provider: playwright(),
              instances: [
                { browser: 'chromium' },
              ],
            },
          },
        },
      ],
    },
  }
})
