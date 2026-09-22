import axios from "axios";

const api =
  axios.create(
    {
      baseURL:
        import.meta
          .env
          .VITE_API_BASE_URL ||
        "http://localhost:5000/api/v1",
      withCredentials: true,
    },
  );

api.interceptors.response.use(
  (
    response,
  ) =>
    response,
  (
    error,
  ) => {
    console.error(
      "API Error:",
      error
        .response
        ?.data
        ?.message ||
        error.message,
    );
    return Promise.reject(
      error,
    );
  },
);

export default api;
