import axios from "axios";
import { useEffect } from "react";


const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const useAxiosSecure = () => {
  useEffect(() => {
    const interceptorId = axiosInstance.interceptors.response.use(
      (res) => {
        return res;
      },
      async (error) => {
        if (error.response.status === 401 || error.response.status === 403) {

          console.log("User LoggedOut");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(interceptorId);
    };
  }, []);
  return axiosInstance;
};


