export type ServerResponse<T> = { data: T } | { error: string };

export function extractData<T>(response: ServerResponse<T>) {
  if ("data" in response) return response.data;
  return undefined;
}

export function extractError<T>(response: ServerResponse<T>) {
  if ("error" in response) return response.error;
  return undefined;
}
