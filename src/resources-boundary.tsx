import * as React from 'react';
import { ResourcesContext } from './resources-context';

interface IResourcesBoundaryProps {
  children: React.ReactNode;
}

export function ResourcesBoundary({ children }: IResourcesBoundaryProps) {
  const [resources] = React.useState({});

  return <ResourcesContext.Provider value={resources}>{children}</ResourcesContext.Provider>;
}
