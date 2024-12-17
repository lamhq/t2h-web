import { GetServerSidePropsContext } from 'next';
import { createApiClient } from '@services/core';
import { CommentApi } from '@services/apis';
import { CommentArrayResponse } from '@services/types';

export const getCommentByContextQueryHashId = async (ctx: GetServerSidePropsContext<{}>): Promise<CommentArrayResponse> => {
  const hashId = (ctx.query.hashId || '').toString() || '';

  if (hashId.length > 0) {
    const commentApi = createApiClient(CommentApi, ctx);
    const result = (await commentApi.getCommentsByItemHashId(decodeURIComponent(hashId))).reverse();

    return result;
  }

  return undefined;
};
