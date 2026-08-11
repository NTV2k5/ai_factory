export const ENV = {
  AGYN_GATEWAY_URL: import.meta.env.VITE_AGYN_GATEWAY_URL || '/agyn-gateway',
  AGYN_ORGANIZATION_ID: import.meta.env.VITE_AGYN_ORGANIZATION_ID || '',
  AGYN_TOKEN: import.meta.env.VITE_AGYN_TOKEN || '',
  ENABLE_MOCK_FALLBACK: import.meta.env.VITE_ENABLE_MOCK_FALLBACK === 'true',
  APP_NAME: 'AI Factory Agent Platform',
  VERSION: '1.0.0',
};
