import * as React from 'react';

import { Resource } from 'react-use-resource';

import { IArticle } from './articles.service';

interface IArticesShowArticleProps {
  articleResource: Resource<IArticle>;
}

export const ArticlesShowArticle: React.FC<IArticesShowArticleProps> = ({ articleResource }) => {
  return (
    <>
      <h1>{articleResource.read().title}</h1>
      <article>
        <p>{articleResource.read().content}</p>
      </article>
    </>
  );
};
