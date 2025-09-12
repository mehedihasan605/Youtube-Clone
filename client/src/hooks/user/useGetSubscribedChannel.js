import { useQuery } from "@tanstack/react-query";
import { useAxiosSecure } from "../axios/useAxiosSecure";

export const useGetSubscribedChannel = () => {
  const axiosSecure = useAxiosSecure();
  return useQuery({
    queryKey: ["subscribedChannel"],
    queryFn: async () => {
      try {
        const { data } = await axiosSecure.get("/subscribe/c/subscribed");
        return data.data;
      } catch (error) {
        console.error("trycatch error", error);
        throw error;
      }
    },
  });
};
