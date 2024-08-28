import { CartLayout } from "@/app/layouts/cart/CartLayout";
import Checkout from "../../layouts/forms/CheckoutForm";
import { DeliveryForm } from "@/app/layouts/forms/DeliveryForm";
import CartComponent from "@/app/components/CartComponent";

export default function PreviewPage() {
  return (
    <main className="mx-[150px] max-lg:mx-[20px]">
      <CartComponent />
      <Checkout />
    </main>
  )
}