import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiosPublic } from "../axios/useAxiosPublic";

export const useLogin = () => {
  const axiosPublic = useAxiosPublic();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await axiosPublic.post("/users/login", formData, {
        withCredentials: true,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
    },
    onError: (err) => {
      console.error(err.response?.data?.message || "Login failed");
    },
  });
};
