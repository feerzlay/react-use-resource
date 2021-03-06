import * as React from 'react';

import { Link, useParams } from 'react-router-dom';
import { useResource } from 'react-use-resource';

import { useArticlesService } from './articles.service';

import { ArticlesShowArticle } from './articles-show-article';
import { ArticlesShowErrorBoundary } from './articles-show-error-boundary';

import { Suspense } from './suspense';

export const ArticlesShow: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const articlesService = useArticlesService();
  const articleResource = useResource('ARTICLES::SHOW', articlesService.getOne, [+id]);

  return (
    <>
      <Suspense fallback={null}>
        <ArticlesShowErrorBoundary key={id}>
          <ArticlesShowArticle articleResource={articleResource} />
        </ArticlesShowErrorBoundary>
      </Suspense>

      <Link to={`/${+id - 1}`}>Prev</Link>
      <br />
      <Link to={`/${+id + 1}`}>Next</Link>
    </>
  );
};
