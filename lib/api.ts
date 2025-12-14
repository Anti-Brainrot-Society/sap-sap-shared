export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestOptions<TBody = unknown> extends RequestInit {
  method?: HttpMethod;
  body?: TBody extends undefined ? undefined : BodyInit | null;
  headers?: Record<string, string>;
}

export async function fetchJson<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });
  if (!res.ok) {
    let message = `Request failed with ${res.status}`;
    try {
      const err = await res.json();
      if (err?.message) message = err.message;
    } catch {}
    throw new Error(message);
  }
  return (await res.json()) as T;
}

