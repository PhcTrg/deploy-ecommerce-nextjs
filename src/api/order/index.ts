import { API_BASE_URL } from "@/config/config";

class Order {
  async getMyOrders(): Promise<IMyOrder[]> {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/order/my-orders`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`getMyOrders failed with status ${response.status}`);
    }

    const data = (await response.json()) as IMyOrder[];
    return data;
  }

  async getShopOrders(shop_id: string): Promise<IShopOrder[]> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/order/shop/${shop_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`getShopOrders failed with status ${response.status}`);
    }

    const data = (await response.json()) as IShopOrder[];
    return data;
  }

  async updateOrderStatus(orderId: string, status: string): Promise<any> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/order/${orderId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error(
        `updateOrderStatus failed with status ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  }
}

export const orderAPIs = new Order();
export default orderAPIs;
