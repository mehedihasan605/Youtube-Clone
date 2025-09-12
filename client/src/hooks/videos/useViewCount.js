import { useMutation } from "@tanstack/react-query";
import { useAxiosSecure } from "../axios/useAxiosSecure";

export const useViewCount = () => {
  const axiosSecure = useAxiosSecure();
  return useMutation({
    mutationFn: async (videoId) => {
      const { data } = await axiosSecure.post(`/videos/${videoId}/view`);
      return data;
    },
    onSuccess: (res) => {
     
    },
    onError: (err) => {
      console.error(err || "Views Count Error");
    },
  });
};
