export interface IArticle {
  id: number;
  title: string;
  content: string;
}

const ARTICLES: IArticle[] = [
  {
    id: 1,
    title: 'Article 1',
    content: 'Content of Article 1'
  },
  {
    id: 2,
    title: 'Article 2',
    content: 'Content of Article 2'
  },
  {
    id: 3,
    title: 'Article 3',
    content: 'Content of Article 3'
  }
];

export const useArticlesService = () => {
  return {
    getAll: () => {
      return new Promise<IArticle[]>((resolve) => {
        setTimeout(() => {
          resolve(ARTICLES);
        }, 1000);
      });
    },
    getOne: (id: number): [Promise<IArticle>, () => void] => {
      let isCanceled = false;

      let cancel = () => {
        isCanceled = true;
      };

      const promise = new Promise<IArticle>((resolve, reject) => {
        const article = ARTICLES.find((e) => e.id === id);
        const timeoutId = setTimeout(() => {
          if (article) {
            resolve(article);
          } else {
            reject(404);
          }
        }, 1000);

        cancel = () => {
          if (isCanceled) {
            return;
          }
          clearTimeout(timeoutId);
          reject('CANCEL');
        };
      });

      return [promise, cancel];
    }
  };
};
