import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, Post } from '../services/api';

export const usePosts = () => {
  return useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam = 1 }) => api.getPosts(pageParam, 10),
    getNextPageParam: (lastPage, allPages) => {
      // JsonPlaceholder returns empty array when no more posts
      return lastPage.length === 10 ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

export const usePost = (id: number) => {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => api.getPostById(id),
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newPost: Omit<Post, 'id'>) => api.createPost(newPost),
    onSuccess: (data) => {
      // Optimistically update the posts list by adding the new post to the top
      // This is an advanced concept that prevents needing to re-fetch the entire list!
      queryClient.setQueryData(['posts'], (oldData: any) => {
        if (!oldData) return oldData;
        const newPages = [...oldData.pages];
        newPages[0] = [data, ...newPages[0]];
        return {
          ...oldData,
          pages: newPages,
        };
      });
    },
  });
};
