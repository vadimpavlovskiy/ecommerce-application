"use client";
import axios from "axios";
import { Raleway } from "next/font/google";
import Image from "next/image";
import React, { useEffect } from "react";
import { useCart } from "../context/CartProvider";
import Link from "next/link";

const raleway = Raleway({ subsets: ["latin"], weight: ["300", "400", "600"] });

export default function CartComponent() {
  const { state: cartState, dispatch } = useCart();
  const savedCartId = localStorage.getItem("cart_id");

  async function updateCart(quantity: number, key: string) {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/cart/update?cart_id=${savedCartId}&quantity=${Number(quantity)}&key=${key}`
      );
      dispatch({ type: "UPDATE_CART", payload: response.data.items });
    } catch (error) {
      console.error(error);
    }
  }

  async function getCart() {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/cart?cart_id=${savedCartId}`
      );
      console.log(response.data);
      dispatch({
        type: "SET_CART",
        payload: { items: response.data.cart.items, totalPrice: response.data.totalPrice },
      });
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  }

  async function deleteItem(key: string) {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/cart/delete?cart_id=${savedCartId}&key=${key}`
      );
      dispatch({ type: "DELETE_ITEM", payload: key });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getCart();
  }, []);

  return (
    <>
      <div className={`drawer z-40 join drawer-end flex w-fit ${raleway.className}`}>
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle peer" />
        <div className="drawer-content">
          <label htmlFor="my-drawer-4" className="drawer-button z-10">
            <div className="m-5 z-10">
              <div className="indicator cursor-pointer z-10">
                <span className="indicator-item indicator-bottom indicator-start badge badge-warning z-10">
                  {Object.keys(cartState.items).length}
                </span>
                <div className="grid h-15 place-items-center z-5">
                  <Image width={30} height={36} src={"/cart.svg"} alt="" />
                </div>
              </div>
            </div>
          </label>
        </div>
        <div className="drawer-side z-50">
          <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
          <div className="menu bg-base-200 text-base-content min-h-full w-1/3 p-4 z-50 max-md:w-3/4">
            {Object.keys(cartState.items).length ? (
              <>
                <h2 className="text-[1.875rem] font-semibold">
                  Your cart: {Object.keys(cartState.items).length} products
                </h2>
                <div className="divider" />
                <div className="flex flex-col gap-y-7">
                  {Object.entries(cartState.items).map(([key, item], index) => (
                    <div className="flex justify-between p-5 items-center max-lg:flex-col" key={index}>
                      <div className="flex gap-y-5 border-b py-4 items-center z-50 max-lg:items-center max-lg:flex-col">
                        <div className="space-y-2 mr-5">
                          <h3 className="text-xl font-semibold max-lg:text-center">{item.sku.product.name}</h3>
                          <Image src={`${item.sku.product.image}`} alt={item.name} width={200} height={200} />
                        </div>
                        <div className="flex flex-col text-xs justify-between space-y-4 max-lg:space-x-4 max-lg:flex-row">
                          <div className="border-b max-lg:border-0">
                            <h4 className="text-xl font-semibold">Properties:</h4>
                            <ul className="flex flex-col italic gap-x-1 pb-4 space-y-1 max-lg:border-r max-lg:border-gray-600 max-lg:pr-4">
                              {item.sku.attribute_options.map((attributeOptions, index) => {
                                return (
                                  <li className="font-bold">{attributeOptions.attribute.name}: {attributeOptions.value}</li>
                                )
                              })}
                            </ul>
                          </div>
                          <div className="flex space-x-5 max-lg:my-5 max-lg:flex-row-reverse max-lg:items-center max-lg:gap-x-4">
                            <div className="join flex items-center w-[7.313rem] justify-around divide-x bg-gray-300 rounded-full text-center">
                              <button onClick={() => updateCart(item.quantity - 1, key)} className="p-3">
                                {"<"}
                              </button>
                              <span className="p-3 pl-4">{item.quantity}</span>
                              <button onClick={() => updateCart(item.quantity + 1, key)} className="p-3">
                                {">"}
                              </button>
                            </div>
                            <div onClick={() => deleteItem(key)}>
                              <Image className="cursor-pointer" src={"/bin.svg"} alt="" width={30} height={30} />
                            </div>
                          </div>
                        </div>
                        <p className="text-[1.563rem] font-semibold ">{item.totalPrice} $</p>
                      </div>
                    </div>
                  ))}
                  <Link className='w-full' href={'/checkout/'}><button className="btn btn-info btn-block text-white className='min-w-full'">Go to checkout</button></Link>
                </div>
              </>
            ) : (
              <div className="flex flex-col p-5 justify-between items-center min-h-screen">
                <div>
                  <h2 className="text-[1.875rem] font-semibold">Your cart is empty</h2>
                  <div className="divider w-full" />
                </div>
                <div className="flex flex-col w-full h-3/4 gap-y-72 justify-between items-center">
                  <Image src={"/bucket.svg"} width={120} height={100} alt="Your bucket is empty" />
                  <Link className="w-full" href={"/store/"}>
                    <button className="btn btn-info btn-block text-white className='min-w-full'">Go to store</button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
