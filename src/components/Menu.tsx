"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import shopAPIs from "@/api/shop";

const Menu = () => {
  const [open, setOpen] = useState(false);
  const [hasShop, setHasShop] = useState(false);
  const isLoggedIn = localStorage.getItem("token") != null ? true : false;

  useEffect(() => {
    if (isLoggedIn) checkShop();
  }, [isLoggedIn]);

  const checkShop = async () => {
    try {
      await shopAPIs.getMyShop();
      setHasShop(true);
    } catch (error) {
      console.log("Error checking shop:", error);
      setHasShop(false);
    }
  };

  return (
    <div className="">
      <Image
        src="/menu.png"
        alt=""
        width={28}
        height={28}
        className="cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      />
      {open && (
        <div className="absolute bg-black text-white left-0 top-20 w-full h-[calc(100vh-80px)] flex flex-col items-center justify-center gap-8 text-xl z-10">
          <Link href="/">Home</Link>
          <Link href="/list">Products</Link>
          <Link href="/cart">Cart(1)</Link>
          {isLoggedIn && hasShop && <Link href="/shop">Shop</Link>}
        </div>
      )}
    </div>
  );
};

export default Menu;
