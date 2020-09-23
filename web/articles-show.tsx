import * as React from 'react';

import { Link, useParams } from 'react-router-dom';
import { useResource } from 'react-use-resource';

import { useArticlesService } from './articles.service';

import { ArticlesShowArticle } from './articles-show-article';
import { ArticlesShowErrorBoundary } from './articles-show-error-boundary';

export const ArticlesShow: React.FC = () => {
  const { id } = useParams();
  const articlesService = useArticlesService();
  const article = useResource('ARTICLES::SHOW', articlesService.getOne, [+id]);

  return (
    <>
      <ArticlesShowErrorBoundary key={id}>
        <ArticlesShowArticle article={article} />
      </ArticlesShowErrorBoundary>

      <Link to={`/${+id - 1}`}>Prev</Link>
      <br />
      <Link to={`/${+id + 1}`}>Next</Link>
    </>
  );
};
