import * as React from 'react';

import { Resource } from 'react-use-resource';

import { IArticle } from './articles.service';

interface IArticesShowArticleProps {
  article: Resource<IArticle>;
}

export const ArticlesShowArticle: React.FC<IArticesShowArticleProps> = ({ article }) => {
  return (
    <>
      <h1>{article.read().title}</h1>
      <article>
        <p>{article.read().content}</p>
      </article>
    </>
  );
};
