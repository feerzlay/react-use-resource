import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import { ResourcesBoundary } from 'react-use-resource';

const ArticlesList = React.lazy(() =>
  import('./articles-list').then(({ ArticlesList }) => ({ default: ArticlesList }))
);
const ArticlesShow = React.lazy(() =>
  import('./articles-show').then(({ ArticlesShow }) => ({ default: ArticlesShow }))
);

const Application: React.FC = () => {
  return (
    <BrowserRouter>
      <ResourcesBoundary>
        <React.Suspense fallback={null}>
          <h2>
            <Link to="/">react-use-resource</Link>
          </h2>
          <React.Suspense fallback={null}>
            <Switch>
              <Route exact path="/">
                <ArticlesList />
              </Route>
              <Route path="/:id">
                <ArticlesShow />
              </Route>
            </Switch>
          </React.Suspense>
        </React.Suspense>
      </ResourcesBoundary>
    </BrowserRouter>
  );
};

const container = document.getElementById('container');

if (container) {
  ReactDOM.render(<Application />, container);
}
