"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import shopAPIs from "@/api/shop";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Textarea,
  useDisclosure,
  Spinner,
  Select,
  SelectItem,
} from "@nextui-org/react";
import ResultModal from "@/components/modal/result-modal";
import productAPIs from "@/api/product";
import categoryAPIs from "@/api/category";
import Image from "next/image";
import orderAPIs from "@/api/order";

const ShopPage = () => {
  const [shop, setShop] = useState<IResShop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    shop_name: "",
    shop_bio: "",
  });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [products, setProducts] = useState<IResShopProducts[]>([]);
  const [categories, setCategories] = useState<IResCategory[]>([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [productForm, setProductForm] = useState({
    product_name: "",
    product_price: 0,
    stock: 0,
    category_id: "",
    images: [] as File[],
  });
  const [message, setMessage] = useState("");
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<IResShopProducts | null>(null);
  const [shopOrders, setShopOrders] = useState<IShopOrder[]>([]);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const validStatuses = [
    "Pending",
    "Rejected",
    "Accepted",
    "Delivering",
    "Completed",
  ];

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("token") != null);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    fetchShopData();
    fetchCategories();
  }, [router, isLoggedIn]);

  const fetchShopProducts = useCallback(async () => {
    if (!shop) return;
    try {
      const data = await productAPIs.getShopProducts(shop._id);
      setProducts(data);
    } catch (error) {
      console.log("Error fetching shop products:", error);
    }
  }, [shop]);

  const fetchShopOrders = useCallback(async () => {
    if (!shop) return;
    try {
      const data = await orderAPIs.getShopOrders(shop._id);
      setShopOrders(data);
    } catch (error) {
      console.log("Error fetching shop orders:", error);
    }
  }, [shop]);

  useEffect(() => {
    if (shop) {
      fetchShopProducts();
      fetchShopOrders();
    }
  }, [shop, fetchShopProducts, fetchShopOrders]);

  const fetchShopData = async () => {
    try {
      setIsLoading(true);
      const shopData = await shopAPIs.getMyShop();
      setShop(shopData);
      setFormData({
        shop_name: shopData.shop_name,
        shop_bio: shopData.shop_bio,
      });
    } catch (error: any) {
      if (error.message.includes("404")) {
        setShop(null);
      } else {
        console.log("Error fetching shop data:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoryAPIs.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.log("Error fetching categories:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      if (shop) {
        // Update existing shop
        const updatedShop = await shopAPIs.updateShop(formData);
        setShop(updatedShop);
        setMessage("Shop updated successfully!");
      } else {
        // Create new shop
        const newShop = await shopAPIs.createShop(formData);
        setShop(newShop);
        setMessage("Create new shop successfully!");
      }
      setIsSuccess(true);
      setIsEditing(false);
    } catch (error) {
      console.log("Error saving shop:", error);
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
      onOpen();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProductForm((prev) => ({
        ...prev,
        images: Array.from(e.target.files!),
      }));
    }
  };

  const handleCreateProduct = async () => {
    try {
      setIsLoading(true);
      await productAPIs.createProduct(productForm);
      setIsSuccess(true);
      setIsAddingProduct(false);
      setProductForm({
        product_name: "",
        product_price: 0,
        stock: 0,
        category_id: "",
        images: [],
      });
      fetchShopProducts();
    } catch (error) {
      console.log("Error creating product:", error);
      setIsSuccess(false);
    } finally {
      setMessage("Product created successfully!");
      setIsLoading(false);
      onOpen();
    }
  };

  const handleUpdateProduct = async () => {
    try {
      setIsLoading(true);
      if (!selectedProduct) return;

      await productAPIs.updateProduct(selectedProduct._id, {
        product_name: productForm.product_name,
        product_price: productForm.product_price,
        stock: productForm.stock,
        category_id: productForm.category_id,
      });

      setIsSuccess(true);
      setIsEditingProduct(false);
      setSelectedProduct(null);
      setProductForm({
        product_name: "",
        product_price: 0,
        stock: 0,
        category_id: "",
        images: [],
      });
      fetchShopProducts();
    } catch (error) {
      console.log("Error updating product:", error);
      setIsSuccess(false);
    } finally {
      setMessage("Product updated successfully!");
      setIsLoading(false);
      onOpen();
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      setIsLoading(true);
      await productAPIs.deleteProduct(productId);
      setMessage("Product deleted successfully!");
      setIsSuccess(true);
      onOpen();
      // Refresh the products list
      fetchShopProducts();
    } catch (error) {
      console.log("Error deleting product:", error);
      setMessage("Failed to delete product");
      setIsSuccess(false);
      onOpen();
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      setIsLoading(true);
      await orderAPIs.updateOrderStatus(orderId, newStatus);
      setMessage("Order status updated successfully!");
      setIsSuccess(true);
      // Refresh orders after update
      fetchShopOrders();
    } catch (error) {
      console.log("Error updating order status:", error);
      setMessage("Failed to update order status");
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
      onOpen();
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="flex justify-between items-center p-6">
          <div>
            <h1 className="text-3xl font-semibold">
              {shop ? shop.shop_name : "Create Shop"}
            </h1>
            {shop && (
              <p className="text-sm text-gray-500">
                Created: {new Date(shop.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>
          {shop && !isEditing && (
            <Button
              color="primary"
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
            >
              Edit Shop
            </Button>
          )}
        </CardHeader>
        <CardBody className="p-6 pt-0">
          {isEditing || !shop ? (
            <div className="space-y-4">
              <Input
                label="Shop Name"
                value={formData.shop_name}
                onChange={(e) =>
                  setFormData({ ...formData, shop_name: e.target.value })
                }
                disabled={isLoading}
              />
              <Textarea
                label="Shop Bio"
                value={formData.shop_bio}
                onChange={(e) =>
                  setFormData({ ...formData, shop_bio: e.target.value })
                }
                disabled={isLoading}
              />
              <div className="flex gap-2 justify-end">
                {isEditing && (
                  <Button
                    color="danger"
                    variant="light"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        shop_name: shop?.shop_name || "",
                        shop_bio: shop?.shop_bio || "",
                      });
                    }}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  color="primary"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {shop ? "Save Changes" : "Create Shop"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">About the Shop</h2>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {shop.shop_bio}
                </p>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {shop && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Products</h2>
            <Button
              color="primary"
              onClick={() => setIsAddingProduct(true)}
              disabled={isLoading}
            >
              Add Product
            </Button>
          </div>

          {isAddingProduct ? (
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <h3 className="text-xl font-semibold">Add New Product</h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <Input
                  label="Product Name"
                  value={productForm.product_name}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      product_name: e.target.value,
                    })
                  }
                />
                <Input
                  type="number"
                  label="Price"
                  value={productForm.product_price.toString()}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      product_price: Number(e.target.value),
                    })
                  }
                />
                <Input
                  type="number"
                  label="Stock"
                  value={productForm.stock.toString()}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      stock: Number(e.target.value),
                    })
                  }
                />
                <select
                  className="w-full p-2 rounded-md border"
                  value={productForm.category_id}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      category_id: e.target.value,
                    })
                  }
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.category_name}
                    </option>
                  ))}
                </select>
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <div className="flex gap-2 justify-end">
                  <Button
                    color="danger"
                    variant="light"
                    onClick={() => setIsAddingProduct(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    onClick={handleCreateProduct}
                    disabled={isLoading}
                  >
                    Create Product
                  </Button>
                </div>
              </CardBody>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product._id} className="w-full">
                  <CardBody>
                    <div className="relative w-full h-48 mb-4">
                      <Image
                        src={product.product_images[0] || "/product.png"}
                        alt={product.product_name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <h3 className="font-semibold">{product.product_name}</h3>
                    <p className="text-gray-600">${product.product_price}</p>
                    <p className="text-sm text-gray-500">
                      Stock: {product.stock}
                    </p>
                    <p className="text-sm text-gray-500">
                      Category: {product.category_id.category_name}
                    </p>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button
                        color="danger"
                        variant="light"
                        size="sm"
                        onClick={() => handleDeleteProduct(product._id)}
                        disabled={isLoading}
                      >
                        Delete
                      </Button>
                      <Button
                        color="primary"
                        variant="light"
                        size="sm"
                        onClick={() => {
                          setSelectedProduct(product);
                          setProductForm({
                            product_name: product.product_name,
                            product_price: product.product_price,
                            stock: product.stock,
                            category_id: product.category_id._id,
                            images: [],
                          });
                          setIsEditingProduct(true);
                        }}
                        disabled={isLoading}
                      >
                        Edit
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {(isAddingProduct || isEditingProduct) && (
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <h3 className="text-xl font-semibold">
              {isEditingProduct ? "Update Product" : "Add New Product"}
            </h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              label="Product Name"
              value={productForm.product_name}
              onChange={(e) =>
                setProductForm({
                  ...productForm,
                  product_name: e.target.value,
                })
              }
            />
            <Input
              type="number"
              label="Price"
              value={productForm.product_price.toString()}
              onChange={(e) =>
                setProductForm({
                  ...productForm,
                  product_price: Number(e.target.value),
                })
              }
            />
            <Input
              type="number"
              label="Stock"
              value={productForm.stock.toString()}
              onChange={(e) =>
                setProductForm({
                  ...productForm,
                  stock: Number(e.target.value),
                })
              }
            />
            <select
              className="w-full p-2 rounded-md border"
              value={productForm.category_id}
              onChange={(e) =>
                setProductForm({
                  ...productForm,
                  category_id: e.target.value,
                })
              }
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.category_name}
                </option>
              ))}
            </select>
            {!isEditingProduct && (
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
            )}
            <div className="flex gap-2 justify-end">
              <Button
                color="danger"
                variant="light"
                onClick={() => {
                  setIsAddingProduct(false);
                  setIsEditingProduct(false);
                  setSelectedProduct(null);
                  setProductForm({
                    product_name: "",
                    product_price: 0,
                    stock: 0,
                    category_id: "",
                    images: [],
                  });
                }}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                onClick={
                  isEditingProduct ? handleUpdateProduct : handleCreateProduct
                }
                disabled={isLoading}
              >
                {isEditingProduct ? "Update Product" : "Create Product"}
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      <ResultModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isSuccess={isSuccess}
        successContent={message}
        onAction={() => {
          if (isSuccess && isAddingProduct) {
            window.location.reload();
          }
        }}
      />

      {shop && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Orders</h2>
          <div className="space-y-4">
            {shopOrders.map((order) => (
              <Card key={order._id}>
                <CardBody>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        Order ID: {order._id}
                      </p>
                      <p className="text-sm text-gray-500">
                        Date: {new Date(order.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Customer Name: {order.customer_name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        size="sm"
                        value={order.status}
                        onChange={(e) =>
                          handleUpdateStatus(order._id, e.target.value)
                        }
                        className="w-40"
                        disabled={isLoading}
                      >
                        {validStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </Select>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          order.status === "Completed"
                            ? "bg-green-500"
                            : order.status === "Rejected"
                            ? "bg-red-500"
                            : order.status === "Delivering"
                            ? "bg-blue-500"
                            : order.status === "Accepted"
                            ? "bg-purple-500"
                            : "bg-yellow-500"
                        } text-white`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {order.products.map((item) => (
                      <div
                        key={item._id}
                        className="flex justify-between items-center border-b border-gray-100 pb-4"
                      >
                        <div className="flex gap-4">
                          <div className="relative w-16 h-16">
                            <Image
                              src={
                                item.product.product_images[0] || "/product.png"
                              }
                              alt={item.product.product_name}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                          <div>
                            <p className="font-medium">
                              {item.product.product_name}
                            </p>
                            <p className="text-sm text-gray-500">
                              Quantity: {item.quantity}
                            </p>
                            <p className="text-sm text-gray-500">
                              Price per unit: ${item.product_price}
                            </p>
                          </div>
                        </div>
                        <p className="font-medium">
                          ${item.product_price * item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 text-right">
                    <p className="text-lg font-semibold">
                      Total: ${order.total_amount}
                    </p>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopPage;
