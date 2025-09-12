import { useQueryClient } from '@tanstack/react-query';

export const useAuthStatus = () => {
  const queryClient = useQueryClient();
  const cachedUser = queryClient.getQueryData(['user']);
  const isAuthenticated = Boolean(cachedUser);

  return { isAuthenticated, user: cachedUser || null };
};
