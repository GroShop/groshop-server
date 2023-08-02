const Populate = {
  user: {
    path: "user",
    select: "email username profile_picture",
  },
  product: {
    path: "product search_product",
  },
  wishlist:{
    path:"wishlist_product"
  },
  cart:{
    path:"cart_product"
  },
  from: {
    path: "from",
    select: "email username profile name",
  },
};

export default Populate;
