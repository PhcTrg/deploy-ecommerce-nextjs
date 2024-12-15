import dynamic from "next/dynamic";

const OrderContent = dynamic(
  () => import("@/components/order-content").then((mod) => mod.default),
  {
    ssr: false,
  }
);

export default function OrdersPage() {
  return <OrderContent />;
}
