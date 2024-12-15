"use client";

import { useState } from "react";
import { Button } from "@nextui-org/react";

const Add = ({ product, setOpen }: { product: any; setOpen: any }) => {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex flex-col gap-4">
      {/* QUANTITY */}
      <div className="flex justify-between items-center">
        <span>Quantity</span>
        <div className="flex gap-4 items-center">
          <button
            onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-lama text-white"
          >
            -
          </button>
          <span>{quantity}</span>
          <button
            onClick={() => setQuantity((prev) => prev + 1)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-lama text-white"
          >
            +
          </button>
        </div>
      </div>
      {/* CART BUTTON */}
      <Button
        className="w-full bg-lama text-white p-2 rounded-md"
        onClick={() => setOpen(false)}
      >
        Add to Cart
      </Button>
    </div>
  );
};

export default Add;
