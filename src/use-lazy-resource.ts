import { useEffect } from 'react';

import { isArrayEqual } from './is-array-equal';
import { Resource } from './resource';
import { useResources } from './resources-context';
import { useForceUpdate } from './use-force-update';

/**
 * Convert a promise returning function into a lazy resource.
 * @param id Resource ID.
 * @param service A promise returning function or a tuple of a promise returning function and a cancellation function.
 * @param dependencies Dependency list.
 */
export function useLazyResource<T, D extends unknown[]>(
  id: string,
  service: (...args: D) => Promise<T> | [Promise<T>, () => void],
  dependencies: D
): Resource<T> {
  const { resources, getResource } = useResources();
  const update = useForceUpdate();

  useEffect(() => {
    return () => {
      delete resources[id];
    };
  }, []);

  return {
    read: () => {
      if (!(resources[id] && isArrayEqual(resources[id].dependencies, dependencies))) {
        getResource(id, service, dependencies);
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
      getResource(id, service, dependencies);
      update();
    }
  };
}
