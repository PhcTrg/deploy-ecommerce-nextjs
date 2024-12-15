import { Suspense } from "react";
import dynamic from "next/dynamic";

// Import the client component
const ProductDetails = dynamic(() => import("@/components/product-details"), {
  ssr: false,
});

const ProductDetailSinglePage = ({ params }: { params: { id: string } }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductDetails id={params.id} />
    </Suspense>
  );
};

export default ProductDetailSinglePage;
