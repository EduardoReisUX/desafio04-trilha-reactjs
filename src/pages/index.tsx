import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home() {
  return (
    <main className="container">
      <div className="post">
        <a href="#">
          <h2>Como utilizar Hooks</h2>
          <h4>Pensando em sincronização em vez de ciclos de vida.</h4>
          <section className="info">
            <time>15 Mar 2021</time>
            <p>Joseph Oliveira</p>
          </section>
        </a>
      </div>
      <div className="post">
        <a href="#">
          <h2>Criando um app CRA do zero</h2>
          <h4>
            Tudo sobre como criar a sua primeira aplicação utilizando Create
            React App
          </h4>
          <section className="info">
            <time>19 Abr 2021</time>
            <p>Danilo Vieira</p>
          </section>
        </a>
      </div>
      <div className="post">
        <a href="#">
          <h2>Como utilizar Hooks</h2>
          <h4>Pensando em sincronização em vez de ciclos de vida.</h4>
          <section className="info">
            <time>15 Mar 2021</time>
            <p>Joseph Oliveira</p>
          </section>
        </a>
      </div>

      <a className="seeMore" href="#">
        Carregar mais posts
      </a>
    </main>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
