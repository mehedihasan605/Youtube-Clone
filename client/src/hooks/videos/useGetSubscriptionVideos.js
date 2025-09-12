import { useInfiniteQuery } from "@tanstack/react-query";
import { useAxiosSecure } from "../axios/useAxiosSecure";
import { useAuthStatus } from "../auth/useAuthStatus";

export const useGetSubscriptionVideos = (options = {}) => {
  const {
    page = 1,
    limit = 6,
    query = "",
    sortBy = "createdAt",
    sortType = "dsc",
  } = options;
  const axiosSecure = useAxiosSecure();
    const { isAuthenticated } = useAuthStatus();

  return useInfiniteQuery({

    queryKey: ["subscriptionFeeds", { page, limit, query, sortBy, sortType }],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await axiosSecure.get(
        `/subscribe/c/subscription-feed`, {
        params: { page: pageParam, limit, query, sortBy, sortType },
      }
      );
      
      return data.data

    },
  
    getNextPageParam: (lastPage) => {
      const { page, limit, total } = lastPage;
      return page * limit < total ? page + 1 : undefined;
    },
    enabled: isAuthenticated,
  });
};
