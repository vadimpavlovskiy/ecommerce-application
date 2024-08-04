import axios from "axios";

export const fetchCategories = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/categories");
    return response.data;
  } catch (error) {
    console.log("====================================");
    console.log("Error fetching problem", error);
    console.log("====================================");
  }
};
