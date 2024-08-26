import axios from "axios";

export const fetchAllProducts = async () => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_SERVER_API_URL}/products/`
  );
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
    `${process.env.NEXT_PUBLIC_SERVER_API_URL}/products/search?search=${searchValue}&page=${page}`
  );
  response.data.products;
  return response.data.products;
};
