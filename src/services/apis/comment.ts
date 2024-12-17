import { ServiceContext } from '@services/core';
import { isofetch } from '@services/core/helpers';
import { CommentResponse, throwIfError, CreateCommenRequest, UpdateCommentRequest, CommentArrayResponse } from '@services/types';

const CommentApi = (ctx: ServiceContext) => {
  return {
    /**
     * get comment by hashId
     * @param hashId - hashID of comment
     */
    getComment: async (hashId: string): Promise<CommentResponse> => {
      const res = await isofetch(ctx, 'GET', `/comments/${hashId}`, {
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      });
      const resJson = await res.json();

      throwIfError(resJson);

      return resJson;
    },
    /**
     * create new comment
     * @param data - CreateCommenRequest
     */
    createComment: async (data: CreateCommenRequest): Promise<CommentResponse> => {
      const res = await isofetch(ctx, 'POST', '/comments', {
        body: JSON.stringify(data),
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      });
      const resJson = await res.json();

      throwIfError(resJson);

      return resJson;
    },
    /**
     * update comment message and visibility
     * @param hashId - comment hashID
     * @param data - UpdateCommentRequest
     */
    updateComment: async (hashId: string, data: UpdateCommentRequest): Promise<CommentResponse> => {
      const res = await isofetch(ctx, 'PATCH', `/comments/${hashId}`, {
        body: JSON.stringify(data),
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      });

      const resJson = await res.json();

      throwIfError(resJson);

      return resJson;
    },
    /**
     * delete comment
     * @param hashId - comment hashID
     */
    deleteComment: async (hashId: string): Promise<CommentResponse> => {
      const res = await isofetch(ctx, 'DELETE', `/comments/${hashId}`, {
        headers: { Accept: 'application/json' },
      });

      const resJson = await res.json();

      throwIfError(resJson);

      return resJson;
    },
    /**
     * get comments for item
     * @param itemHashId - item hashID
     */
    getCommentsByItemHashId: async (itemHashId: string): Promise<CommentArrayResponse> => {
      const res = await isofetch(ctx, 'GET', `/items/${itemHashId}/comments`, {
        headers: { Accept: 'application/json' },
      });

      const resJson = await res.json();

      throwIfError(resJson);

      return resJson;
    },
  };
};

export default CommentApi;
