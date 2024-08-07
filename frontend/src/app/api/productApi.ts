import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export const fetchProducts = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_API_URL}/products`
    );
    return response.data;
  } catch (error) {
    console.log("====================================");
    console.log("Error fetching problem", error);
    console.log("====================================");
  }
};
export const fetchProductBySlug = async (slug: string) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_API_URL}/products/${slug}`
    );
    return response.data;
  } catch (error) {
    console.log("====================================");
    console.log("Error fetching problem", error);
    console.log("====================================");
  }
};
