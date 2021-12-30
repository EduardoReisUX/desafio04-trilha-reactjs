import { useState } from 'react';
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
  const [seeMore, setSeeMore] = useState(postsPagination.next_page);
  const [posts, setPosts] = useState<Post[]>(postsPagination.results);

  const loadMorePosts = async nextPage => {
    const data = await (await fetch(nextPage)).json();

    const newPostPagination = {
      nextPage: data.next_page,
      results: data.results.map(post => ({
        uid: post.uid,
        first_publication_date: new Date(
          post.first_publication_date
        ).toLocaleDateString('pt-br', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        data: post.data,
      })),
    };

    setSeeMore(newPostPagination.nextPage);
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
                    <FiCalendar /> <time>{post.first_publication_date}</time>
                    <FiUser /> <p>{post.data.author}</p>
                  </section>
                </a>
              </Link>
            </div>
          );
        })
      )}

      {seeMore && (
        <Link href="/">
          <a
            className={styles.seeMore}
            onClick={() => loadMorePosts(seeMore)}
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
      first_publication_date: new Date(
        post.first_publication_date
      ).toLocaleDateString('pt-br', {
        day: '2-digit',
        month: 'short',
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
