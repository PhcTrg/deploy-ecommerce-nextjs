"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import productAPIs from "@/api/product";

const ProductList = ({
  limit,
  searchParams,
}: {
  limit?: number;
  searchParams?: {
    cat?: string;
    min?: string;
    max?: string;
    sort?: string;
    search?: string;
  };
}) => {
  const [products, setProducts] = useState<IResProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");

        // Pass filters to getAllProducts
        const data = await productAPIs.getAllProducts(token || undefined, {
          category_id: searchParams?.cat,
          min_price: searchParams?.min,
          max_price: searchParams?.max,
          sort: searchParams?.sort,
          search: searchParams?.search,
        });

        // If limit is specified, slice the array
        setProducts(limit ? data.slice(0, limit) : data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [limit, searchParams]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-12 grid grid-cols-3 gap-8">
      {products.length === 0 ? (
        <div>No products found</div>
      ) : (
        products.map((product) => (
          <Link
            href={`/product/${product._id}`}
            className="w-full flex flex-col gap-4"
            key={product._id}
          >
            <div className="relative w-full h-80">
              <Image
                src={product.product_images[0] || "/product.png"}
                alt={product.product_name}
                fill
                sizes="25vw"
                className="absolute object-cover rounded-md z-10 hover:opacity-0 transition-opacity easy duration-500"
              />
              {product.product_images[1] && (
                <Image
                  src={product.product_images[1]}
                  alt={product.product_name}
                  fill
                  sizes="25vw"
                  className="absolute object-cover rounded-md"
                />
              )}
            </div>
            <div className="flex justify-between">
              <span className="font-medium">{product.product_name}</span>
              <span className="font-semibold">${product.product_price}</span>
            </div>
            <button className="rounded-2xl ring-1 ring-lama text-lama w-max py-2 px-4 text-xs hover:bg-lama hover:text-white">
              View Detail
            </button>
          </Link>
        ))
      )}
    </div>
  );
};

export default ProductList;
