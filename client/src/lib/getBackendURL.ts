export const getBackendURL = () => {
  return typeof window === 'undefined' && process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_BACKEND_URL
    : 'http://localhost:3001';
};
