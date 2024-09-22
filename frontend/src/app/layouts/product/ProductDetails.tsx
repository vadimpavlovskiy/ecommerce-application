"use client";
import DOMPurify from "isomorphic-dompurify";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Raleway } from "next/font/google";
import axios from "axios";
import { OrderData } from "@/app/types/componentTypes/CartComponent";
import { useCart } from "@/app/context/CartProvider";
import { Feature, Product, Sku } from "@/app/types/layoutTypes/CategorySection";
import { addOrderToCart } from "@/app/api/cartApi";
const raleway = Raleway({ subsets: ["latin"], weight: ["300", "400", "600"] });

const ProductDetails = ({
  options,
  productData,
}: {
  options: any;
  productData: Product;
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedVariant, setSelectedVariant] = useState<Sku | null>(null);
  const [selectedImage, setSelectedImage] = useState(productData.image);
  const [additionalFeatures, setAdditionalFeatures] = useState<Feature[] | []>(
    [],
  );
  const sanitizedThumbnail = DOMPurify.sanitize(String(productData.thumbnail));
  const sanitizedDescription = DOMPurify.sanitize(
    String(productData.description),
  );
  const [selectedOptions, setSelectedOptions] = useState();

  const { state: cartState, dispatch } = useCart();
  const [cartId, setCartId] = useState(() => {
    // Generate or retrieve a cart ID
    let savedCartId = localStorage.getItem("cart_id");
    if (!savedCartId) {
      savedCartId = `cart_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("cart_id", savedCartId);
    }
    return savedCartId;
  });

  const handleFeatureChange = (feature: Feature) => {
    setAdditionalFeatures((prev: any) =>
      prev.includes(feature)
        ? prev.filter((f: Feature) => f.id !== feature.id)
        : [...prev, feature],
    );
  };

  const handleChange = (e: any, property: string) => {
    const value = e.target.value;

    const setNewVariant: Sku[] = productData.skus.filter((sku: Sku) => {
      return sku.attribute_options.some(
        (attributeOption) =>
          attributeOption.attribute.name === property &&
          attributeOption.value === value,
      );
    });

    if (setNewVariant.length > 0) {
      setSelectedVariant(setNewVariant[0]);
    }
    if (setNewVariant[0].images.length !== 0) {
      setSelectedImage(setNewVariant[0].images[0].name);
    } else {
      setSelectedImage(productData.image);
    }
  };
  console.log(selectedVariant);
  const handleSubmitOrder = async () => {
    try {
      if (selectedVariant) {
        const res = addOrderToCart(
          cartId,
          selectedVariant,
          additionalFeatures,
          quantity,
        );
        console.log(res);
        // dispatch({ type: "ADD_ITEMS", payload: res. });
      }
    } catch (error) {
      console.error("Error submitting order:", error);
    }
  };
  return (
    <div className={`${raleway.className} font-normal text-[1.25rem] w-full`}>
      <div className="flex max-xl:flex-col w-full">
        <div className={"flex flex-col w-fit mr-5"}>
          <div className="relative flex flex-col justify-between w-[600px] h-[687px] flex-shrink-0 max-xl:h-[443px] max-xl:max-w-full">
            <Image
              src={selectedImage}
              layout="fill"
              objectFit="cover"
              alt="heroSection"
            />
          </div>
          <div className={"flex flex-row gap-x-2 mt-1 p-2"}>
            {selectedVariant
              ? selectedVariant.images.map((image, index) => (
                  <Image
                    onClick={() => setSelectedImage(image.name)}
                    className={
                      "rounded-xl cursor-pointer transition duration-400 hover:scale-105"
                    }
                    key={index}
                    src={image.name}
                    width={70}
                    height={70}
                    alt={""}
                  />
                ))
              : ""}
          </div>
        </div>
        <div className="flex flex-col">
          <h2 className={`${raleway.className} font-semibold text-[2.5rem]`}>
            {productData.name}
          </h2>
          <div className="flex gap-x-5">
            <span className="flex items-center">
              <Image
                src={"/length.svg"}
                width={15}
                height={15}
                className="mr-1"
                alt="Product length"
              />{" "}
              L: {productData.length}
            </span>
            <span className="flex items-center">
              <Image
                src={"/width.svg"}
                alt="Product length"
                width={15}
                height={15}
                className="mr-1"
              />
              W: {productData.width}
            </span>
            <span className="flex items-center">
              <Image
                src={"/height.svg"}
                alt="Product length"
                width={1}
                height={1}
                className="mr-1"
              />
              H: {productData.height}
            </span>
          </div>
          <div>
            <div
              className="my-[2.5rem]"
              dangerouslySetInnerHTML={{ __html: sanitizedThumbnail }}
            />
          </div>
          <div className="flex flex-col gap-y-7">
            <div>
              <p
                className={`${selectedVariant?.discounted_price ? "line-through" : ""} p-0 font-light`}
              >
                {selectedVariant?.price
                  ? `${selectedVariant.price} $`
                  : `${productData.skus[0].price} $`}
              </p>
              <p className={`text-[1.875rem]`}>
                {selectedVariant?.discounted_price
                  ? `${selectedVariant.discounted_price} $`
                  : `${productData.skus[0].discounted_price} $`}
              </p>
            </div>
            <div>
              <div className="flex w-full flex-col gap-x-4 gap-y-5 p-5 border rounded-xl">
                {Object.entries(options).map(([name, values]) => (
                  <label
                    htmlFor={name}
                    className="form-control w-full max-w-xs"
                  >
                    <div className="label">
                      <span className="label-text text-xl font-semibold">
                        {name}
                      </span>
                    </div>
                    <select
                      className="select select-bordered"
                      name={name}
                      id={name}
                      onChange={(e) => handleChange(e, name)}
                    >
                      <option disabled selected>
                        Pick one
                      </option>
                      {Object.values(values).map((value, index) => (
                        <option value={value}>{value}</option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex w-full justify-between gap-x-4 gap-y-5 p-5 border rounded-xl">
              <div className="w-1/3">
                <h3 className="">Additional features:</h3>
                <div className="flex flex-col">
                  <div className="form-control">
                    {productData.features.map((feature: Feature, index) => {
                      return (
                        <label className="label cursor-pointer flex justify-start gap-x-2">
                          <input
                            type="checkbox"
                            className="checkbox"
                            value={String(feature.name).toLowerCase()}
                            onChange={(e) => handleFeatureChange(feature)}
                          />
                          <span className="label-text">
                            {feature.name} (+{feature.price}$)
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-3/4 flex items-center mt-4 gap-x-5">
            <div className="join flex items-center w-[7.313rem] justify-around divide-x bg-gray-100 rounded-full text-center">
              <button
                onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
                className="p-3"
              >
                {"<"}
              </button>
              <span className="p-3 pl-4">{quantity}</span>
              <button
                onClick={() => setQuantity((prev) => Math.max(prev + 1, 1))}
                className="p-3"
              >
                {">"}
              </button>
            </div>
            <button
              onClick={() => handleSubmitOrder()}
              className="btn btn-info text-white"
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
      <div className="mt-[9.375rem]">
        <h2 className={`${raleway.className} text-[1.563rem] font-semibold`}>
          Description
        </h2>
        <div
          className="my-[2.5rem]"
          dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
        />
      </div>
      <div className="w-full">
        <h2 className={`${raleway.className} text-[1.563rem] font-semibold`}>
          Product features
        </h2>
        <div className="my-[2.5rem] w-full flex flex-wrap gap-y-4 gap-x-4">
          {productData.custom_properties.map((property, index) => {
            return (
              <div
                className="flex w-[calc(50%-1rem)] justify-between border-b-2"
                key={index}
              >
                <span className="p-0 pb-4">{property.key}</span>
                <span>{property.value}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
