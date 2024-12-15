"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import categoryAPIs from "@/api/category";
import { Select, SelectItem, Slider, Button } from "@nextui-org/react";

const Filter = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const [categories, setCategories] = useState<IResCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get("min") ? parseInt(searchParams.get("min")!) : 0,
    max: searchParams.get("max") ? parseInt(searchParams.get("max")!) : 1000,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const data = await categoryAPIs.getAllCategories(token || undefined);
      setCategories(data);
    } catch (error) {
      console.log("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const handlePriceRangeChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      setPriceRange({
        min: value[0],
        max: value[1],
      });
    }
  };

  const handlePriceFilter = () => {
    const params = new URLSearchParams(searchParams);
    params.set("min", priceRange.min.toString());
    params.set("max", priceRange.max.toString());
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mt-12 bg-white p-6 rounded-xl shadow-sm border-2">
      <div className="flex flex-col gap-6">
        {/* Category Filter */}
        <div className="w-full">
          <Select
            label="Category"
            placeholder="Select a category"
            labelPlacement="outside"
            value={searchParams.get("cat") || ""}
            onChange={(e) => handleFilterChange("cat", e.target.value)}
          >
            {[{ _id: "", category_name: "All Categories" }, ...categories].map(
              (category) => (
                <SelectItem key={category._id} value={category._id}>
                  {category.category_name}
                </SelectItem>
              )
            )}
          </Select>
        </div>

        {/* Sort Filter */}
        <div className="w-full">
          <Select
            label="Sort By"
            placeholder="Select sorting"
            labelPlacement="outside"
            value={searchParams.get("sort") || ""}
            onChange={(e) => handleFilterChange("sort", e.target.value)}
          >
            <SelectItem key="desc_price" value="desc_price">
              Price: High to Low
            </SelectItem>
            <SelectItem key="asc_price" value="asc_price">
              Price: Low to High
            </SelectItem>
            <SelectItem key="asc_name" value="asc_name">
              Name: A to Z
            </SelectItem>
            <SelectItem key="desc_name" value="desc_name">
              Name: Z to A
            </SelectItem>
          </Select>
        </div>

        {/* Price Range Slider */}
        <div className="w-full">
          <label className="block text-small font-medium mb-2">
            Price Range
          </label>
          <Slider
            label="Price"
            step={50}
            minValue={0}
            maxValue={1000}
            value={[priceRange.min, priceRange.max]}
            onChange={handlePriceRangeChange}
            className="max-w-md"
            formatOptions={{ style: "currency", currency: "USD" }}
          />
          <div className="mt-4">
            <Button
              color="primary"
              className="bg-primary-300 w-full"
              onClick={handlePriceFilter}
              isLoading={isLoading}
            >
              Apply
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
