import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import Prismic from '@prismicio/client';
import { getPrismicClient } from '../../services/prismic';
import { RichText } from 'prismic-dom';

import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <div className={styles.post}>
        <main className={styles.container}>
          <strong className={styles.title}>Carregando...</strong>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.post}>
      <section className={styles.banner}>
        <img src={post?.data?.banner.url} alt="banner" />
      </section>

      <main className={styles.container}>
        <strong className={styles.title}>{post?.data?.title || 'title'}</strong>

        <div className={styles.info}>
          <div className={styles.createdAt}>
            <FiCalendar />
            <time>
              {format(new Date(post.first_publication_date), 'dd MMM yyyy', {
                locale: ptBR,
              })}
            </time>
          </div>
          <div className={styles.author}>
            <FiUser />
            <p>{post?.data?.author || 'author '}</p>
          </div>
          <div className={styles.estimatedReadingTime}>
            <FiClock />
            <time>4 min</time>
          </div>
        </div>

        <div className="postContent">
          {post.data.content.map(({ heading, body }, index) => (
            <article key={`content-${index}`} className={styles.article}>
              <h2 className={styles.heading}>{heading}</h2>

              <section
                dangerouslySetInnerHTML={{
                  __html: RichText.asHtml(body.map(item => item)),
                }}
                className={styles.content}
              />
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['posts.uid'],
      pageSize: 100,
    }
  );

  const paths = postsResponse.results.map(post => ({
    params: {
      slug: `${post.uid}`,
    },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {});

  const post = response;

  return { props: { post } };
};
