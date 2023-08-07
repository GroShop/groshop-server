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
    path:"cart_product.product"
  },
  from: {
    path: "from",
    select: "email username profile name",
  },
  booking:{
    path:'cart',
    populate : {
      path:"cart_product.product"
    }
  }
};

export default Populate;
