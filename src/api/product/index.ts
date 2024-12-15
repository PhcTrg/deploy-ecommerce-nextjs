import { API_BASE_URL } from "@/config/config";

class Product {
  async getAllProducts(
    token?: string,
    filters?: {
      category_id?: string;
      min_price?: string;
      max_price?: string;
      sort?: string;
      search?: string;
    }
  ): Promise<IResProduct[]> {
    let url = `${API_BASE_URL}/products/filter?`;

    // Add filter parameters if they exist
    if (filters?.category_id) url += `category_id=${filters.category_id}&`;
    if (filters?.min_price) url += `min_price=${filters.min_price}&`;
    if (filters?.max_price) url += `max_price=${filters.max_price}&`;
    if (filters?.search) url += `search=${filters.search}&`;
    // Add sort parameter if it exists
    if (filters?.sort) {
      const [order, field] = filters.sort.split("_");
      url += `sort=${order}%20${field}&`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`getAllProducts failed with status ${response.status}`);
    }

    const data = (await response.json()) as IResProduct[];
    return data;
  }

  async getProductDetail(id: string): Promise<IResProductDetail> {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/products/view/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`getAllProducts failed with status ${response.status}`);
    }

    const data = (await response.json()) as IResProductDetail;
    return data;
  }

  async getShopProducts(shopId: string): Promise<IResShopProducts[]> {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/products/shop/${shopId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`getShopProducts failed with status ${response.status}`);
    }

    const data = (await response.json()) as IResShopProducts[];
    return data;
  }

  async createProduct(reqBody: IReqCreateProduct): Promise<IResProduct> {
    const token = localStorage.getItem("token");
    const formData = new FormData();

    // Append product details
    formData.append("product_name", reqBody.product_name);
    formData.append("product_price", reqBody.product_price.toString());
    formData.append("stock", reqBody.stock.toString());
    formData.append("category_id", reqBody.category_id);

    // Append images
    reqBody.images.forEach((image) => {
      formData.append("images", image);
    });

    const response = await fetch(`${API_BASE_URL}/products/add`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`createProduct failed with status ${response.status}`);
    }

    const data = (await response.json()) as IResProduct;
    return data;
  }

  async updateProduct(
    productId: string,
    reqBody: Omit<IReqCreateProduct, "images">
  ): Promise<IResProduct> {
    const token = localStorage.getItem("token");
    const formData = new FormData();

    // Append product details
    formData.append("product_name", reqBody.product_name);
    formData.append("product_price", reqBody.product_price.toString());
    formData.append("stock", reqBody.stock.toString());
    formData.append("category_id", reqBody.category_id);

    const response = await fetch(
      `${API_BASE_URL}/products/update/${productId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`updateProduct failed with status ${response.status}`);
    }

    const data = (await response.json()) as IResProduct;
    return data;
  }

  async deleteProduct(productId: string): Promise<void> {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_BASE_URL}/products/delete/${productId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`deleteProduct failed with status ${response.status}`);
    }
  }
}

export const productAPIs = new Product();
export default productAPIs;
