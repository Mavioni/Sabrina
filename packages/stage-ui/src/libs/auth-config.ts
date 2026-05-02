// Centralized OIDC client configuration for the web platform.
// Electron and Pocket have their own configs due to different client IDs and redirect strategies.

export const OIDC_CLIENT_ID = import.meta.env.VITE_OIDC_CLIENT_ID || 'airi-stage-web'

/**
 * Resolved at call time so module load works in non-browser environments
 * (Vitest node pool, SSR). Throws if invoked outside a browser, which is
 * the correct behavior — the URI is only meaningful for redirect flows.
 */
export function getOIDCRedirectURI(): string {
  return `${window.location.origin}/auth/callback`
}
