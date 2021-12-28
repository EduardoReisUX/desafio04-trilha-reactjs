import Link from 'next/link';
import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';
import Prismic from '@prismicio/client';

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

export default function Home({ postsPagination }: HomeProps) {
  return (
    <main className={styles.container}>
      {postsPagination.results.map(post => {
        return (
          <div key={post.uid} className={styles.post}>
            <Link href={`/post/${post.uid}`}>
              <a>
                <strong data-hover={post.data.title}>{post.data.title}</strong>
                <p className={styles.subtitle}>{post.data.subtitle}</p>
                <section className={styles.info}>
                  <FiCalendar /> <time>{post.first_publication_date}</time>
                  <FiUser /> <p>{post.data.author}</p>
                </section>
              </a>
            </Link>
          </div>
        );
      })}
      {/* <div className={styles.post}>
        <Link href="#">
          <a>
            <strong data-hover={'Como utilizar Hooks'}>
              Como utilizar Hooks
            </strong>
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
            <strong data-hover={'Criando um app CRA do zero'}>
              Criando um app CRA do zero
            </strong>
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
            <strong data-hover={'Como utilizar Hooks'}>
              Como utilizar Hooks
            </strong>
            <p className={styles.subtitle}>
              Pensando em sincronização em vez de ciclos de vida.
            </p>
            <section className={styles.info}>
              <FiCalendar /> <time>15 Mar 2021</time>
              <FiUser /> <p>Joseph Oliveira</p>
            </section>
          </a>
        </Link>
      </div> */}

      <Link href="#">
        <a className={styles.seeMore} data-hover="Carregar mais posts">
          Carregar mais posts
        </a>
      </Link>
    </main>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
      pageSize: 100,
    }
  );

  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: new Date(
        post.first_publication_date
      ).toLocaleDateString('pt-br', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results: posts,
      },
    },
  };
};
