import { API_BASE_URL } from "@/config/config";

class Category {
  async getAllCategories(token?: string): Promise<IResCategory[]> {
    const response = await fetch(`${API_BASE_URL}/category/view-all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`getAllCategories failed with status ${response.status}`);
    }

    const data = (await response.json()) as IResCategory[];
    return data;
  }
}

export const categoryAPIs = new Category();
export default categoryAPIs;
