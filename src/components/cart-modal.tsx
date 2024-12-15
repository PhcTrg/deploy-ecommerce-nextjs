"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import cartAPIs from "@/api/cart";
import Link from "next/link";

const CartModal = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cartData, setCartData] = useState<IResViewCart | null>(null);

  const isLoggedIn = localStorage.getItem("token") != null ? true : false;

  useEffect(() => {
    if (isLoggedIn) getCartProducts();
  }, [isLoggedIn]);

  const getCartProducts = async () => {
    try {
      setIsLoading(true);
      const response = await cartAPIs.viewCart();
      setCartData(response);
    } catch (error) {
      console.log("Error fetching viewCart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-max absolute p-4 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white top-12 right-0 flex flex-col gap-6 z-20">
        {!cartData || cartData.shops.length === 0 ? (
          <div className="">Cart is Empty</div>
        ) : (
          <>
            <h2 className="text-xl">Shopping Cart</h2>
            {/* LIST */}
            <div className="flex flex-col gap-8">
              {cartData.shops.map((shop) => (
                <div key={shop.shop_id}>
                  <h3 className="font-medium mb-4">{shop.shop_name}</h3>
                  {shop.products.map((item) => (
                    <div className="flex gap-4 mb-4" key={item._id}>
                      {item.product.product_images[0] && (
                        <Image
                          src={item.product.product_images[0]}
                          alt={item.product.product_name}
                          width={72}
                          height={96}
                          className="object-cover rounded-md"
                        />
                      )}
                      <div className="flex flex-col justify-between w-full">
                        <div>
                          <div className="flex items-center justify-between gap-8">
                            <h3 className="font-semibold">
                              {item.product.product_name}
                            </h3>
                          </div>
                        </div>

                        <div className="flex justify-between text-sm">
                          <div className="p-1 bg-gray-50 rounded-sm flex items-center gap-2">
                            {item.quantity > 1 && (
                              <div className="text-xs text-green-500">
                                {item.quantity} x{" "}
                              </div>
                            )}
                            ${item.product.product_price}{" "}
                            <span className="font-bold text-primary-400">
                              x{item.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            {/* BOTTOM */}
            <div className="">
              <p className="text-gray-500 text-sm mt-2 mb-4">
                Shipping and taxes calculated at checkout.
              </p>
              <div className="flex justify-between text-sm w-full ">
                <Link
                  href="/cart"
                  className="w-full rounded-md py-3 px-4 ring-1 ring-gray-300 text-center"
                >
                  View Cart
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartModal;
