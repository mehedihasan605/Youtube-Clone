import { useMutation } from "@tanstack/react-query";
import { useAxiosPublic } from "../axios/useAxiosPublic";


export const useRegister = () => {

  const axiosPublic = useAxiosPublic();
  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await axiosPublic.post("/users/register", formData, {
        withCredentials: true,
      });
      return data;
    },
  });
};
