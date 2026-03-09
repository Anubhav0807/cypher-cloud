import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (typeof window !== "undefined") {
//       const status = error.response?.status;
//       const path = window.location.pathname;

//       if (
//         status === 401 &&
//         path !== "/sign-in" &&
//         path !== "/sign-up"
//       ) {
//         window.location.href = "/sign-in";
//       }
//     }

//     return Promise.reject(error);
//   }
// );

export default api;
