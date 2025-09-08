import { useQuery } from "@tanstack/react-query";
import { useAxiosSecure } from "../axios/useAxiosSecure";

export const useGetWatchlaterVideos = (sort) => {
  const axiosSecure = useAxiosSecure();

  return useQuery({
    queryKey: ["watchlater", sort],
    queryFn: async () => {
      try {
        const { data } = await axiosSecure.get(
          `/watchlater/get-watchlater-videos?sort=${sort}`
        );
        return data.data;
      } catch (error) {
        console.log("Watchlater Error", error);
        throw error;
      }
    },
  });
};
