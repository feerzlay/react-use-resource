<h1 align="center">react-use-resource</h1>

Convert a promise returning function into a suspense compatible resource.

[![license](https://img.shields.io/github/license/feerzlay/react-use-resource)](https://github.com/feerzlay/react-use-resource/blob/master/LICENSE)
[![npm](https://img.shields.io/npm/v/react-use-resource)](https://www.npmjs.com/package/react-use-resource)
[![npm downloads](https://img.shields.io/npm/dm/react-use-resource)](https://www.npmjs.com/package/react-use-resource)
[![Average time to resolve an issue](https://isitmaintained.com/badge/resolution/feerzlay/react-use-resource.svg)](https://isitmaintained.com/project/feerzlay/react-use-resource)

## Installation

```bash
npm install react-use-resource
```

```bash
yarn add react-use-resource
```

## Usage

Wrap an application into a `ResourcesBoundary` component. All request results will be cached in there.

```tsx
import { Suspense } from 'react';
import { ResourcesBoundary } from 'react-use-resource';

export function Application() {
  return (
    <ResourcesBoundary>
      <Suspense fallback="Loading...">
        <User />
      </Suspense>
    </ResourcesBoundary>
  );
}
```

Declare a promise returning function in any convenient way.

```ts
interface IUser {
  username: string;
}

export function getUser(id: number) {
  return fetch(`.../users/${id}`).then(response => response.json<IUser>());
}
```

The `useResource` hook takes a resource id, a promise returning function and a dependency list and returns a resource for a provided function.

```tsx
import { useResource } from 'react-use-resource';

export function User() {
  const resource = useResource('USER', getUser, [42]);

  return (
    <h1>{ resource.read().username }<h1>
  );
};
```

Resource id should be unique for a rendered component tree. Variables from a dependency list are passed down to a function as an arguments. Cached resource is invalidated upon a component unmount.

### Request cancellation

Ideally, upon a dependency list change we want to cancel a previous outgoing request. In order to achieve this our function should return not a simple promise but a tuple of a promise and a cancellation function.

```ts
export function getUser(id: number): [Promise<IUser>, () => void] {
  const controller = new AbortController();
  const signal = controller.signal;

  const promise = fetch(`.../users/${id}`, { signal }).then(response => response.json<IUser>());

  return [promise, controller.abort];
}
```

### SSR

We can pass a `cache` property to `ResourcesBoundary`. All data will be written to and read from this record.

```tsx
const cache: Record<string, any> = {};

<ResourcesBoundary cache={cache}>
  <Application />
</ResourcesBoundary>
```