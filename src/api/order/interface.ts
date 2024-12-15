interface IOrderProduct {
  product: {
    _id: string;
    product_name: string;
    product_images: string[];
  };
  quantity: number;
  product_price: number;
  _id: string;
}

interface IShopOrder {
  _id: string;
  user_id: string;
  total_amount: number;
  status: string;
  created_at: string;
  products: IOrderProduct[];
  customer_name: string;
}

interface IMyOrder {
  _id: string;
  shop_name: string;
  total_amount: number;
  status: string;
  created_at: string;
  products: {
    product_id: string;
    product_name: string;
    product_images: string[];
    quantity: number;
    product_price: number;
  }[];
}
