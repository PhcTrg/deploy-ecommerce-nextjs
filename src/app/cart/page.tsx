import dynamic from "next/dynamic";

const CartContent = dynamic(
  () => import("@/components/cart-content").then((mod) => mod.default),
  {
    ssr: false,
  }
);

export default function CartPage() {
  return <CartContent />;
}
