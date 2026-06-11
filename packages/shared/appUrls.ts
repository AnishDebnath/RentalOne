const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

const browserOrigin = () => {
  if (typeof window === 'undefined') {
    return 'http://localhost';
  }

  return `${window.location.protocol}//${window.location.hostname}`;
};

const isLocalDevelopment = () => {
  if (typeof window === 'undefined') return false;
  const h = window.location.hostname;
  return (
    h === 'localhost' ||
    h === '127.0.0.1' ||
    // LAN / private ranges — still dev, still need port
    /^192\.168\./.test(h) ||
    /^10\./.test(h) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(h)
  );
};

const resolveAppUrl = (
  envValue: string | undefined,
  fallbackPort: number,
  productionPath = '',
) => {
  const configured = envValue?.trim();
  if (configured) {
    return trimTrailingSlash(configured);
  }

  return isLocalDevelopment()
    ? `${browserOrigin()}:${fallbackPort}`
    : `${browserOrigin()}${productionPath}`;
};

export const resolveAuthAppUrl = (envValue?: string) => resolveAppUrl(envValue, 5173);

export const resolveAdminAppUrl = (envValue?: string) =>
  resolveAppUrl(envValue, 5174, '/admin');

export const resolveClientAppUrl = (envValue?: string) => resolveAppUrl(envValue, 5173);
