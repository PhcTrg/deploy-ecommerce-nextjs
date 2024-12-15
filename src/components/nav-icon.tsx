"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import CartModal from "./cart-modal";
import cartAPIs from "@/api/cart";
import { getLocalStorage, removeLocalStorage } from "@/utils/localStorage";

const NavIcons = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cartCount, setCartCount] = useState<number>(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    setIsLoggedIn(getLocalStorage("token") != null);
  }, []);

  useEffect(() => {
    if (isLoggedIn) getCartNumber();
    else {
      setCartCount(0);
    }
  }, [isLoggedIn]);

  const getCartNumber = async () => {
    try {
      setIsLoading(true);

      const response = await cartAPIs.viewCartNumber();

      setCartCount(response.cart_number);
    } catch (error) {
      console.log("Error getCartNumber:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileIconClick = () => {
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      setIsProfileOpen((prev) => !prev);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    removeLocalStorage("token");
    setIsLoggedIn(false);
    setIsLoading(false);
    setIsProfileOpen(false);
    router.push("/");
  };

  return (
    <div className="flex items-center gap-4 xl:gap-6 relative">
      <Image
        src="/profile.png"
        alt="profile-image"
        width={22}
        height={22}
        className="cursor-pointer"
        onClick={handleProfileIconClick}
      />
      {isProfileOpen && (
        <div className="absolute p-4 rounded-md top-12 left-0 bg-white text-sm shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-20">
          <Link href="/profile">Profile</Link>
          <Link href="/orders" className="block mt-2">
            Orders
          </Link>
          <div className="mt-2 cursor-pointer" onClick={handleLogout}>
            {isLoading ? "Logging out" : "Logout"}
          </div>
        </div>
      )}
      {/* <Image
        src="/notification.png"
        alt=""
        width={22}
        height={22}
        className="cursor-pointer"
      /> */}
      <div
        className="relative cursor-pointer"
        onClick={() => setIsCartOpen((prev) => !prev)}
      >
        <Image src="/cart.png" alt="" width={22} height={22} />
        <div className="absolute -top-4 -right-4 w-6 h-6 bg-lama rounded-full text-white text-sm flex items-center justify-center">
          {cartCount}
        </div>
      </div>
      {isCartOpen && <CartModal />}
    </div>
  );
};

export default NavIcons;
