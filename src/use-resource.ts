import { useEffect, useRef } from 'react';

import { isArrayEqueal } from './is-array-equal';
import { useResources } from './resources-context';
import { useForceUpdate } from './use-force-update';

export type Resource<T> = { read: () => T; refresh: () => void };

export function useResource<T, D extends unknown[]>(
  id: string,
  service: (...args: D) => Promise<T>,
  dependencies: D
): Resource<T> {
  const resources = useResources();
  const update = useForceUpdate();

  const prevDependencies = useRef(dependencies);

  useEffect(() => {
    return () => {
      delete resources[id];
    };
  }, []);

  const getResource = () => {
    resources[id] = {
      status: 'PENDING',
      result: service(...dependencies)
        .then((result) => {
          resources[id] = { status: 'SUCCESS', result };
        })
        .catch((error) => {
          resources[id] = { status: 'ERROR', result: error };
        })
    };
  };

  return {
    read: () => {
      if (!resources[id] || !isArrayEqueal(prevDependencies.current, dependencies)) {
        prevDependencies.current = dependencies;
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
