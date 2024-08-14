import axios from "axios";

export const fetchAllProducts = async () => {
  const response = await axios.get(`http://127.0.0.1:8000/api/products`);
  return response.data;
};
