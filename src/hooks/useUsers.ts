import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export const useUser = (id: number) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => api.getUserById(id),
  });
};

export const useUserPosts = (id: number) => {
  // Good practice to separate these out instead of over-fetching
  return useQuery({
    queryKey: ['userPosts', id],
    queryFn: () => api.getPostsByUserId(id),
  });
};
