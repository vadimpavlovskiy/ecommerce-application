import { CartLayout } from "@/app/layouts/cart/CartLayout";
import Checkout from "../../layouts/forms/CheckoutForm";
import { DeliveryForm } from "@/app/layouts/forms/DeliveryForm";
import CartComponent from "@/app/components/CartComponent";
import { HeaderLayout } from "@/app/layouts/header/HeaderLayout";

export default function PreviewPage() {
  return (
    <>
      <HeaderLayout />
      <main className="">
        <Checkout />
      </main>
    </>
  )
}