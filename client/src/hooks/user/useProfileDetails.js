import { useQuery } from "@tanstack/react-query";
import { useAxiosPublic } from "../axios/useAxiosPublic";

export const useProfileDetails = (userName) => {
  const axiosPublic = useAxiosPublic();
  return useQuery({
    queryKey: ["profileDetails", userName],
    queryFn: async () => {
      try {
        const { data } = await axiosPublic.get(
          `/users/user-profile/${userName}`,
          {
            withCredentials: true,
          }
        );
        return data.data;
      } catch (error) {
        console.log("trycatch error", error);
        throw error;
      }
    },
    enabled: !!userName,
  });
};
