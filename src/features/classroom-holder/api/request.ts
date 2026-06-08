export const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const REQUEST_TIMEOUT_MS = 10000;

export const withTimeout = async <T>(request: (signal: AbortSignal) => Promise<T>): Promise<T> => {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => {
    controller.abort();
  }, REQUEST_TIMEOUT_MS);

  try {
    return await request(controller.signal);
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('La solicitud tardo demasiado. Intente nuevamente.', { cause: error });
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
};
