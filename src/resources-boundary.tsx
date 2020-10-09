import * as React from 'react';
import { ResourcesContext } from './resources-context';

interface IResourcesBoundaryProps {
  children: React.ReactNode;
  cache?: Record<string, any>;
}

export function ResourcesBoundary({ children, cache = {} }: IResourcesBoundaryProps) {
  const [resources] = React.useState(cache);

  return <ResourcesContext.Provider value={resources}>{children}</ResourcesContext.Provider>;
}
