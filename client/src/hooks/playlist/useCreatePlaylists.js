import { useMutation } from "@tanstack/react-query";
import { useAxiosSecure } from "../axios/useAxiosSecure";
import toast from "react-hot-toast";

export const useCreatePlaylists = () => {
  const axiosSecure = useAxiosSecure();

  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await axiosSecure.post(
        `/playlist/create-playlist`,
        formData
      );
      return data;
    },
  });
};
