import * as React from 'react';

import { Link } from 'react-router-dom';
import { useResource } from 'react-use-resource';

import { useArticlesService } from './articles.service';

export const ArticlesList: React.FC = () => {
  const articlesService = useArticlesService();
  const articles = useResource('ARTICLES::LIST', articlesService.getAll, []);

  return (
    <>
      <h1>Articles</h1>
      <ol>
        {articles.read().map((article) => (
          <li key={article.id}>
            <Link to={`/${article.id}`}>{article.title}</Link>
          </li>
        ))}
      </ol>
    </>
  );
};
