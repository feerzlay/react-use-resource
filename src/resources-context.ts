import { createContext, useContext } from 'react';

export const ResourcesContext = createContext<Record<string, any> | null>(null);

export function useResources() {
  const resources = useContext(ResourcesContext);

  if (resources === null) {
    throw new Error('No provider for ResourcesContext');
  }

  const getResource = <T, D extends unknown[]>(
    id: string,
    service: (...args: D) => Promise<T> | [Promise<T>, () => void],
    dependencies: D
  ) => {
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

  return { resources, getResource };
}
