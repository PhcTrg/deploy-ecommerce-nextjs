"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getLocalStorage } from "@/utils/localStorage";

const Menu = () => {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(getLocalStorage("token") != null);
  }, []);

  return (
    <div>
      {/* MENU BUTTON */}
      <button
        className="w-10 h-8 flex flex-col justify-between z-50 relative"
        onClick={() => setOpen(!open)}
      >
        <div className="w-10 h-1 bg-black rounded"></div>
        <div className="w-10 h-1 bg-black rounded"></div>
        <div className="w-10 h-1 bg-black rounded"></div>
      </button>

      {/* MENU LIST */}
      {open && (
        <div className="bg-lama text-white absolute left-0 top-0 w-screen h-screen flex flex-col gap-8 items-center justify-center text-3xl z-40">
          <Link href="/" onClick={() => setOpen(false)}>
            Homepage
          </Link>
          <Link href="/list" onClick={() => setOpen(false)}>
            Products
          </Link>
          <Link href="/orders" onClick={() => setOpen(false)}>
            Orders
          </Link>
          {isLoggedIn && (
            <Link href="/shop" onClick={() => setOpen(false)}>
              Shop
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Menu;
