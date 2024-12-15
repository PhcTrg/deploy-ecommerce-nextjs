import { API_BASE_URL } from "@/config/config";
import { getLocalStorage } from "@/utils/localStorage";

class Cart {
  async addToCart(reqBody: IReqAddToCart): Promise<any> {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/cart/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reqBody),
    });

    if (!response.ok) {
      throw new Error(`addToCart failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  }

  async viewCart(): Promise<IResViewCart> {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/cart/view`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`viewCart failed with status ${response.status}`);
    }

    const data = (await response.json()) as IResViewCart;
    return data;
  }

  async viewCartNumber(): Promise<IResViewCartNumber> {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/cart/viewNumber`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`viewCartNumber failed with status ${response.status}`);
    }

    const data = (await response.json()) as IResViewCartNumber;
    return data;
  }

  async updateCart(reqBody: IReqAddToCart): Promise<any> {
    const token = getLocalStorage("token");

    const response = await fetch(`${API_BASE_URL}/cart/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reqBody),
    });

    if (!response.ok) {
      throw new Error(`updateCart failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  }

  async removeFromCart(productId: string): Promise<any> {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/cart/remove/${productId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`removeFromCart failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  }

  async checkout(shopId: string): Promise<any> {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/cart/checkout/${shopId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`checkout failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  }
}

export const cartAPIs = new Cart();
export default cartAPIs;
