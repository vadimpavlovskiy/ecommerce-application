import axios from "axios";

export const fetchAllProducts = async () => {
  const response = await axios.get(`http://127.0.0.1:8000/api/products/`);
  return response.data;
};

export const searchProduct = async ({
  searchValue,
  page,
}: {
  searchValue: string;
  page: number;
}) => {
  const response = await axios.get(
    `http://127.0.0.1:8000/api/products/search?search=${searchValue}&page=${page}`
  );
  response.data.products;
  return response.data.products;
};
