import { env } from '@shared/config';

const STATUS_MESSAGES: Record<number, string> = {
  401: 'Sin permisos o sesion invalida',
  403: 'Sin permisos o sesion invalida',
  404: 'Ruta no encontrada',
  422: 'Datos invalidos',
  500: 'Error interno del servidor',
};

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const headers = new Headers(options?.headers);
  if (!headers.has('Content-Type') && !(options?.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  let response: Response;
  try {
    response = await fetch(`${env.baseApi}${endpoint}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error('No se pudo conectar con el backend');
  }

  if (!response.ok) {
    let errorMsg = STATUS_MESSAGES[response.status] ?? `API error: ${response.statusText}`;
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
