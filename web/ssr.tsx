process.env.SSR = '1';

import * as fs from 'fs';
import * as path from 'path';
import * as express from 'express';

import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';

import { StaticRouter } from 'react-router-dom';
import { ResourcesBoundary } from 'react-use-resource';

// eslint-disable-next-line
const SSRPrepass = require('react-ssr-prepass');

import { Application } from './application';

const PORT = 8080;

fs.readFile(path.resolve(__dirname, '../lib-web/index.html'), 'utf8', (error, index) => {
  if (error) {
    return;
  }

  const app = express();

  app.get('*', async (request, response, next) => {
    if (request.xhr) {
      return next();
    }

    const extname = path.extname(request.path);
    if (extname !== '') {
      return next();
    }

    const accept = request.accepts('html', 'json', 'xml');
    if (accept !== 'html') {
      return next();
    }

    const cache = {};

    const application = (
      <StaticRouter location={request.url}>
        <ResourcesBoundary cache={cache}>
          <Application />
        </ResourcesBoundary>
      </StaticRouter>
    );

    try {
      await SSRPrepass(application);
    } catch (error) {}

    let html = '';
    try {
      html = ReactDOMServer.renderToString(application);
    } catch (error) {
      response.status(500);
      response.send('500');
      return;
    }

    response.status(200);
    response.send(
      index
        .replace('<div id="container"></div>', `<div id="container">${html}</div>`)
        .replace(
          '<script id="cache"></script>',
          `<script>window.__CACHE__ = ${JSON.stringify(cache)}</script>`
        )
    );
  });

  app.use(express.static(path.resolve(__dirname, '../lib-web')));

  app.listen(PORT, () => {
    console.log(`Listening at ${PORT}`);
  });
});
