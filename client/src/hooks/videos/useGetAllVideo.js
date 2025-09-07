import { useInfiniteQuery } from "@tanstack/react-query";
import { useAxiosPublic } from "../axios/useAxiosPublic";

export const useGetAllVideo = ({ query = "", sortBy = "createdAt", sortType = "dsc" } = {}) => {
  const axiosPublic = useAxiosPublic();
  const LIMIT = 6;

  return useInfiniteQuery({
    queryKey: ["getVideos", { query, sortBy, sortType }],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await axiosPublic.get(`/videos`, {
        params: { page: pageParam, limit: LIMIT, query, sortBy, sortType },
      });
      console.log(data)
      // backend response should be { videos: [...], total, page, limit }
      return data;
    },
    getNextPageParam: (lastPage) => {
      const { page, limit, total } = lastPage;
      return page * limit < total ? page + 1 : undefined;
    },
  });
};
