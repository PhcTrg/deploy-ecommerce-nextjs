import { API_BASE_URL } from "@/config/config";

class Auth {
  async login(reqBody: IReqLogin): Promise<IResLogin> {
    const response = await fetch(`${API_BASE_URL}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    });

    if (!response.ok) {
      throw new Error(`Login failed with status ${response.status}`);
    }

    const data = (await response.json()) as IResLogin;
    return data;
  }

  async getCurrentUser(): Promise<IResGetUser> {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/user/viewCurrentUser`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`getCurrentUser failed with status ${response.status}`);
    }

    const data = (await response.json()) as IResGetUser;
    return data;
  }

  async updateCurrentUser(reqBody: IReqUpdateUser): Promise<any> {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reqBody),
    });

    if (!response.ok) {
      throw new Error(
        `updateCurrentUser failed with status ${response.status}`
      );
    }

    const data = (await response.json()) as any;
    return data;
  }

  async forgotPassword(
    reqBody: IReqForgotPassword
  ): Promise<IResForgotPassword> {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/user/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reqBody),
    });

    if (!response.ok) {
      throw new Error(`forgotPassword failed with status ${response.status}`);
    }

    const data = (await response.json()) as IResForgotPassword;
    return data;
  }

  async resetPassword(reqBody: IReqResetPassword): Promise<IResResetPassword> {
    const response = await fetch(`${API_BASE_URL}/user/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    });

    if (!response.ok) {
      throw new Error(`resetPassword failed with status ${response.status}`);
    }

    const data = (await response.json()) as IResResetPassword;
    return data;
  }
}

export const authAPIs = new Auth();
export default authAPIs;
