// import CategoryList from "@/components/category-list";
import ProductList from "@/components/product-list";
import Slider from "@/components/slider";
import { Suspense } from "react";

const HomePage = async () => {
  return (
    <div className="">
      <Slider />
      {/* <div className="mt-24">
        <h1 className="text-2xl px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 mb-12">
          Categories
        </h1>
        <Suspense fallback={"Loading"}>
          <CategoryList />
        </Suspense>
      </div> */}

      <div className="mt-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <h1 className="text-2xl">All Products</h1>
        <Suspense fallback={"Loading"}>
          <ProductList limit={8} />
        </Suspense>
      </div>
    </div>
  );
};

export default HomePage;
