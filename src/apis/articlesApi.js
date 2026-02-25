import { requestApi } from './requestApi';
import { parseArticleId } from '@/utils/articleId';
import { toSafeList, toSafeTotalCount } from './utils';

const toArticleListResponse = (payload) => ({
  list: toSafeList(payload),
  totalCount: toSafeTotalCount(payload),
});

const toValidArticleId = (articleId) => {
  const parsedArticleId = parseArticleId(articleId);

  if (parsedArticleId === null) {
    throw new Error('Invalid article id');
  }

  return parsedArticleId;
};

const toOptionalImage = (image) => image?.trim?.() || undefined;
const isNotFoundStatusError = (error) => error?.status === 404;

export async function fetchArticleList(
  { page = 1, pageSize = 10, orderBy = 'recent', keyword = '' } = {},
  requestOptions = {},
) {
  const payload = await requestApi('/articles', {
    query: {
      page,
      pageSize,
      orderBy,
      keyword: keyword.trim(),
    },
    ...requestOptions,
  });

  return toArticleListResponse(payload);
}

export async function fetchArticleDetail(articleId, requestOptions = {}) {
  const validArticleId = toValidArticleId(articleId);
  return requestApi(`/articles/${validArticleId}`, requestOptions);
}

export async function fetchArticleDetailOrNull(articleId, requestOptions = {}) {
  try {
    return await fetchArticleDetail(articleId, requestOptions);
  } catch (error) {
    if (isNotFoundStatusError(error)) {
      return null;
    }

    throw error;
  }
}

export async function createArticle({ title, content, image = '' }) {
  return requestApi('/articles', {
    method: 'POST',
    body: { title, content, image: toOptionalImage(image) },
  });
}

export async function updateArticle({ articleId, title, content, image = '' }) {
  const validArticleId = toValidArticleId(articleId);

  return requestApi(`/articles/${validArticleId}`, {
    method: 'PATCH',
    body: { title, content, image: toOptionalImage(image) },
  });
}

export async function deleteArticle(articleId) {
  const validArticleId = toValidArticleId(articleId);

  return requestApi(`/articles/${validArticleId}`, {
    method: 'DELETE',
  });
}
