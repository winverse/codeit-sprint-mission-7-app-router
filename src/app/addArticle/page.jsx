import { ArticleEditorContainer } from '@/domains/article/containers/ArticleEditorContainer';
import { parseArticleId } from '@/utils/articleId';

export default async function AddArticlePage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const articleId = parseArticleId(resolvedSearchParams?.id);

  return <ArticleEditorContainer articleId={articleId} />;
}
