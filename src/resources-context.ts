import { createContext, useContext } from 'react';

export const ResourcesContext = createContext<Record<string, any> | null>(null);

export function useResources() {
  const resources = useContext(ResourcesContext);

  if (resources === null) {
    throw new Error('No provider for ResourcesContext');
  }

  return resources;
}
