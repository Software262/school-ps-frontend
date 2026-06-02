import { env } from '@shared/config';

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const headers = new Headers(options?.headers);
  if (!headers.has('Content-Type') && !(options?.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${env.baseApi}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = `API error: ${response.statusText}`;
    try {
      const errData = (await response.json()) as {
        detail?: string | { msg?: string }[] | Record<string, unknown>;
      };
      if (errData.detail) {
        if (typeof errData.detail === 'string') {
          errorMsg = errData.detail;
        } else if (Array.isArray(errData.detail)) {
          errorMsg = errData.detail.map((e) => e.msg ?? JSON.stringify(e)).join(', ');
        } else {
          errorMsg = JSON.stringify(errData.detail);
        }
      }
    } catch {
      // Ignorar si no es JSON
    }
    throw new Error(errorMsg);
  }
  

  return (await response.json()) as T;
}
