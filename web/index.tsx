import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { BrowserRouter } from 'react-router-dom';
import { ResourcesBoundary } from 'react-use-resource';

import { Application } from './application';

const container = document.getElementById('container');

if (container) {
  if (container.hasChildNodes()) {
    const cache = (window as any).__CACHE__;
    delete (window as any).__CACHE__;

    ReactDOM.hydrate(
      <BrowserRouter>
        <ResourcesBoundary cache={cache}>
          <Application />
        </ResourcesBoundary>
      </BrowserRouter>,
      container
    );
  } else {
    ReactDOM.render(
      <BrowserRouter>
        <ResourcesBoundary>
          <Application />
        </ResourcesBoundary>
      </BrowserRouter>,
      container
    );
  }
}
