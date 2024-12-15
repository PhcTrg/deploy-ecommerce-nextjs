interface IResShop {
  _id: string;
  shop_name: string;
  shop_bio: string;
  user_id: string;
  createdAt: string;
  updatedAt: string;
}

interface IReqCreateShop {
  shop_name: string;
  shop_bio: string;
}

interface IReqUpdateShop {
  shop_name: string;
  shop_bio: string;
}
