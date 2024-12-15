"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import cartAPIs from "@/api/cart";
import Link from "next/link";
import { useDisclosure } from "@nextui-org/react";
import ResultModal from "@/components/modal/result-modal";
import { useRouter } from "next/navigation";

const CartPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cartData, setCartData] = useState<IResViewCart | null>(null);
  const [selectedShops, setSelectedShops] = useState<Set<string>>(new Set());
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [checkoutSuccess, setCheckoutSuccess] = useState<boolean>(false);
  const [checkoutMessage, setCheckoutMessage] = useState<string>("");
  const router = useRouter();

  const isLoggedIn = localStorage.getItem("token") != null ? true : false;

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    fetchOrders();
  }, [isLoggedIn, router, fetchOrders]);

  const getCartProducts = async () => {
    try {
      setIsLoading(true);
      const response = await cartAPIs.viewCart();
      setCartData(response);

      // Calculate total price across all shops
      const total = response.shops.reduce((shopSum, shop) => {
        return (
          shopSum +
          shop.products.reduce(
            (productSum, item) =>
              productSum + item.product.product_price * item.quantity,
            0
          )
        );
      }, 0);
      // Remove setTotalPrice since it's not defined
    } catch (error) {
      console.log("Error fetching viewCart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    try {
      setIsLoading(true);

      const reqBody = {
        product_id: productId,
        quantity: quantity,
      };

      await cartAPIs.updateCart(reqBody);

      // Refresh cart after update
      await getCartProducts();
    } catch (error) {
      console.log("Error updating cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      setIsLoading(true);
      await cartAPIs.removeFromCart(productId);

      // Refresh cart after removal
      await getCartProducts();
    } catch (error) {
      console.log("Error removing item from cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateSelectedTotal = () => {
    if (!cartData) return 0;
    return cartData.shops
      .filter((shop) => selectedShops.has(shop.shop_id))
      .reduce((total, shop) => {
        return (
          total +
          shop.products.reduce(
            (shopTotal, item) =>
              shopTotal + item.product.product_price * item.quantity,
            0
          )
        );
      }, 0);
  };

  const handleShopSelection = (shopId: string) => {
    const newSelected = new Set(selectedShops);
    if (newSelected.has(shopId)) {
      newSelected.delete(shopId);
    } else {
      newSelected.add(shopId);
    }
    setSelectedShops(newSelected);
  };

  const handleCheckout = async (shopId: string) => {
    try {
      setIsLoading(true);
      const response = await cartAPIs.checkout(shopId);

      if (response) {
        setCheckoutSuccess(true);
        setCheckoutMessage(
          `Order placed successfully for ${
            cartData?.shops.find((s) => s.shop_id === shopId)?.shop_name
          }`
        );
        onOpen();
        await getCartProducts();
      }
    } catch (error) {
      console.log("Error handling checkout:", error);
      setCheckoutSuccess(false);
      setCheckoutMessage("Failed to place order. Please try again.");
      onOpen();
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-[60vh] px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-semibold">
          Please login to view your cart
        </h1>
        <Link href="/login" className="text-lama hover:underline">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-[60vh] px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 py-8">
        <h1 className="text-2xl font-semibold mb-8">Shopping Cart</h1>

        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : !cartData || cartData.shops.length === 0 ? (
          <div className="text-center">Your cart is empty</div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              {cartData.shops.map((shop) => (
                <div key={shop.shop_id} className="mb-8">
                  <div className="flex items-center gap-4 mb-4">
                    <input
                      type="checkbox"
                      checked={selectedShops.has(shop.shop_id)}
                      onChange={() => handleShopSelection(shop.shop_id)}
                      className="w-4 h-4 text-lama"
                    />
                    <h2 className="text-xl font-semibold">{shop.shop_name}</h2>
                  </div>
                  {shop.products.map((item) => (
                    <div
                      key={item._id}
                      className="flex gap-4 border-b border-gray-200 py-4"
                    >
                      <Link
                        href={`/product/${item.product._id}`}
                        className="w-24 h-24 relative"
                      >
                        <Image
                          src={item.product.product_images[0] || "/product.png"}
                          alt={item.product.product_name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </Link>
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between">
                          <div>
                            <Link
                              href={`/product/${item.product._id}`}
                              className="font-medium hover:text-lama"
                            >
                              {item.product.product_name}
                            </Link>
                            <div className="text-sm text-gray-500 mt-1">
                              Quantity: {item.quantity}
                            </div>
                          </div>
                          <div className="font-semibold">
                            ${item.product.product_price * item.quantity}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex gap-4">
                            <button
                              className="text-gray-500 px-2 disabled:opacity-50"
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.product._id,
                                  item.quantity - 1
                                )
                              }
                              disabled={isLoading || item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className="text-gray-500">
                              {item.quantity}
                            </span>
                            <button
                              className="text-gray-500 px-2 disabled:opacity-50"
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.product._id,
                                  item.quantity + 1
                                )
                              }
                              disabled={
                                isLoading || item.quantity >= item.product.stock
                              }
                            >
                              +
                            </button>
                          </div>
                          <button
                            className="text-red-500 hover:text-red-700 disabled:opacity-50"
                            onClick={() => handleRemoveItem(item._id)}
                            disabled={isLoading}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${calculateSelectedTotal()}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between font-semibold mb-4">
                    <span>Total</span>
                    <span>${calculateSelectedTotal()}</span>
                  </div>
                  {Array.from(selectedShops).map((shopId) => (
                    <button
                      key={shopId}
                      className="w-full bg-lama text-white py-3 rounded-md hover:bg-opacity-90 disabled:opacity-50 mb-2"
                      disabled={isLoading}
                      onClick={() => handleCheckout(shopId)}
                    >
                      Checkout{" "}
                      {
                        cartData.shops.find((s) => s.shop_id === shopId)
                          ?.shop_name
                      }
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ResultModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isSuccess={checkoutSuccess}
        successContent={checkoutMessage}
      />
    </>
  );
};

export default CartPage;
