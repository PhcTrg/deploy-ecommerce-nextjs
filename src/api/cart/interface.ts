interface IReqAddToCart {
  product_id: string;
  quantity: number;
}

interface IProductIncart {
  _id: string;
  product: {
    _id: string;
    product_name: string;
    product_images: string[];
    product_price: number;
    stock: number;
    category_id: string;
  };
  quantity: number;
}

interface IShopInCart {
  shop_id: string;
  shop_name: string;
  products: IProductIncart[];
}

interface IResViewCart {
  _id: string;
  user_id: string;
  shops: IShopInCart[];
}

interface IResViewCartNumber {
  cart_number: number;
}

interface IReqUpdateCart {
  product_id: string;
  quantity: number;
}
