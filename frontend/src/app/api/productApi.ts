import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export const fetchProducts = async () => {
  setTimeout(async () => {
    try {
      const response = await axios.get("http://157.230.208.159/api/products");
      return response.data;
    } catch (error) {
      console.log("====================================");
      console.log("Error fetching problem", error);
      console.log("====================================");
    }
  }, 5000);
};
export const fetchProductById = async (id: number) => {
  try {
    const response = await axios.get(
      `http://157.230.208.159/api/products/${id}`
    );
    return response.data;
  } catch (error) {
    console.log("====================================");
    console.log("Error fetching problem", error);
    console.log("====================================");
  }
};
