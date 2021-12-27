import Link from 'next/link';
import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';

import { FiCalendar, FiUser } from 'react-icons/fi';

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
    <main className={styles.container}>
      <div className={styles.post}>
        <Link href="#">
          <a>
            <strong>Como utilizar Hooks</strong>
            <p className={styles.subtitle}>
              Pensando em sincronização em vez de ciclos de vida.
            </p>
            <section className={styles.info}>
              <FiCalendar /> <time>15 Mar 2021</time>
              <FiUser /> <p>Joseph Oliveira</p>
            </section>
          </a>
        </Link>
      </div>
      <div className={styles.post}>
        <Link href="#">
          <a>
            <strong>Criando um app CRA do zero</strong>
            <p className={styles.subtitle}>
              Tudo sobre como criar a sua primeira aplicação utilizando Create
              React App
            </p>
            <section className={styles.info}>
              <FiCalendar /> <time>19 Abr 2021</time>
              <FiUser /> <p>Danilo Vieira</p>
            </section>
          </a>
        </Link>
      </div>
      <div className={styles.post}>
        <Link href="#">
          <a>
            <strong>Como utilizar Hooks</strong>
            <p className={styles.subtitle}>
              Pensando em sincronização em vez de ciclos de vida.
            </p>
            <section className={styles.info}>
              <FiCalendar /> <time>15 Mar 2021</time>
              <FiUser /> <p>Joseph Oliveira</p>
            </section>
          </a>
        </Link>
      </div>

      <Link href="#">
        <a className={styles.seeMore}>Carregar mais posts</a>
      </Link>
    </main>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
