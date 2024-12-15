import { API_BASE_URL } from "@/config/config";
import { getLocalStorage } from "@/utils/localStorage";

class Shop {
  async getMyShop(): Promise<IResShop> {
    const token = getLocalStorage("token");

    const response = await fetch(`${API_BASE_URL}/shop/my-shop`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`getMyShop failed with status ${response.status}`);
    }

    const data = (await response.json()) as IResShop;
    return data;
  }

  async createShop(reqBody: IReqCreateShop): Promise<IResShop> {
    const token = getLocalStorage("token");

    const response = await fetch(`${API_BASE_URL}/shop/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reqBody),
    });

    if (!response.ok) {
      throw new Error(`createShop failed with status ${response.status}`);
    }

    const data = (await response.json()) as IResShop;
    return data;
  }

  async updateShop(reqBody: IReqUpdateShop): Promise<IResShop> {
    const token = getLocalStorage("token");

    const response = await fetch(`${API_BASE_URL}/shop/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reqBody),
    });

    if (!response.ok) {
      throw new Error(`updateShop failed with status ${response.status}`);
    }

    const data = (await response.json()) as IResShop;
    return data;
  }
}

export const shopAPIs = new Shop();
export default shopAPIs;
