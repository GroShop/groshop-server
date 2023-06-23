const Populate = {
  user: {
    path: "user",
    select: "email username profile_picture",
  },
  product: {
    path: "product search_product",
  },
  from: {
    path: "from",
    select: "email username profile name",
  },
};

export default Populate;
