import { useCallback } from 'react';
import useSWR, { useSWRConfig } from 'swr';

export const API_BASE_URL = '/api';

export class APIError extends Error {
  status = 0;
  static formResponse(res: Pick<Response, 'status' | 'statusText'>) {
    const err = new this();
    err.status = res.status;
    err.message = res.statusText;
    return err;
  }
}

export const isAPIError = (err: unknown): err is APIError => {
  return typeof (err as APIError).status === 'number';
};

export const fetcher = async (url: string) => {
  const res = await fetch(`${API_BASE_URL}${url}`);
  if (!res.ok) {
    throw APIError.formResponse(res);
  }
  return res.json();
};

export const useAPI = <T>(url?: string) => {
  const { data, mutate } = useSWR<T>(url, fetcher, { suspense: true });
  const { mutate: mutateKey } = useSWRConfig();

  const refresh = useCallback(() => {
    mutateKey(url);
  }, [mutateKey, url]);

  return {
    data: data as T,
    mutate,
    refresh,
  };
};
