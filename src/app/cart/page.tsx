import dynamic from "next/dynamic";

const CartContent = dynamic(() => import("@/components/cart-content"), {
  ssr: false,
});

export default function CartPage() {
  return <CartContent />;
}
