import { useEffect } from 'react';

import { isArrayEqual } from './is-array-equal';
import { useResources } from './resources-context';
import { useForceUpdate } from './use-force-update';

export type Resource<T> = { read: () => T; refresh: () => void };

export function useResource<T, D extends unknown[]>(
  id: string,
  service: (...args: D) => Promise<T> | [Promise<T>, () => void],
  dependencies: D
): Resource<T> {
  const resources = useResources();
  const update = useForceUpdate();

  useEffect(() => {
    return () => {
      delete resources[id];
    };
  }, []);

  const getResource = () => {
    if (resources[id] && resources[id].status === 'PENDING' && resources[id].cancel) {
      resources[id].isCanceled = true;
      resources[id].cancel();
    }

    const s = service(...dependencies);
    const promise = Array.isArray(s) ? s[0] : s;
    const cancel = Array.isArray(s) ? s[1] : null;

    resources[id] = {
      dependencies,
      status: 'PENDING',
      result: promise
        .then((result) => {
          resources[id] = { ...resources[id], status: 'SUCCESS', result };
        })
        .catch((result) => {
          if (resources[id].isCanceled) {
            resources[id] = { ...resources[id], isCanceled: false };
          } else {
            resources[id] = { ...resources[id], status: 'ERROR', result };
          }
        }),
      cancel,
      isCanceled: resources[id]?.isCanceled || false
    };
  };

  return {
    read: () => {
      if (!(resources[id] && isArrayEqual(resources[id].dependencies, dependencies))) {
        getResource();
      }

      switch (resources[id].status) {
        case 'PENDING':
        case 'ERROR':
          throw resources[id].result;
        case 'SUCCESS':
          return resources[id].result;
      }
    },
    refresh: () => {
      getResource();
      update();
    }
  };
}
