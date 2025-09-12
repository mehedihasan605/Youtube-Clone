import { useQuery } from "@tanstack/react-query";
import { useAxiosSecure } from "../axios/useAxiosSecure";

export const useCurrentUser = () => {
  const axiosSecure = useAxiosSecure();

  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/users/current-user");
      return data.data;
    },
    retry: false,
    refetchOnWindowFocus: false,
    onError: (error) => {
      if (error.response?.status === 401) {
       
        console.log("Unauthorized user, Please login...");
      }
    },
  });
};
