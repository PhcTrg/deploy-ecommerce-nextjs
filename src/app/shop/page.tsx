import dynamic from "next/dynamic";

const ShopPageContent = dynamic(
  () => import("@/components/shop-page-content"),
  {
    ssr: false,
  }
);

export default function ShopPage() {
  return <ShopPageContent />;
}
