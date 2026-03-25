import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export const useComments = (postId: number) => {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => api.getCommentsByPostId(postId),
  });
};
