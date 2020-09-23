import {} from 'react/experimental';
import {} from 'react-dom/experimental';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ResourcesBoundary } from 'react-use-resource';

const ArticlesList = React.lazy(() =>
  import('./articles-list').then(({ ArticlesList }) => ({ default: ArticlesList }))
);
const ArticlesShow = React.lazy(() =>
  import('./articles-show').then(({ ArticlesShow }) => ({ default: ArticlesShow }))
);

const Application: React.FC = () => {
  return (
    <BrowserRouter timeoutMs={10000}>
      <ResourcesBoundary>
        <React.Suspense fallback={null}>
          <h2>
            <Link to="/">react-use-resource</Link>
          </h2>
          <React.Suspense fallback={null}>
            <Routes>
              <Route path="/">
                <ArticlesList />
              </Route>
              <Route path="/:id">
                <ArticlesShow />
              </Route>
            </Routes>
          </React.Suspense>
        </React.Suspense>
      </ResourcesBoundary>
    </BrowserRouter>
  );
};

const container = document.getElementById('container');

if (container) {
  ReactDOM.unstable_createRoot(container).render(<Application />);
}
