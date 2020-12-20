import { useEffect } from 'react';

import { isArrayEqual } from './is-array-equal';
import { useResources } from './resources-context';
import { useForceUpdate } from './use-force-update';

export type Resource<T> = {
  /**
   * Returns resolved data or throws a promise for `Suspense` to catch.
   */
  read: () => T;
  /**
   * Refresh resource.
   */
  refresh: () => void;
};

/**
 * Convert a promise returning function into a resource.
 * @param id Resource ID.
 * @param service A promise returning function or a tuple of a promise returning function and a cancellation function.
 * @param dependencies Dependency list.
 */
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
