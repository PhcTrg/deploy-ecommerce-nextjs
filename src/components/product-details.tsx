"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Add from "./add";
import { notFound, useRouter } from "next/navigation";
import productAPIs from "@/api/product";
import ProductImages from "./product-image";

const ProductDetails = ({ id }: { id: string }) => {
  const [product, setProduct] = useState<IResProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productAPIs.getProductDetail(id);

        setProduct(response);
      } catch (error) {
        console.log("Error fetching product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col lg:flex-row gap-16">
      {/* IMG */}
      <div className="w-full lg:w-1/2 lg:sticky top-20 h-max">
        <ProductImages items={product.product_images} />
      </div>
      {/* TEXTS */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        <h1 className="text-4xl font-medium">{product.product_name}</h1>
        {/* <p className="text-gray-500">{product.description}</p> */}
        <div className="h-[2px] bg-gray-100" />
        {/* {product.product_price === product.priceData?.discountedPrice ? ( */}
        <h2 className="font-medium text-2xl">${product.product_price}</h2>
        {/* ) : (
          <div className="flex items-center gap-4">
            <h3 className="text-xl text-gray-500 line-through">
              ${product.priceData?.price}
            </h3>
            <h2 className="font-medium text-2xl">
              ${product.priceData?.discountedPrice}
            </h2>
          </div>
        )} */}
        <div className="h-[2px] bg-gray-100" />
        {/* {product.variants && product.productOptions ? (
          <CustomizeProducts
            productId={product._id!}
            variants={product.variants}
            productOptions={product.productOptions}
          />
        ) : ( */}
        <Add productId={product._id!} stockNumber={product.stock || 0} />
        {/* )} */}
        {/* <div className="h-[2px] bg-gray-100" />
        {product.additionalInfoSections?.map((section: any) => (
          <div className="text-sm" key={section.title}>
            <h4 className="font-medium mb-4">{section.title}</h4>
            <p>{section.description}</p>
          </div>
        ))}
        <div className="h-[2px] bg-gray-100" /> */}
        {/* REVIEWS */}
        {/* <h1 className="text-2xl">User Reviews</h1>
        <Suspense fallback="Loading...">
          <Reviews productId={product._id!} />
        </Suspense> */}
      </div>
    </div>
  );
};

export default ProductDetails;
