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
