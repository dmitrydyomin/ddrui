import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { APIError, API_BASE_URL, useAPI } from '../auth/api';

export const useItem = <T extends { id: number }, F = Partial<T>>(
  url: string,
  id: string | undefined,
  clientURL?: string,
) => {
  const creating = id === 'create';
  const { data, mutate } = useAPI<T>(
    typeof id === 'undefined' || creating ? undefined : `${url}/${id}`,
  );

  const mounted = useRef(true);
  useEffect(
    () => () => {
      mounted.current = false;
    },
    [],
  );

  let navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const save = useCallback(
    async (data: F) => {
      try {
        setSaving(true);

        const res = await fetch(
          `${API_BASE_URL}${url}${creating ? '' : `/${id}`}`,
          {
            method: creating ? 'post' : 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            credentials: 'include',
          },
        );

        if (!res.ok) {
          throw APIError.formResponse(res);
        }

        if (res.ok) {
          toast.success('Сохранено');
        }

        if (creating && res.ok) {
          const updated = await res.json();
          navigate(`${clientURL || url}/${updated.id}`);
        }

        // trigger a revalidation (refetch) to make sure our local data is correct
        if (!creating) {
          mutate(await res.json());
        }
      } catch (err: any) {
        toast.error(`Ошибка: ${err.message}`);
      }
    },
    [clientURL, creating, id, mutate, navigate, url],
  );

  const del = useCallback(async () => {
    if (!id || creating) {
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}${url}/${id}`, {
        method: 'delete',
      });
      if (!res.ok) {
        throw APIError.formResponse(res);
      }
      navigate(`${clientURL || url}`);
    } catch (err: any) {
      toast.error(`Ошибка: ${err.message}`);
    }
  }, [clientURL, creating, id, navigate, url]);

  return { data, mutate, save, saving, del };
};
