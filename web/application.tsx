import * as React from 'react';
import { Switch, Route, Link } from 'react-router-dom';

const ArticlesList = React.lazy(() =>
  import('./articles-list').then(({ ArticlesList }) => ({ default: ArticlesList }))
);
const ArticlesShow = React.lazy(() =>
  import('./articles-show').then(({ ArticlesShow }) => ({ default: ArticlesShow }))
);

import { Suspense } from './suspense';

export const Application: React.FC = () => {
  return (
    <Suspense fallback={null}>
      <h2>
        <Link to="/">react-use-resource</Link>
      </h2>
      <Suspense fallback={null}>
        <Switch>
          <Route path="/" exact>
            <ArticlesList />
          </Route>
          <Route path="/:id">
            <ArticlesShow />
          </Route>
        </Switch>
      </Suspense>
    </Suspense>
  );
};
