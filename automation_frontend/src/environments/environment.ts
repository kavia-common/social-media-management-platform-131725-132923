const g = typeof globalThis !== 'undefined' ? (globalThis as any) : undefined;
const runtimeApi = g && g.__API_BASE_URL__ ? g.__API_BASE_URL__ : '/api';

export const environment = {
  production: false,
  // PUBLIC_INTERFACE
  /** Base URL for automation_backend API. Set via environment variable at deploy time. */
  API_BASE_URL: runtimeApi,
  THEME: {
    primary: '#1da1f2',
    secondary: '#4267b2',
    accent: '#e1306c',
    lightBg: '#ffffff',
    lightSurface: '#f7f9fc',
    text: '#0f172a',
    textMuted: '#475569',
    border: '#e2e8f0'
  }
};
