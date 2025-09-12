import { useQuery } from "@tanstack/react-query";
import { useAxiosSecure } from "../axios/useAxiosSecure";
import { useAuthStatus } from "../auth/useAuthStatus";

export const useGetWatchHistory = () => {
  const axiosSecure = useAxiosSecure();
  const { isAuthenticated } = useAuthStatus();
  
  return useQuery({
    queryKey: ["getUserWatchHistory"],
    queryFn: async () => {
      try {
        const { data } = await axiosSecure.get(`/watched/get-watched-videos`);
        return data.data;
      } catch (error) {
        console.error("Watch History", error);
        throw error;
      }
    },
     enabled: isAuthenticated,
  });
};
