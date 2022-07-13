import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import useSWR, { useSWRConfig } from 'swr';

import { APIError, API_BASE_URL } from '../auth/api';

const fetcher = async (url: string) => {
  const res = await fetch(`${API_BASE_URL}${url}`);
  if (!res.ok) {
    if (res.status === 401) {
      return null;
    }
    throw APIError.formResponse(res);
  }
  return res.json();
};

export const useUser = () =>
  useSWR<{ id?: number; name: string }>('/auth', fetcher, { suspense: true });

export const useLogin = () => {
  const [error, setError] = useState<string | undefined>();
  const { mutate } = useSWRConfig();

  const login = useCallback(
    async (data: { username: string; password: string; remember: boolean }) => {
      try {
        const res = await fetch(API_BASE_URL + '/auth/login', {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          credentials: 'include',
        });
        setError(
          res.ok
            ? undefined
            : res.status === 403
            ? 'Invalid username or password'
            : res.statusText,
        );
        if (res.ok) {
          mutate('/auth');
        }
      } catch (err: any) {
        setError(err.message);
      }
    },
    [mutate],
  );

  return { error, login };
};

export const useLogout = () => {
  const { mutate } = useSWRConfig();

  const logout = useCallback(async () => {
    try {
      const res = await fetch(API_BASE_URL + '/auth/logout', {
        method: 'post',
        credentials: 'include',
      });
      if (res.ok) {
        mutate('/auth');
      } else {
        toast.error(res.statusText);
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  }, [mutate]);

  return logout;
};
