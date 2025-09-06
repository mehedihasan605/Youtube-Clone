import { useQuery } from "@tanstack/react-query";
import { useAxiosSecure } from './../axios/useAxiosSecure';

export const useCurrentUser = () => {
  const axiosSecure = useAxiosSecure();
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const { data } = await axiosSecure.get("/users/current-user");
        return data.data;
      } catch (error) {
        return null;
      }
    },
    retry: false, // 401 error হলে আবার try না করুক
    refetchOnWindowFocus: false, // ফোকাস করলে আবার fetch না করুক
    onSuccess: (data) => {
      if (data) {
        console.log("User found:", data);
      }
    },
    onError: (error) => {
      if (error.response?.status !== 401) {
        console.error("Unexpected error fetching user:", error);
      }
    },
  });
};
