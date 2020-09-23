import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { ResourcesBoundary } from 'react-use-resource';

const Articles = React.lazy(() =>
  import('./pages/articles').then(({ Articles }) => ({ default: Articles }))
);

const Application: React.FC = () => {
  return (
    <ResourcesBoundary>
      <React.Suspense fallback={null}>
        <h1>react-use-resource</h1>
        <React.Suspense fallback={null}>
          <Articles />
        </React.Suspense>
      </React.Suspense>
    </ResourcesBoundary>
  );
};

const container = document.getElementById('container');

if (container) {
  ReactDOM.render(<Application />, container);
}
