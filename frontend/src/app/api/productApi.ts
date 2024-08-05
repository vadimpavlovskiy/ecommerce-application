import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export const fetchProducts = async () => {
  setTimeout(async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/products");
      return response.data;
    } catch (error) {
      console.log("====================================");
      console.log("Error fetching problem", error);
      console.log("====================================");
    }
  }, 5000);
};
export const fetchProductBySlug = async (slug: string) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/api/products/${slug}`
    );
    return response.data;
  } catch (error) {
    console.log("====================================");
    console.log("Error fetching problem", error);
    console.log("====================================");
  }
};
