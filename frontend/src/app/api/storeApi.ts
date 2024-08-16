import axios from "axios";

export const fetchAllProducts = async ({ page }: { page: number }) => {
  const response = await axios.get(
    `http://127.0.0.1:8000/api/products/?page=${page}`
  );
  return response.data;
};
