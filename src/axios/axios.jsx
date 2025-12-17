import axios from "axios";

const environment = import.meta.env.VITE_APP_ENV;

const url =
  environment === "test"
    ? import.meta.env.VITE_APP_BASE_TEST_URL
    : environment === "development"
      ? import.meta.env.VITE_APP_BASE_DEV_URL
      : import.meta.env.VITE_APP_BASE_PROD_URL;


export const http = axios.create({
  baseURL: url,
    withCredentials: true,
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

// http.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// http.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (
//       error.response &&
//       error.response.status === 401 &&
//       error.response.data.message === "Session expired or logged in from another device"
//     ) {
//       localStorage.removeItem("user")
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );
