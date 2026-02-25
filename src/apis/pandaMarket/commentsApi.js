import { requestApi } from './request';

const toCommentListResponse = (payload) => ({
  list: Array.isArray(payload?.list) ? payload.list : [],
  nextCursor: payload?.nextCursor ?? null,
});

export async function fetchArticleCommentList({
  articleId,
  limit = 10,
  cursor,
} = {}, requestOptions = {}) {
  const payload = await requestApi(`/articles/${articleId}/comments`, {
    query: { limit, cursor },
    ...requestOptions,
  });

  return toCommentListResponse(payload);
}

export async function createArticleComment({ articleId, content }) {
  return requestApi(`/articles/${articleId}/comments`, {
    method: 'POST',
    body: { content },
  });
}

export async function updateComment({ commentId, content }) {
  return requestApi(`/comments/${commentId}`, {
    method: 'PATCH',
    body: { content },
  });
}

export async function deleteComment(commentId) {
  return requestApi(`/comments/${commentId}`, {
    method: 'DELETE',
  });
}
