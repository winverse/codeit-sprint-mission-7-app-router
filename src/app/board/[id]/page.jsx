import { notFound } from 'next/navigation';
import { ArticleDetailContainer } from '@/domains/article/containers/ArticleDetailContainer';
import {
  fetchArticleCommentList,
  fetchArticleDetail,
} from '@/apis/pandaMarket';
import { parseArticleId } from '@/utils/articleId';

export default async function BoardDetailPage({ params }) {
  const { id } = await params;
  const articleId = parseArticleId(id);

  if (articleId === null) {
    notFound();
  }

  let article;
  let commentResponse;

  try {
    [article, commentResponse] = await Promise.all([
      fetchArticleDetail(articleId),
      fetchArticleCommentList({ articleId, limit: 10 }),
    ]);
  } catch (error) {
    if (error?.status === 404) {
      notFound();
    }

    throw error;
  }

  return (
    <ArticleDetailContainer
      article={article}
      initialComments={commentResponse.list}
      initialNextCursor={commentResponse.nextCursor}
    />
  );
}
