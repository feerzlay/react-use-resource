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

```ts
interface IUser {
  username: string;
}

export function getUser() {
  return fetch(...).then(response => response.json<IUser>());
}
```

```tsx
import React from 'react';
import { useResource } from 'react-use-resource';

export function User() {
  const resource = useResource('USER', getUser, []);

  return (
    <h1>{ resource.read().username }<h1>
  );
};
```

```tsx
import React, { Suspence } from 'react';
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
