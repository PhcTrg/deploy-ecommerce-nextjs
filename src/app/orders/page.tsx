"use client";

import orderAPIs from "@/api/order";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

const OrdersPage = () => {
  const [orders, setOrders] = useState<IMyOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("token") != null);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    fetchOrders();
  }, [isLoggedIn, router]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const data = await orderAPIs.getMyOrders();
      setOrders(data);
    } catch (error) {
      console.log("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-[60vh] px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 py-8">
      <h1 className="text-2xl font-semibold mb-8">My Orders</h1>

      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : orders.length === 0 ? (
        <div className="text-center">No orders found</div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border border-gray-200 rounded-lg p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID: {order._id}</p>
                  <p className="text-sm text-gray-500">
                    Date: {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="px-3 py-1 rounded-full text-sm bg-lama text-white">
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {order.products.map((item) => (
                  <div
                    key={item.product_id}
                    className="flex justify-between items-center border-b border-gray-100 pb-4"
                  >
                    <div className="flex gap-4">
                      <div className="w-16 h-16 relative">
                        <Image
                          src={item.product_images[0] || "/product.png"}
                          alt={item.product_name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{item.product_name}</p>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium">${item.product_price}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-right">
                <p className="text-lg font-semibold">
                  Total: ${order.total_amount}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
