interface IResProduct {
  _id: string;
  product_name: string;
  product_images: string[];
  product_price: number;
  shop_id: string;
  createdAt: string;
  updatedAt: string;
}

interface IResProductDetail {
  _id: string;
  product_name: string;
  product_images: string[];
  product_price: number;
  shop_id: string;
  createdAt: string;
  updatedAt: string;
  stock: number;
}

interface IReqCreateProduct {
  product_name: string;
  product_price: number;
  stock: number;
  category_id: string;
  images: File[];
}

interface IResShopProducts extends IResProduct {
  category_id: {
    _id: string;
    category_name: string;
  };
  stock: number;
}
