import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export const fetchProducts = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_API_URL}/products`
    );
    return response.data;
  } catch (error) {
    ("====================================");
    console.log("Error fetching problem", error);
    ("====================================");
  }
};
export const fetchProductBySlug = async (slug: string) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_API_URL}/products/${slug}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchProductBySearch = async (name: string) => {
  try {
    const res = await axios.get(
      `http://127.0.0.1:8000/api/products/?page=${name}`
    );
    return res.data;
  } catch (err) {
    console.log(err);
  }
};
