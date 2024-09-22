import { OrderData } from "@/app/types/componentTypes/CartComponent";
import { Feature, Sku } from "@/app/types/layoutTypes/CategorySection";
import axios from "axios";

export const addOrderToCart = async (
  cartId: string,
  sku: Sku,
  additionalFeatures: Feature[],
  quantity: number,
) => {
  const orderData: OrderData = {
    cart_id: cartId,
    sku: sku.id,
    additionalFeatures: additionalFeatures,
    quantity,
  };
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_API_URL}/cart/add`,
      orderData,
      {
        headers: {
          Accept: "application/json",
        },
      },
    );
    return response;
  } catch (error) {
    console.error("Error submitting order:", error);
  }
};
