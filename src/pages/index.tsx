import { useState } from 'react';
import Link from 'next/link';
import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';
import Prismic from '@prismicio/client';

import { FiCalendar, FiUser } from 'react-icons/fi';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

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
  const [nextPage, setNextPage] = useState(postsPagination.next_page);
  const [posts, setPosts] = useState<Post[]>(postsPagination.results);

  const loadMorePosts = async () => {
    if (nextPage === null) return;

    const data = await (await fetch(nextPage)).json();

    const newPostPagination = {
      nextPage: data.next_page,
      results: data.results,
    };

    setNextPage(newPostPagination.nextPage);
    setPosts([...posts, ...newPostPagination.results]);
  };

  return (
    <main className={styles.container}>
      {!posts ? (
        <p>Carregando...</p>
      ) : (
        posts.map(post => {
          return (
            <div key={post.uid} className={styles.post}>
              <Link href={`/post/${post.uid}`}>
                <a>
                  <strong data-hover={post.data.title}>
                    {post.data.title}
                  </strong>
                  <p className={styles.subtitle}>{post.data.subtitle}</p>
                  <section className={styles.info}>
                    <FiCalendar />{' '}
                    <time>
                      {format(
                        new Date(post.first_publication_date),
                        'dd MMM yyyy',
                        {
                          locale: ptBR,
                        }
                      )}
                    </time>
                    <FiUser /> <p>{post.data.author}</p>
                  </section>
                </a>
              </Link>
            </div>
          );
        })
      )}

      {nextPage && (
        <Link href="/">
          <a
            className={styles.seeMore}
            onClick={loadMorePosts}
            data-hover="Carregar mais posts"
          >
            Carregar mais posts
          </a>
        </Link>
      )}
    </main>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
      pageSize: 2,
    }
  );

  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
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
