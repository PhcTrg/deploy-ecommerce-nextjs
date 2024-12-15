"use client";

import cartAPIs from "@/api/cart";
import { useDisclosure } from "@nextui-org/react";
import { useState } from "react";
import ResultModal from "./modal/result-modal";

const Add = ({
  productId,
  stockNumber,
}: {
  productId: string;
  stockNumber: number;
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [addToCartSuccess, setAddToCartSuccess] = useState<boolean>(false);
  const [quantity, setQuantity] = useState(stockNumber < 1 ? 0 : 1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleUpdateQuantity = (type: "increase" | "decrease") => {
    if (type === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
    if (type === "increase" && quantity < stockNumber) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleAddToCart = async () => {
    try {
      setIsLoading(true);

      const reqBody = {
        product_id: productId,
        quantity: quantity,
      };

      const response = await cartAPIs.addToCart(reqBody);

      if (response) {
        onOpen();
        setAddToCartSuccess(true);
      }
    } catch (error) {
      console.log("Error handleAddToCart:", error);

      onOpen();
      setAddToCartSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <h4 className="font-medium">Choose a Quantity</h4>
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-gray-100 py-2 px-4 rounded-3xl flex items-center justify-between w-32">
              <button
                className="cursor-pointer text-xl disabled:cursor-not-allowed disabled:opacity-20"
                onClick={() => handleUpdateQuantity("decrease")}
                disabled={quantity <= 1}
              >
                -
              </button>
              {quantity}
              <button
                className="cursor-pointer text-xl disabled:cursor-not-allowed disabled:opacity-20"
                onClick={() => handleUpdateQuantity("increase")}
                disabled={quantity === stockNumber}
              >
                +
              </button>
            </div>
            {stockNumber < 1 ? (
              <div className="text-xs">Product is out of stock</div>
            ) : (
              <div className="text-xs">
                (
                <span className="text-blue-500 font-bold">
                  {stockNumber} items
                </span>{" "}
                left)
              </div>
            )}
          </div>
          <button
            onClick={() => handleAddToCart()}
            disabled={isLoading || stockNumber <= 0}
            className="w-36 text-sm rounded-3xl ring-1 ring-lama text-lama py-2 px-4 hover:bg-lama hover:text-white disabled:cursor-not-allowed disabled:bg-pink-200 disabled:ring-0 disabled:text-white disabled:ring-none"
          >
            Add to Cart
          </button>
        </div>
      </div>

      <ResultModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isSuccess={addToCartSuccess}
        successContent={
          "Product is added to your cart. Check your cart for confirmation."
        }
      />
    </>
  );
};

export default Add;
