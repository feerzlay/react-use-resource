import * as React from 'react';

export const Suspense: React.FC<{ fallback: NonNullable<React.ReactNode> | null }> = ({
  children,
  fallback
}) => {
  if (process.env.SSR) {
    return <>{children}</>;
  }
  return <React.Suspense fallback={fallback}>{children}</React.Suspense>;
};
